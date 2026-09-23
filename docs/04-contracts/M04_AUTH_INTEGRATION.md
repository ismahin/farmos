# M04 Browser Authentication Integration

> **Status: Authoritative M03B contract for M04.** This document specifies transport and client behavior; M04 owns the frontend implementation.

## Deployment model

Development uses Next.js at `http://localhost:3000` and NestJS at `http://localhost:3001`. The API sets a non-Secure development cookie because local HTTP cannot carry a Secure cookie. Production requires HTTPS and is expected to expose web and API through the same site, preferably a reverse proxy. `WEB_ORIGINS` is an exact comma-separated allowlist; production startup fails without it or when it contains a non-HTTPS origin. Credentialed CORS never uses `*`.

## Login

```http
POST /api/v1/auth/login
Origin: http://localhost:3000
X-Session-Transport: cookie
Content-Type: application/json

{"email":"owner@example.com","password":"..."}
```

The browser request must use `credentials: "include"`. Success returns `{ "authenticated": true, "expiresAt": "..." }` and `Set-Cookie`; it never returns the opaque credential. The cookie is `HttpOnly`, `SameSite=Lax`, `Path=/api`, has explicit lifetime/expiry, and is `Secure` in production. Do not copy authentication data to localStorage, sessionStorage, IndexedDB, client cookies, URLs, logs, or analytics.

Bootstrap registration uses the same `X-Session-Transport: cookie` behavior but additionally requires the deployment-controlled `X-Bootstrap-Token`. M04 must not embed that secret in a public bundle; production onboarding must proxy or operationally control bootstrap.

Default login without `X-Session-Transport: cookie` remains the documented non-browser bearer transport. M04 must not use it.

## Authenticated requests and `/me`

All browser API calls use `credentials: "include"`. Call `GET /api/v1/me` after login and on safe application initialization. It returns:

- safe user ID, display name, and email;
- authoritative tenant ID and display name;
- effective permission codes computed by the backend;
- `farmScope.allFarms`, up to 100 accessible farm summaries, and a `truncated` flag.

If farm scope is truncated, fetch the cursor-paginated `/api/v1/farms`. Never derive permissions from role names. Never send a tenant-selection header/body/query. A client-selected farm ID is only a UX preference; every farm request is rechecked against authenticated tenant, permission, and assignment.

## CSRF and origin policy

SameSite=Lax reduces ambient cross-site cookie delivery but is not the only defense. Every cookie-transport login/register and every unsafe cookie-authenticated method (`POST`, `PUT`, `PATCH`, `DELETE`) requires an `Origin` exactly matching `WEB_ORIGINS`. Missing or unapproved origins return 403 Problem Details. Modern browser fetch supplies `Origin`; M04 must not attempt to synthesize or override this forbidden browser header.

Safe `GET`/`HEAD` requests do not require an Origin. Non-browser bearer clients without an Origin remain supported. CORS responds with `Access-Control-Allow-Credentials: true` only for configured origins and allowlists the FarmOS request headers.

## Logout and expiry

```http
POST /api/v1/auth/logout
Origin: http://localhost:3000
```

Send with `credentials: "include"`. The API revokes the persisted session and expires the cookie. After logout, clear all non-authoritative user/tenant/farm/query state and navigate to login. The old cookie/session must not be retried.

On any 401, clear local presentation context and cached tenant data, then enter the login flow. A safe relative return location may be retained; never preserve credentials or unsafe mutation payloads. No refresh-token mechanism exists. A 403 means the user is authenticated but lacks permission or resource scope: retain the session and show a permission-denied state. Display the Problem Details correlation ID for support.

Disabled users, suspended memberships/tenants, expired sessions, revoked sessions, and invalid cookies all produce the same safe unauthenticated behavior. Invalid login does not disclose whether the account exists.

## Minimal fetch example

```ts
await fetch(`${apiOrigin}/api/v1/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json", "X-Session-Transport": "cookie" },
  body: JSON.stringify({ email, password }),
});

await fetch(`${apiOrigin}/api/v1/me`, { credentials: "include" });
```

Use environment-provided API origins. Production must use HTTPS and must not relax cookie, Origin, or CORS policy to work around deployment topology.
