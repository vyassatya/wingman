# Site

Plain HTML and one stylesheet. Open `index.html` locally, or drag this folder onto Netlify.

Pages: `index.html`, `guides.html`, `work.html` (pricing), `apply.html?plan=SLUG` (one short form per plan), `about.html`, plus `thanks.html` (form destination). The header on every page comes from `header.js`. `products.html` (the Reset) is kept but not linked from the nav or the home page.

## Swap before launch

- Name, Instagram handle (`iamsatyavyas`): search all `.html` files.
- Checkout: `https://example.com/reset` in `products.html` (two buttons). Swap for your Razorpay link.
- Proof line: edit in `index.html`, `products.html`, `work.html`.
- Guide file: replace `assets/guide.pdf`.
- Photo: replace `assets/satya.jpg` (square, 480px). Used at 96px on the home page and 160px on the about page.

## Forms

`index.html` and `guides.html` use the Beehiiv embed (form id `c59cd420-21fc-4338-82b8-8e6c7f836334`). Card, border and background styling for that form is set in the Beehiiv form designer, not here.

`work.html` is a Netlify Form: on a Netlify deploy, submissions land in the Netlify dashboard and redirect to `thanks.html?from=apply`. If you host elsewhere (Vercel), replace its `action` and remove the `data-netlify` attributes.
- Homepage photo: `assets/satya-cutout.webp` (transparent cutout). Free-guide covers: `assets/guides/1.png` to `4.png`.

## Guides library

`guides.html` lists the guide pages in `guides/*.html`. Each page is built from a PDF in `guides/` (text from the PDF, cover from page 1 saved to `assets/guides/<slug>.png`). The text is public; the "Get the PDF" block is the Beehiiv embed.

## Growth Readiness Test

Route `/growth-readiness` (`growth-readiness.html`, rewritten in `vercel.json`; `_redirects` for Netlify). The "Ready to Grow" nav button and the homepage "Ready to Grow" button go to `/growth-readiness#start`, which opens question 1. Without the hash the landing page shows.

- Scoring and UI: `growth-readiness.js` (scoring has no DOM and verifies the weights sum to 100 on load).
- Supabase: set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `growth-readiness-config.js`; create the table with `supabase/assessment_submissions.sql` (insert-only, no public select).
- Results show only after a successful insert. Until Supabase is configured the email step shows a "not configured" error.
