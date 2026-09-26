# Oikos Map Builder

A free landing page and interactive tool for creating a custom Oikos Map: a simple visual way to name, pray for, and intentionally love the people God has placed around you.

Live site: [oikosmap.com](https://www.oikosmap.com/)

Powered by [Love on The World](https://www.loveontheworld.com) and [Thy Kingdom Network](https://www.thykingdom.net).

## Features

- Build an Oikos Map directly on the landing page
- Bulk add: paste a list of names (newline, comma or semicolon separated) and the
  map fills in, de-duplicated against what is already there
- Canvas grows automatically so large first circles never overlap; small maps
  keep the original 1100x820 export size
- Add first-circle people and second-circle branches
- Track relationship type, prayer focus, and notes
- Use the Map Coach to choose a person for today, copy a concrete next step, and move them through Pray, Care, Share, and Disciple
- See a map-readiness checklist, start with an outreach-team template, and use a built-in five-minute prayer focus for the person in front of you
- Save locally in the visitor's browser
- Download maps as PNG, SVG, or editable JSON
- Import a saved JSON map
- Download a simple prayer-plan text file
- Copy a private shareable link that carries the whole map inside the URL
- Confetti celebration when someone reaches the Disciple stage
- Installable PWA with offline support (web app manifest + service worker)
- Visible FAQ section backed by matching FAQPage structured data
- Per-page HTML entries (`index.html`, `growth.html`, `connect.html`) with tailored titles, descriptions, canonicals, and Open Graph tags
- Real 1200x630 `og-image.png` for social sharing
- Share/copy the live tool link
- Six-part "Oikos Journey" email sequence sent through Resend, queued at signup
- Contextual email capture beneath the builder that reacts to the map you just made
- Token-gated one-click unsubscribe that cancels any still-queued emails
- Collect lead emails through an optional Vercel function that forwards to a GoHighLevel workflow webhook
- Dedicated `/growth` page connected to I Am Reborn
- Dedicated `/connect` page for Kingdom Connect, e3 Canada collaboration, and founder/ministry links
- Custom favicon and founder image assets
- Custom Oikos logo and AI/search-friendly `llms.txt`
- Supabase-backed lead capture table for resource requests and lightweight map engagement stats
- No accounts or paid services required for visitors to build, save, and download maps

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The production output is generated in `dist/`. Vercel serves the extensionless
routes via `"cleanUrls": true` in `vercel.json`.

There are **two entry scripts**, which keeps each page's payload small:

| Entry | Pages | Contains |
|---|---|---|
| `src/main.jsx` | `/`, `/growth`, `/connect` | the map builder |
| `src/blog-entry.jsx` | `/blog`, `/blog/*` | the journal shell |

React and lucide are hoisted into a shared `vendor` chunk, so blog pages never
download the map builder.

### Where article content lives

| File | Holds | Loaded by |
|---|---|---|
| `src/content/posts-meta.js` | summaries (title, tags, date…) | listings, related posts, the homepage strip |
| `src/content/bodies/<slug>.js` | one article's full text | that article page only, on demand |
| `src/content/posts.js` | meta + every body, assembled | **build only** (`scripts/build-blog.js`) |

Article bodies are split one-per-file and pulled in with `import.meta.glob`, so
Rollup emits a chunk per article and a reader downloads only the one they opened.
Before this, opening any article downloaded all of them, and every new post made
every article page heavier.

**Do not import `src/content/posts.js` from browser code** — it pulls in every
body at once. Use `posts-meta.js` for listings. `posts.js` throws at build time
if a post has no matching body module, so a new article cannot ship empty.

### Adding an article

1. Add the summary to `src/content/posts-meta.js` (give it the next `order`).
2. Create `src/content/bodies/<slug>.js` with a default-exported
   `{ intro, sections, scripture, network, cta }`.
3. Register it in the `bodies` map in `src/content/posts.js`.
4. `npm run build` — the shell, sitemap, feed and llms files regenerate.

## Deploy on Vercel

Import this repository into Vercel and use the default Vite settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## The Oikos Journey (Resend)

Signing up starts a six-part encouragement sequence written in `api/_journey.js`:

| # | Sends | Subject |
|---|-------|---------|
| 1 | immediately | Your oikos is not an accident |
| 2 | in 2 days | Start with one name *(Pray)* |
| 3 | in 4 days | Love that shows up *(Care)* |
| 4 | in 7 days | Your story is enough *(Share)* |
| 5 | in 10 days | And then they reach theirs *(Disciple)* |
| 6 | in 14 days | You play a real role in this |

The whole sequence is queued **at signup** using Resend's `scheduled_at`, so there
is no cron job and no dashboard automation to keep in sync — the emails are the
code. Sending happens from the `team.thykingdom.net` domain.

Set the API key in Vercel (the sender address already defaults correctly):

```bash
vercel env add RESEND_API_KEY production
```

Preview the emails locally without sending anything:

```bash
node -e "import('./api/_journey.js').then(m=>{const b=m.buildJourney('Daniel');console.log(m.renderEmail(b[0],'#'))})" > preview.html
```

Every email carries `List-Unsubscribe` headers and a footer link to
`/api/unsubscribe?token=…`. Unsubscribing calls the token-gated
`oikos_unsubscribe` Postgres function, which marks every row for that address and
returns the queued Resend ids so the rest of the sequence is cancelled.

## Supabase Lead Capture

The production lead endpoint writes to `public.oikos_map_leads` in the `THY KINGDOM NETWORK - MAIN` Supabase project when these Vercel environment variables are set:

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
```

Use:

```text
SUPABASE_URL=https://vmpkiwfvnlzraabtjkig.supabase.co
```

The table migration is codified at `supabase/migrations/20260717141000_create_oikos_map_leads.sql`.

## GoHighLevel Automation

Optionally create a GoHighLevel workflow with an inbound webhook trigger, then add the webhook URL to Vercel:

```bash
vercel env add GHL_WEBHOOK_URL production
vercel env add GHL_WEBHOOK_URL preview
```

The site posts leads to `/api/lead`, which stores name, email, interest, page, source, referrer, timestamp, and lightweight map stats in Supabase. If `GHL_WEBHOOK_URL` is configured, it also forwards the lead to GoHighLevel.
