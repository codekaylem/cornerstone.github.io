// Cornerstone — ESV API proxy (Cloudflare Worker)
// Holds the ESV API token as a SECRET env var (ESV_TOKEN) so it is never
// exposed in the public GitHub Pages site. Deploy this to Cloudflare Workers,
// then add ESV_TOKEN under Settings → Variables and Secrets (encrypted).
//
// Usage from the app:  GET https://<worker-url>/?q=John+3:16

const ALLOWED_ORIGINS = [
  'https://codekaylem.github.io',
  // add a custom domain here later if you use one, e.g. 'https://cornerstone.app'
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    if (!q) {
      return new Response(JSON.stringify({ error: 'missing q parameter' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const esvUrl = 'https://api.esv.org/v3/passage/text/'
      + '?q=' + encodeURIComponent(q)
      + '&include-passage-references=false'
      + '&include-footnotes=false'
      + '&include-headings=false'
      + '&include-short-copyright=false';

    let esvRes;
    try {
      esvRes = await fetch(esvUrl, {
        headers: { Authorization: 'Token ' + env.ESV_TOKEN },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'esv fetch failed' }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const body = await esvRes.text();
    return new Response(body, {
      status: esvRes.status,
      headers: {
        ...cors,
        'Content-Type': 'application/json',
        // cache successful lookups at the edge for a day
        'Cache-Control': esvRes.ok ? 'public, max-age=86400' : 'no-store',
      },
    });
  },
};
