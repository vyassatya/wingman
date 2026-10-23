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

## Business Readiness Test

Route `/readiness` (`readiness.html`, `readiness.js`). `/growth-readiness` redirects to it (`vercel.json`, `_redirects`; `growth-readiness.html` is a fallback stub). `/idea-readiness` is a placeholder page. The homepage "Take the 2-min test" button and the nav "Ready to Grow" button open the test.

- Two paths (already running / setting up), 4 info screens, 7 scored questions + 1 unscored, result after a successful Supabase insert.
- Supabase: `SUPABASE_URL` and `SUPABASE_ANON_KEY` live in `growth-readiness-config.js`; each completed test inserts one row into `public.assessments` (email, score, verdict, weakest, answers; insert-only RLS, no public select).
