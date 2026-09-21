/**
 * Proxy OAuth para Sveltia (authorization code flow).
 * Protocolo compatible con sveltia-cms-auth: popup → /auth → GitHub → /callback → postMessage.
 */

const PROVIDER = 'github';

function domainPatterns(allowedDomains: string | undefined): string[] {
  return (allowedDomains ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `^${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replaceAll('\\*', '.+')}$`);
}

function serialize(value: unknown): string {
  return JSON.stringify(value ?? null).replaceAll('<', '\\u003c');
}

export function outputHTML(args: {
  token?: string;
  error?: string;
  errorCode?: string;
}): Response {
  const { token, error, errorCode } = args;
  const state = error ? 'error' : 'success';
  const content = error
    ? { provider: PROVIDER, error, errorCode }
    : { provider: PROVIDER, token };

  const html = `<!doctype html>
<html><body><script>
(() => {
  const trustedPatterns = ${serialize(domainPatterns(process.env.ALLOWED_DOMAINS))};
  const hasToken = ${serialize(!!token)};
  const isTrusted = (origin) => {
    try {
      const { hostname } = new URL(origin);
      return trustedPatterns.some((pattern) => new RegExp(pattern).test(hostname));
    } catch { return false; }
  };
  window.addEventListener('message', ({ data, origin }) => {
    if (data !== 'authorizing:${PROVIDER}') return;
    if (hasToken && trustedPatterns.length && !isTrusted(origin)) return;
    window.opener?.postMessage(
      'authorization:${PROVIDER}:${state}:' + JSON.stringify(${serialize(content)}),
      origin
    );
  });
  window.opener?.postMessage('authorizing:${PROVIDER}', '*');
})();
</script></body></html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': 'csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure',
    },
  });
}

export async function handleAuth(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('site_id') ?? '';
  const requestedScope = searchParams.get('scope') ?? '';

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return outputHTML({
      error: 'OAuth app client ID or secret is not configured.',
      errorCode: 'MISCONFIGURED_CLIENT',
    });
  }

  const patterns = domainPatterns(process.env.ALLOWED_DOMAINS);
  if (patterns.length && !patterns.some((p) => new RegExp(p).test(domain))) {
    return outputHTML({
      error: 'Your domain is not allowed to use the authenticator.',
      errorCode: 'UNSUPPORTED_DOMAIN',
    });
  }

  const allowed = ['repo', 'public_repo', 'user', 'read:user', 'user:email'];
  const scopes = requestedScope.split(/[\s,]+/).filter(Boolean);
  const scope =
    scopes.length && scopes.every((s) => allowed.includes(s))
      ? scopes.join(',')
      : 'public_repo,user';

  const csrfToken = crypto.randomUUID().replaceAll('-', '');
  const params = new URLSearchParams({
    client_id: clientId,
    scope,
    state: csrfToken,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Set-Cookie':
        `csrf-token=${PROVIDER}_${csrfToken}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
}

export async function handleCallback(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const cookie = request.headers.get('Cookie') ?? '';
  const match = cookie.match(/\bcsrf-token=([a-z-]+?)_([0-9a-f]{32})\b/);
  const csrfToken = match?.[2];

  if (!code || !state) {
    return outputHTML({
      error: 'Failed to receive an authorization code. Please try again later.',
      errorCode: 'AUTH_CODE_REQUEST_FAILED',
    });
  }

  if (!csrfToken || state !== csrfToken) {
    return outputHTML({
      error: 'Potential CSRF attack detected. Authentication flow aborted.',
      errorCode: 'CSRF_DETECTED',
    });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return outputHTML({
      error: 'OAuth app client ID or secret is not configured.',
      errorCode: 'MISCONFIGURED_CLIENT',
    });
  }

  let response: Response;
  try {
    response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
  } catch {
    return outputHTML({
      error: 'Failed to request an access token. Please try again later.',
      errorCode: 'TOKEN_REQUEST_FAILED',
    });
  }

  try {
    const data = (await response.json()) as { access_token?: string; error?: string };
    return outputHTML({ token: data.access_token, error: data.error });
  } catch {
    return outputHTML({
      error: 'Server responded with malformed data. Please try again later.',
      errorCode: 'MALFORMED_RESPONSE',
    });
  }
}
