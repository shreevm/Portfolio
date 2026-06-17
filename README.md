<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2978cf23-bcd5-467f-90bf-080c079e07ab

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build and Deploy

**Recommended Node version:** 18+ (Node 20 recommended).

1. Install dependencies:
   `npm install`
2. Build the app:
   `npm run build`

- If you want to run a production server locally:
  `npm run start`

- If you use the existing `deploy` script it runs `next build && next export`.
  - Note: `next export` creates a static export and is NOT compatible with many Next.js "app"-directory features (server components, middleware, `next/image`, API routes).
  - If your project uses the `app/` directory or server-side features, `next export` will fail. Instead deploy to a platform that supports Next.js server runtime (Vercel, Render, Fly, etc.), or remove server features to make a static export possible.

## Deploying to Vercel (recommended)

1. Push your repo to GitHub.
2. Import the repo in Vercel. Vercel will run `npm run build` and serve the app using the server runtime — no `next export` required.
3. Add environment variables (e.g., `GEMINI_API_KEY`) in the Vercel dashboard.

Note: I added a GitHub Actions workflow at `.github/workflows/deploy-vercel.yml` that can deploy to Vercel when you add the following repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

## Automatic deploy via GitHub Actions -> GitHub Pages

If you'd like automatic deploys from the `main` branch to GitHub Pages, I added a GitHub Actions workflow at [.github/workflows/deploy-gh-pages.yml](.github/workflows/deploy-gh-pages.yml#L1). It will:

- Run on push to `main`.
- Install dependencies, run `npm run build` and `npm run export`.
- Publish the generated `out/` directory to the `gh-pages` branch using the built-in `GITHUB_TOKEN`.

Notes:
- This uses `next export` to produce a static site in `out/`. If your app uses server-only features, the export may fail — in that case use Vercel or another server-capable host instead.
- After you push these files to GitHub, Actions will run automatically and publish to `gh-pages`.


## Common deployment issues & how to fix them

- Build fails during `next export`: you are likely using the `app/` directory or server-only features. Remove `next export` from your deploy pipeline or switch to a server-capable host.
- Missing env vars in the deployment environment causes runtime errors — set `GEMINI_API_KEY` in your host's env settings.
- Node version mismatch: ensure the host uses Node 18+ (Node 20 recommended) to match dev dependencies.

## Quick troubleshooting steps

1. Run locally: `npm install && npm run build` and read the build output for explicit errors.
2. If `next export` errors, try removing it and run `npm run build` then `npm run start` on a server or use Vercel.
3. Share the `npm run build` error output if you want me to diagnose the exact failure.

---
Updated to include build/deploy guidance and common causes for failed deployments.
