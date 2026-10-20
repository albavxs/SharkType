# SharkType — Canonical domain migration checklist

## Current state (2026-10-20)
- Vercel's internal project name is `syntax-lang-io` (a legacy internal name, not the public URL).
- Verified production domain reported by Vercel: `https://shark-type-io.vercel.app`.
- `NEXT_PUBLIC_SITE_URL` is configured for production and preview. Its value was not available in the inspection.
- `lib/seo.ts` intentionally continues to use the verified domain as its fallback. **Do not hardcode an unverified new host.**
- `getBaseUrl()` now prefers the preview deployment host for server-generated callbacks when `VERCEL_ENV=preview`.

## After approving the definitive SharkType domain
1. Confirm ownership and DNS/TLS validation for the proposed host in Vercel. Do not assume `sharktype.io` is owned or `sharktype.vercel.app` is available.
2. Set `NEXT_PUBLIC_SITE_URL` for production to the verified canonical origin; review its preview value and rebuild.
3. Update the SEO fallback in `lib/seo.ts` only once the canonical host is verified.
4. Configure redirect (308) from the **old domain that you control**, preserving paths and query strings.
5. Update Supabase Auth redirect allowlist, Site URL, OAuth provider callback settings, password reset/signup emails, and any external integrations.
6. Verify `/home`, `/tracks`, `/plus`, login/verification/password reset, `/sitemap.xml`, `/robots.txt`, canonical and OpenGraph URLs in the actual production deployment.
7. Optionally rename the internal Vercel project after checking Git integration and automation dependencies.

Do not change production domains as part of the responsive typing fix on `dev`.
