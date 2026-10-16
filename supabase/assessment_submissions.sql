-- Growth Readiness Test: submissions table.
-- Run in the Supabase SQL editor. Insert-only for the public anon key; nobody can read rows through the API.

create table if not exists public.assessment_submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  first_name            text not null check (char_length(first_name) between 1 and 100),
  email                 text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  business_name         text check (business_name is null or char_length(business_name) <= 200),
  monthly_revenue       text not null check (monthly_revenue in (
                          'Pre-revenue',
                          'Below ₹1L/month',
                          '₹1–5L/month',
                          '₹5–20L/month',
                          '₹20L–₹1Cr/month',
                          '₹1Cr+/month')),
  answers               jsonb not null,   -- {"q1": "<answer text>", ... "q12": "..."}
  raw_scores            jsonb not null,   -- {"q1": 0-4, ... "q12": 0-4}
  overall_score         integer not null check (overall_score between 0 and 100),
  pillar_scores         jsonb not null,   -- {"Founder Capacity": 0-100, ... 7 pillars}
  lowest_pillar         text not null,
  second_lowest_pillar  text not null,
  result_band           text not null,
  utm_source            text check (utm_source   is null or char_length(utm_source)   <= 200),
  utm_medium            text check (utm_medium   is null or char_length(utm_medium)   <= 200),
  utm_campaign          text check (utm_campaign is null or char_length(utm_campaign) <= 200),
  utm_content           text check (utm_content  is null or char_length(utm_content)  <= 200),
  utm_term              text check (utm_term     is null or char_length(utm_term)     <= 200)
);

-- Integrity guard: recompute the score from the 12 raw answers and reject anything inconsistent.
-- Weights: Q1 8, Q2 7, Q3 10, Q4 10, Q5 10, Q6 10, Q7 10, Q8 10, Q9 8, Q10 7, Q11 5, Q12 5 (sum 100).
create or replace function public.assessment_submissions_validate()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  w        int[]  := array[8,7,10,10,10,10,10,10,8,7,5,5];
  pillars  text[] := array['Founder Capacity','People','Process','Metrics','MIS','Controls','Tech & Automation'];
  i        int;
  v        numeric;
  total    numeric := 0;
  rounded  int;
  band     text;
begin
  if jsonb_typeof(new.raw_scores) <> 'object' or jsonb_typeof(new.answers) <> 'object' or jsonb_typeof(new.pillar_scores) <> 'object' then
    raise exception 'answers, raw_scores and pillar_scores must be JSON objects';
  end if;
  if (select count(*) from jsonb_object_keys(new.raw_scores)) <> 12 then
    raise exception 'raw_scores must contain exactly q1..q12';
  end if;
  for i in 1..12 loop
    if jsonb_typeof(new.raw_scores -> ('q' || i)) is distinct from 'number' then
      raise exception 'raw_scores.q% must be a number', i;
    end if;
    v := (new.raw_scores ->> ('q' || i))::numeric;
    if v not in (0,1,2,3,4) then
      raise exception 'raw_scores.q% must be 0-4', i;
    end if;
    total := total + v * w[i];
  end loop;

  rounded := floor(total / 4 + 0.5);                       -- question score = raw/4 * weight, max 100, rounded half up
  if new.overall_score <> rounded then
    raise exception 'overall_score % does not match raw_scores (expected %)', new.overall_score, rounded;
  end if;

  band := case
            when rounded >= 90 then 'STRONG SCALE FOUNDATION'
            when rounded >= 75 then 'SCALE READY — WITH GAPS'
            when rounded >= 60 then 'ALMOST SCALE READY'
            when rounded >= 40 then 'SYSTEMS FRAGILE'
            else 'NOT READY TO SCALE'
          end;
  if new.result_band <> band then
    raise exception 'result_band % does not match overall_score (expected %)', new.result_band, band;
  end if;

  if not (new.lowest_pillar = any (pillars)) or not (new.second_lowest_pillar = any (pillars)) or new.lowest_pillar = new.second_lowest_pillar then
    raise exception 'lowest_pillar / second_lowest_pillar must be two different pillar names';
  end if;
  return new;
end;
$$;

drop trigger if exists assessment_submissions_validate on public.assessment_submissions;
create trigger assessment_submissions_validate
  before insert on public.assessment_submissions
  for each row execute function public.assessment_submissions_validate();

-- Row-level security: insert only. No select, update or delete policy exists, and the grants below match.
alter table public.assessment_submissions enable row level security;

revoke all on table public.assessment_submissions from public, anon, authenticated;
grant insert on table public.assessment_submissions to anon, authenticated;

drop policy if exists "public can insert submissions" on public.assessment_submissions;
create policy "public can insert submissions"
  on public.assessment_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Read your data in the Supabase dashboard (Table Editor / SQL editor) or with the service_role key on a server.
