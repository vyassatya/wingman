-- Business Readiness Test: submissions table.
-- Run in the Supabase SQL editor. Insert-only for the public anon key; nobody can read rows through the API.

create table if not exists public.readiness_submissions (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  path                   text not null check (path in ('running', 'setup')),
  first_name             text not null check (char_length(first_name) between 1 and 100),
  email                  text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                  text not null check (char_length(phone) between 6 and 30),
  business_name          text not null check (char_length(business_name) between 1 and 200),
  industry               text not null check (char_length(industry) between 1 and 200),
  monthly_revenue        text check (monthly_revenue is null or monthly_revenue in
                           ('Below ₹1L', '₹1–5L', '₹5–20L', '₹20L–₹1Cr', '₹1Cr+')),
  investment_budget      text check (investment_budget is null or investment_budget in
                           ('Below ₹5L', '₹5–10L', '₹10–25L', '₹25–50L', '₹50L–₹1Cr', '₹1Cr+')),
  answers                jsonb not null,   -- {"q1": "<answer text>", ... "q8": "<blocker text>"}
  raw_scores             jsonb not null,   -- {"q1": 0-4, ... "q7": 0-4}  (q8 is not scored)
  overall_score          integer not null check (overall_score between 0 and 100),
  area_scores            jsonb not null,   -- {"<area>": 0-100, ...}
  lowest_area            text not null,
  second_lowest_area     text not null,
  self_reported_blocker  text not null check (char_length(self_reported_blocker) <= 200),
  result_band            text not null,
  recommended_offer      text not null check (recommended_offer in ('Wingman Launch', 'Wingman Cofounder', 'Wingman Scale')),
  utm_source             text check (utm_source   is null or char_length(utm_source)   <= 200),
  utm_medium             text check (utm_medium   is null or char_length(utm_medium)   <= 200),
  utm_campaign           text check (utm_campaign is null or char_length(utm_campaign) <= 200),
  utm_content            text check (utm_content  is null or char_length(utm_content)  <= 200),
  utm_term               text check (utm_term     is null or char_length(utm_term)     <= 200)
);

-- Integrity guard: recompute the score from the 7 scored answers and reject inconsistent rows.
-- Final score = points / 28 x 100, rounded half up. Offer routing is enforced here too.
create or replace function public.readiness_submissions_validate()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  i        int;
  v        numeric;
  points   int := 0;
  rounded  int;
  band     text;
  areas    text[];
  offer    text;
begin
  if jsonb_typeof(new.raw_scores) <> 'object' or jsonb_typeof(new.answers) <> 'object' or jsonb_typeof(new.area_scores) <> 'object' then
    raise exception 'answers, raw_scores and area_scores must be JSON objects';
  end if;
  if (select count(*) from jsonb_object_keys(new.raw_scores)) <> 7 then
    raise exception 'raw_scores must contain exactly q1..q7';
  end if;
  if (select count(*) from jsonb_object_keys(new.answers)) <> 8 then
    raise exception 'answers must contain exactly q1..q8';
  end if;
  for i in 1..7 loop
    if jsonb_typeof(new.raw_scores -> ('q' || i)) is distinct from 'number' then
      raise exception 'raw_scores.q% must be a number', i;
    end if;
    v := (new.raw_scores ->> ('q' || i))::numeric;
    if v not in (0,1,2,3,4) then
      raise exception 'raw_scores.q% must be 0-4', i;
    end if;
    points := points + v::int;
  end loop;

  rounded := (points * 200 + 28) / 56;                     -- integer division = floor
  if new.overall_score <> rounded then
    raise exception 'overall_score % does not match raw_scores (expected %)', new.overall_score, rounded;
  end if;

  if new.self_reported_blocker is distinct from (new.answers ->> 'q8') then
    raise exception 'self_reported_blocker must equal answers.q8';
  end if;

  if new.path = 'running' then
    if new.monthly_revenue is null or new.investment_budget is not null then
      raise exception 'running path needs monthly_revenue and no investment_budget';
    end if;
    areas := array['Founder Capacity','People','Processes','Visibility','Controls','Automation'];
    band := case when rounded >= 90 then 'Strong Scale Foundation'
                 when rounded >= 75 then 'Scale Ready — With Gaps'
                 when rounded >= 60 then 'Almost Scale Ready'
                 when rounded >= 40 then 'Systems Fragile'
                 else 'Not Ready to Scale' end;
    offer := case when new.monthly_revenue in ('Below ₹1L', '₹1–5L', '₹5–20L') then 'Wingman Cofounder' else 'Wingman Scale' end;
  else
    if new.investment_budget is null or new.monthly_revenue is not null then
      raise exception 'setup path needs investment_budget and no monthly_revenue';
    end if;
    areas := array['Customer','Validation','Business Model','Setup','Ownership','Founder Time','Execution'];
    band := case when rounded >= 90 then 'Strong Launch Foundation'
                 when rounded >= 75 then 'Launch Ready — With Gaps'
                 when rounded >= 60 then 'Almost Launch Ready'
                 when rounded >= 40 then 'Foundation Incomplete'
                 else 'Not Ready to Launch' end;
    offer := 'Wingman Launch';
  end if;

  if new.result_band <> band then
    raise exception 'result_band % does not match overall_score (expected %)', new.result_band, band;
  end if;
  if new.recommended_offer <> offer then
    raise exception 'recommended_offer % does not match routing (expected %)', new.recommended_offer, offer;
  end if;
  if not (new.lowest_area = any (areas)) or not (new.second_lowest_area = any (areas)) or new.lowest_area = new.second_lowest_area then
    raise exception 'lowest_area / second_lowest_area must be two different areas of this path';
  end if;
  return new;
end;
$$;

drop trigger if exists readiness_submissions_validate on public.readiness_submissions;
create trigger readiness_submissions_validate
  before insert on public.readiness_submissions
  for each row execute function public.readiness_submissions_validate();

-- Row-level security: insert only. No select, update or delete policy exists, and the grants below match.
alter table public.readiness_submissions enable row level security;

revoke all on table public.readiness_submissions from public, anon, authenticated;
grant insert on table public.readiness_submissions to anon, authenticated;

drop policy if exists "public can insert readiness submissions" on public.readiness_submissions;
create policy "public can insert readiness submissions"
  on public.readiness_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Read your data in the Supabase dashboard (Table Editor / SQL editor) or with the service_role key on a server.
