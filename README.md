# Site

Plain HTML and one stylesheet. Open `index.html` locally, or drag this folder onto Netlify.

Pages: `index.html`, `guide.html`, `products.html`, `work.html`, `about.html`, plus `thanks.html` (form destination).

## Swap before launch

- Name, Instagram handle (`iamsatyavyas`): search all `.html` files.
- Price: every `$[price]` in `index.html` and `products.html`.
- Checkout: `https://example.com/checkout-placeholder` in `products.html` (two buttons).
- Proof, quotes, credentials: everything in `[brackets]` in `products.html`, `work.html`, `about.html`.
- Guide file: replace `assets/guide.pdf`.
- Photo: replace `assets/satya.jpg` (square, 480px). Used at 96px on the home page and 160px on the about page.

## Forms

All three forms (`index.html`, `guide.html`, `work.html`) are Netlify Forms: on a Netlify deploy, submissions land in the Netlify dashboard and redirect to `thanks.html`.

To use Beehiiv for the email forms, replace `action` with the Beehiiv endpoint and remove `data-netlify` and `data-netlify-honeypot` from that form. `thanks.html?from=guide` shows the guide message; `?from=apply` shows the application message.
