# Site

Plain HTML and one stylesheet. Open `index.html` locally, or drag this folder onto Netlify.

Pages: `index.html`, `guide.html`, `work.html` (pricing), `apply.html?plan=SLUG` (one short form per plan), `about.html`, plus `thanks.html` (form destination). `products.html` (the Reset) is kept but not linked from the nav or the home page.

## Swap before launch

- Name, Instagram handle (`iamsatyavyas`): search all `.html` files.
- Checkout: `https://example.com/reset` in `products.html` (two buttons). Swap for your Razorpay link.
- Proof line: edit in `index.html`, `products.html`, `work.html`.
- Guide file: replace `assets/guide.pdf`.
- Photo: replace `assets/satya.jpg` (square, 480px). Used at 96px on the home page and 160px on the about page.

## Forms

`index.html` and `guide.html` use the Beehiiv embed (form id `c59cd420-21fc-4338-82b8-8e6c7f836334`). Card, border and background styling for that form is set in the Beehiiv form designer, not here.

`work.html` is a Netlify Form: on a Netlify deploy, submissions land in the Netlify dashboard and redirect to `thanks.html?from=apply`. If you host elsewhere (Vercel), replace its `action` and remove the `data-netlify` attributes.
