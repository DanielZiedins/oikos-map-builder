# Oikos Map Builder

A free landing page and interactive tool for creating a custom Oikos Map: a simple visual way to name, pray for, and intentionally love the people God has placed around you.

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

Create a GoHighLevel workflow with an inbound webhook trigger, then add the webhook URL to Vercel:

```bash
vercel env add GHL_WEBHOOK_URL production
vercel env add GHL_WEBHOOK_URL preview
```

The site posts leads to `/api/lead`, which forwards name, email, interest, page, source, timestamp, and tags to GoHighLevel.
