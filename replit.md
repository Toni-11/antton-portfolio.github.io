# Replit setup

This project is a React 19 + Vite + TypeScript portfolio site styled with Tailwind CSS.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The Replit workflow runs `npm run dev` on port 5000. Vite is configured to listen on
`0.0.0.0` and allow the proxied Replit host.

## Build

```bash
npm run build
```

The imported archive did not include the referenced profile photo, so the hero currently
uses an initials fallback instead of requesting a missing asset.