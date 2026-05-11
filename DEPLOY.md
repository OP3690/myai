# Deploy FixAIPrompt to fixaiprompt.com

Step-by-step to get the site live. Vercel is the recommended host because every page is statically pre-rendered and the OG image routes use Vercel's edge runtime out of the box.

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier is fine).
- DNS access for `fixaiprompt.com`.
- The Vercel CLI: `npm i -g vercel`.

## 1. First-time deploy

From the project root:

```bash
# Log in once
vercel login

# Link the local project to a new Vercel project + deploy a preview
vercel

# Promote to production
vercel --prod
```

Vercel will detect Next.js 14 automatically. No `vercel.json` is required, but you can add one for advanced settings (rewrites, headers, etc.).

After the first deploy you'll get a URL like `fixaiprompt-xyz.vercel.app`. Click it and verify everything works.

## 2. Connect the custom domain

In the Vercel dashboard:

1. Open the project → **Settings → Domains**.
2. Add `fixaiprompt.com` and `www.fixaiprompt.com`.
3. Vercel will show two records to add at your DNS provider:

For the apex (`fixaiprompt.com`):
```
Type: A      Host: @     Value: 76.76.21.21      (Vercel anycast IP)
```

For `www.fixaiprompt.com`:
```
Type: CNAME  Host: www   Value: cname.vercel-dns.com
```

4. Save the DNS records. Propagation usually takes 5–60 minutes.
5. Vercel will auto-issue a Let's Encrypt SSL certificate once DNS resolves.

## 3. Confirm everything

After DNS propagates:

```bash
# Real production URL
open https://fixaiprompt.com

# OG images (every route has one)
curl -I https://fixaiprompt.com/opengraph-image
curl -I https://fixaiprompt.com/safe-paste/opengraph-image
curl -I https://fixaiprompt.com/templates/chain-of-thought-reasoning/opengraph-image

# Sitemap + robots
open https://fixaiprompt.com/sitemap.xml
open https://fixaiprompt.com/robots.txt
```

## 4. (Optional) Vercel Analytics

In **Settings → Analytics**, enable Web Analytics. Free tier shows page-level visits with zero PII tracking. **Do not** enable Speed Insights or full Analytics if you want to stay 100% privacy-pure (the app explicitly promises "no logs, no tracking"). The default `vercel.json`-less deploy already runs **no** tracking.

## 5. Submit the sitemap to search engines

- **Google Search Console**: [https://search.google.com/search-console](https://search.google.com/search-console)
  - Add property → `https://fixaiprompt.com`
  - Verify via DNS TXT record (Vercel makes this easy via Domains UI)
  - Submit sitemap: `https://fixaiprompt.com/sitemap.xml`
- **Bing Webmaster Tools**: import from Google Search Console (one click).

## 6. Recommended follow-ups (post-launch)

- Set up a Vercel **preview deployment for every PR** — already on by default.
- Open Graph image validator: paste any URL into [opengraph.xyz](https://www.opengraph.xyz/) or [LinkedIn's Post Inspector](https://www.linkedin.com/post-inspector/) to verify cards render.
- Twitter/X card validator: [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) — works only on tweet-able URLs.
- Lighthouse audit: target >90 on Performance, Accessibility, Best Practices, SEO. Already very close on this codebase.

## 7. Continuous deploys

Push to `main` → Vercel auto-deploys to production.
Push to any other branch → Vercel auto-deploys a preview URL.

```bash
git push origin main
```

That's it. No build server, no CI to maintain.

## Troubleshooting

**OG images return 404 in preview but work in production**
Edge runtime functions need a deploy to fully provision. Wait 30s after a deploy, then re-check.

**Custom domain shows "Invalid configuration"**
DNS hasn't propagated yet. Run `dig fixaiprompt.com` to verify. Or wait 5–60 minutes.

**Build fails on `next build`**
Run `npm run build` locally first. If it works locally, the issue is usually a Vercel Node version mismatch — set `"engines": { "node": ">=18.18.0" }` in `package.json` (already set).
