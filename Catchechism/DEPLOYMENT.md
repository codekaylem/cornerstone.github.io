# Cornerstone — Deployment Guide (GitHub Pages)

The app is plain **static files**. The ESV API token is embedded directly in
`app/read.jsx`, so there is **no server, Worker, or backend** — you just push the
files to GitHub Pages and you're live.

```
Browser (GitHub Pages)  →  ESV API   (token in app/read.jsx)
                        →  window.VERSES (app/verses.js, when populated)
```

How the Read tab gets verse text:
1. **`app/verses.js`** (`window.VERSES`) is checked first — instant, offline.
2. Anything not baked in is fetched from the **ESV API** with the embedded token,
   then cached in the browser's `localStorage` (fetched once per device).

> ⚠️ The token is visible to anyone who views source. That's an accepted trade-off
> for a public reader. Don't reuse this token anywhere sensitive; if it's ever
> abused, revoke/rotate it at https://api.esv.org/ and paste a new one into
> `app/read.jsx` (`ESV_API_TOKEN`).

---

## Publish to GitHub Pages

1. Push every file in this project to your repo
   (e.g. **https://github.com/codekaylem/cornerstone.github.io**), keeping the
   folder structure (`index.html` at the root, `app/` alongside it).
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch** → pick `main` / `root` → **Save**.
3. Site goes live at **https://codekaylem.github.io/cornerstone.github.io/**
   (give it a minute on first publish).

`index.html` is the entry point and already loads `app/verses.js` + `app/read.jsx`.

---

## Verify

- Open the live site → **Read** → tap a verse reference.
- Text loads → the embedded token works. ✅
- "Couldn't load this passage" → check the token is valid and that
  api.esv.org is reachable.

---

## Optional — fully offline (no API at all)

To bake every passage in so the live site never calls the API:
1. Open **verse-harvester.html** on the live site, click **Fetch all verses**.
2. Click **Download verses.js**, commit it over `app/verses.js`, push.

After that, `window.VERSES` answers every lookup and the ESV API is never hit.

---

## Notes
- The `worker/` folder and the old Cloudflare Worker are **no longer used** — the
  token is now in the client. You can delete `worker/` if you like.
- **ESV API free tier** is generous for a personal reader; caching keeps usage low.
