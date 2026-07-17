# Oikos Map Builder

A free landing page and interactive tool for creating a custom Oikos Map: a simple visual way to name, pray for, and intentionally love the people God has placed around you.

Live site: [oikosmap.com](https://www.oikosmap.com/)

Powered by [Love on The World](https://www.loveontheworld.com) and [Thy Kingdom Network](https://www.thykingdom.net).

## Features

- Build an Oikos Map directly on the landing page
- Add first-circle people and second-circle branches
- Track relationship type, prayer focus, and notes
- Save locally in the visitor's browser
- Download maps as PNG, SVG, or editable JSON
- Import a saved JSON map
- Download a simple prayer-plan text file
- Share/copy the live tool link
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

The production output is generated in `dist/`.

## Deploy on Vercel

Import this repository into Vercel and use the default Vite settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## GoHighLevel Automation

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
