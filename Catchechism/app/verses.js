/* Cornerstone — baked-in ESV verse store.
   Keyed by the exact citation string used in app/read-meta.js (semicolon-split),
   e.g. "2 Timothy 3:15-17". Each value is { verses: [{ n, t }], source: "esv" }.

   The Read tab checks this object FIRST (instant, offline). Anything not baked
   in here is fetched on demand from the ESV API (token embedded in app/read.jsx)
   and cached in localStorage. To bake the whole confession in so the app never
   needs the API at all, run verse-harvester.html on the live site, then commit
   its downloaded verses.js over this file. */
window.VERSES = window.VERSES || {};
