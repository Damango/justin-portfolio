# Justin — Portfolio

A one-page portfolio built with **React + TypeScript + Vite** and animated with **Framer Motion**.

## Run it

```bash
npm install
npm run dev       # local dev server at http://localhost:5173
npm run build     # production build in /dist
npm run preview   # preview the production build
```

Requires Node 20.19+.

## Make it yours

All the content is in **`src/data.ts`**. Replace every `[bracketed]` value there: your email, city, links, projects, jobs and posts. You don't need to touch any components.

- **Résumé:** put your PDF at `public/resume.pdf`.
- **Hero keyboard:** the `keys` array in `data.ts` sets each key's label, name, category and one-line description. Keep the `x / y / w / h` positions unless you're changing the layout.
- **Project links:** add `caseStudy`, `source` and `live` URLs to each project.
- **Contact form:** see [Contact form setup](#contact-form-setup) below.

## Contact form setup

The form posts to `api/contact.ts`, a Vercel Function that emails you through [Resend](https://resend.com). It's protected by a same-origin check, a 16 KB size cap, a hidden honeypot field, [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/), a 5-per-hour limit per IP, a 50-per-day overall cap and strict server-side validation. The email is sent as plain text, so nothing a visitor types is ever rendered as HTML.

**Locally**, `npm run dev` serves the API too. With no keys set, it uses Cloudflare's always-pass test keys and prints each message in the terminal instead of sending it.

**To go live on Vercel:**

1. **Resend:** sign up with the inbox you want messages delivered to, then create an API key.
2. **Turnstile:** in the Cloudflare dashboard go to Turnstile → Add widget, and add your domain (plus `localhost` if you want to test real keys locally). Copy the site key and the secret key.
3. **Upstash (optional, recommended):** in Vercel go to Storage → Upstash Redis. It sets `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for you, so rate limits hold across every serverless instance.
4. In Vercel → Settings → Environment Variables, add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, then redeploy. All the options are listed in `.env.example`.

Until you verify a domain in Resend, mail comes from `onboarding@resend.dev`, which can only deliver to your Resend account's email. Hitting Reply goes straight to the visitor. Once you've verified a domain, set `CONTACT_FROM_EMAIL`, for example `Portfolio <hello@yourdomain.com>`.

`vercel.json` also sets security headers for the whole site: Content-Security-Policy, HSTS, no framing, nosniff, and a strict referrer and permissions policy. `npm run preview` sends the same headers, so a production build can be checked locally first.

## What's inside

```
src/
  data.ts                  all copy and content
  styles.css               design tokens, buttons, badges, layout and breakpoints
  App.tsx                  shell: sidebar, mobile drawer, top bar, section transitions, URL hash sync
  components/
    KeyboardStage.tsx      the interactive isometric keyboard in the hero
    Sidebar.tsx            nav with a sliding active pill (shared layoutId)
    ui.tsx                 Button / LinkButton (press springs), StatusBadge, Toast, reveal variants
    Icons.tsx              inline stroke icons
  sections/                Home, Projects, Work, Blog, Contact
```

## Motion details

- Sections cross-fade when you switch between them. The URL updates (`#projects`, `#contact` and so on), so each section has a link you can share, and the browser's Back button works.
- Sidebar and filter highlights slide between items using `layoutId`.
- Buttons lift on hover and press down on click. Their arrows nudge forward.
- **Hero keyboard:**
  - A short "typing" intro plays on load.
  - Keys spring down when you hover or tap them.
  - The whole board tilts gently toward the mouse.
  - The knob turns, the equalizer bars bounce, and the selected tile swaps in.
- Projects reflow with layout animations when you filter or search.
- Status badges have small idle animations: Beta spins slowly and In progress rings now and then.
- **Contact form:** fields shake when they're invalid. The copy button's icon changes to a check when you click it, and Send shows a loading state, then a sent or error badge.
- Cards and table rows fade in one after another as you scroll to them.

All motion respects the visitor's **reduced-motion** setting through `<MotionConfig reducedMotion="user">`.

## Responsive behaviour

| Width | Layout |
| --- | --- |
| > 960px | Sidebar that stays in place while the page scrolls, hero side by side |
| 641–960px | Sidebar becomes a top bar with a slide-out drawer, hero stacks |
| ≤ 640px | Tables turn into stacked rows, the keyboard scales down, and the hero text reads "Tap" instead of "Hover" |

The keyboard resizes to fit whatever space its panel has.
