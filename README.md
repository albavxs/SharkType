## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Fill `NEXT_PUBLIC_SUPABASE_URL`.
3. Fill `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. If you still use an older deployment contract, SharkType also accepts `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a compatibility fallback, but `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the preferred name.
5. Set `NEXT_PUBLIC_SITE_URL`.
6. Run the SQL migrations in `supabase/migrations/202605130001_auth_progress.sql` and `supabase/migrations/202605130002_profiles_onboarding.sql`.
7. In Supabase Auth, enable the `GitHub` and `Email` providers.
8. Configure the signup email template to send the OTP token code, for example `{{ .Token }}`, because SharkType verifies email with a code entry screen instead of a magic link.
9. In Supabase Auth URL settings, set the site URL to your app domain and allow the callback route `/auth/callback`.

## Environment variables

Local development uses `.env.local`. Production and preview deployments on Vercel must define the same public variables in the project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- optional legacy fallback: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Important: Next.js bakes `NEXT_PUBLIC_*` variables into the client bundle at build time. If you add or edit one of these variables in Vercel, you must redeploy for the new values to reach login, signup, leaderboard, and sync.

## Vercel production checklist

1. Add the Supabase variables to both `Production` and `Preview` in the Vercel dashboard.
2. Set `NEXT_PUBLIC_SITE_URL` to the canonical app URL for the target environment.
3. Redeploy after every `NEXT_PUBLIC_*` change.
4. In Supabase Auth, confirm the site URL matches the deployed app.
5. In Supabase Auth, confirm `/auth/callback` is allowed as a redirect/callback path.
6. If email signup is enabled, keep the OTP email template configured with `{{ .Token }}`.

## Getting started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy SharkType is with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Before promoting a deployment, confirm the Vercel production checklist above. If the app shows a message saying the Supabase public variables are missing from the build, the usual fix is to save the variables in Vercel and trigger a new deployment.
