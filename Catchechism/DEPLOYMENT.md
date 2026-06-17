# Cornerstone — Deployment Guide (GitHub Pages + Cloudflare Worker)

Your app is published as **static files on GitHub Pages**. The ESV API token must
**never** be in those files (anyone could read it). Instead, a tiny **Cloudflare
Worker** holds the token as a secret and proxies requests to the ESV API.

```
Browser (GitHub Pages)  →  Cloudflare Worker (token hidden)  →  ESV API
```

---

## Part A — Deploy the Cloudflare Worker (one time, ~5 min)

1. Go to **https://dash.cloudflare.com** → sign up / log in (free).
2. **Workers & Pages** → **Create** → **Create Worker**.
3. Name it `catchechism-esv` (this becomes part of the URL).
   - Your Worker URL will be:
     `https://catchechism-esv.<your-cloudflare-subdomain>.workers.dev`
4. Click **Deploy**, then **Edit code**, and replace everything with the code in
   `worker/esv-proxy.js` (in this project). Click **Deploy** again.
5. **Settings → Variables and Secrets → Add**:
   - Type: **Secret (encrypted)**
   - Name: `ESV_TOKEN`
   - Value: *paste your ESV API token here* (get one free at
     https://api.esv.org/ — keep it out of any committed file)
   - **Save and deploy.**

> The token now lives only on Cloudflare. It is never shipped to the browser.

---

## Part B — Point the app at your Worker

Open `app/read.jsx` and confirm this line matches your real Worker URL:

```js
const ESV_PROXY_BASE = 'https://catchechism-esv.adriancalem.workers.dev';
```

If your Cloudflare subdomain is different, update it here. (Tell me the real URL
and I'll set it for you.)

---

## Part C — Publish to GitHub Pages

1. Push your files to **https://github.com/codekaylem/cornerstone.github.io**
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, pick `main` / `root`, **Save**.
3. Your site goes live at **https://codekaylem.github.io/cornerstone.github.io/**

---

## Verify

- Open the live site, go to **Read**, tap a verse reference.
- If text loads → the Worker + token are wired correctly. ✅
- If you see *"AI-generated ESV text"* → the Worker call failed; double-check the
  Worker URL, the `ESV_TOKEN` secret, and the CORS origin in the Worker code.

---

## Notes
- **Free tiers:** Cloudflare Workers = 100,000 requests/day. Plenty.
- **CORS origin:** the Worker only allows `https://codekaylem.github.io`. If you
  later use a custom domain, add it to the `ALLOWED_ORIGINS` list in the Worker.
- **AI fallback:** if the Worker is ever down, the app falls back to
  Claude-generated ESV text so users still see something.
