# India Beauty Excellence Network (IBEN)

A complete editorial recognition website built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide and next/image. Next/font self-hosts Manrope and Cormorant Garamond. The lockfile pins the stable versions installed for this project.

## Run locally

Use Node.js 20.9 or newer (Node 24 was used for validation).

```sh
npm install
cp .env.example .env.local
npm run dev
```

PowerShell: use `Copy-Item .env.example .env.local`. Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

The first build needs internet access to download the Google font files. Fonts and the editorial photograph are then served from this deployment. No browser request to an external image or font host is necessary.

## What is ready

- All 15 public pages, professional and news detail templates, and meaningful 404s for unpublished records.
- Responsive navigation, programme identity, category components and a filterable directory.
- Application steps with validation, review and local portfolio previews; separate nomination and enquiry forms, all connected to a fail-closed submission boundary.
- Page metadata, canonical links, OpenGraph image, Twitter cards, Organization and breadcrumb JSON-LD, robots and sitemap.
- Deliberately empty professional/news data, with no invented recognition records, people, statistics, testimonials or authority claims.

## Current submission behaviour

**Forms do not download JSON or accept live submissions.** Entries stay in React memory and are cleared when the form is unmounted or reloaded. Nothing is stored in localStorage. The final action validates the form and calls `GET /api/submissions`, which returns `{ available: false }`. This check contains no entries or files. The client then displays a form-specific “not sent” message and retains the entries on the current page. Direct POST requests receive HTTP 503 without reading or storing the body. No successful receipt is fabricated.

Portfolio previews are local. Supported formats are JPG, PNG and WebP, up to 8 files at 5 MB each. HEIC/HEIF images must first be exported as JPG. Preview readers are cancelled on unmount; removing files removes their previews. A valid public portfolio URL remains required for applications.

Contact email links appear only when environment variables are configured. All four enquiry types otherwise state that contact details are pending publication. No physical address, telephone, leadership identity, deadline or application fee has been invented.

## Structure and content

- `src/lib/data.ts`: organization, email configuration, navigation, categories, programmes, professionals, news and FAQs.
- `src/lib/pages.ts`: page headings and professional standards.
- `src/app/[page]/page.tsx`: static editorial page assembly and form pages. `/apply` reads an optional category query.
- `src/app/professionals/[slug]/page.tsx`: recognition records.
- `src/app/news/[slug]/page.tsx`: articles.
- `src/components/ui.tsx`: shared server-renderable design components.
- `src/components/navigation.tsx`, `forms.tsx`, `directory.tsx`: interactive components.
- `src/app/globals.css`: colour, type, spacing and responsive system.
- `src/lib/form-fields.ts`: field definitions and shared format validation.
- `src/lib/submissions.ts`: typed transport and repository contracts.
- `src/lib/submission-client.ts`: availability check, multipart transport, strict receipt handling and form-specific messages.
- `src/app/api/submissions/route.ts`: GET availability and closed POST boundary.
- `OWNER_DECISIONS.md`: short list of decisions required before enabling live intake.

The page architecture uses a shared dynamic segment with explicit page configuration and static generation for known editorial routes. Unknown pages call `notFound()`. Static content remains in Server Components; only navigation, forms and filter controls need browser JavaScript.

### Organization details

Update `organization` in `src/lib/data.ts`. Insert leadership entries only after names, roles, biographies and publication permissions have been verified. Add real social URLs to `organization.socials`; empty arrays render no social icons. Operational entity information is intentionally not invented. Confirm it and revise the initial privacy/terms content before opening live intake.

### Add professionals

Add a verified object to `professionals`, following the exported `Professional` type. Required properties: unique `slug`, `name`, `city`, `state`, category name, `specialisations`, exact `recognition`, `year`, unique `profileId`, local `image`, `bio`, `experience` and `portfolio` array. Portfolio entries have `image` and `caption`. Store permitted photos in `public/images/professionals/` and use paths beginning `/images/professionals/`.

Every object in this array is **published**. Keep applications and unverified drafts in a separate private system. The directory, dynamic pages and sitemap read this array. Use real unique IDs assigned by IBEN, never derive a verification claim from a URL alone. Do not add demo people to the production directory. Withdrawn recognition must be removed from active data until a distinct status/history model has been implemented.

### Add recognition programmes

Add an entry to `programs` and its editorial route configuration to `pages`; assemble the new route in the page switch and include it in `routes` for the sitemap. Add navigation where appropriate. Programme scope, dates, requirements and methodology should be verified before publication. The existing Top 50 design treatment is intentionally programme-specific and can be reused as a visual pattern.

### Add news

Add a verified item to `news`: unique `slug`, `title`, one of the `newsCategories`, ISO `date` (`YYYY-MM-DD`), `excerpt` and plain-text `paragraphs`. The list, article route and sitemap update automatically after deployment. Drafts should not be added to the published array. No rich HTML is accepted in article content.

### Photography

`public/images/craft.jpg` is an editorial stock photograph, used to represent hair texture and craft. It does not depict an IBEN member, selected professional or endorsed business. Source: https://images.unsplash.com/photo-1522337360788-8b13dee7a37e . Replace it with commissioned, cleared brand photography when available. The visual style applies restrained desaturation and a dark caption overlay. The logo and Top 50 typographic treatment are original CSS/type compositions, not accreditation seals.

## Environment variables

| Variable                         | Use                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Final canonical origin, e.g. your real https domain, without a trailing slash. Defaults to Vercel's production URL when provided, then localhost. |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | Verified general enquiries email.                                                                                                                 |
| `NEXT_PUBLIC_RECOGNITION_EMAIL`  | Verified recognition enquiries email.                                                                                                             |
| `NEXT_PUBLIC_PARTNERSHIPS_EMAIL` | Verified partnership enquiries email.                                                                                                             |
| `NEXT_PUBLIC_SUPPORT_EMAIL`      | Verified professional support email.                                                                                                              |
| `SUPABASE_URL`                   | Reserved for a future server-side adapter; currently unused.                                                                                      |
| `SUPABASE_SERVICE_ROLE_KEY`      | Reserved server-only secret; currently unused. Never give this a NEXT_PUBLIC prefix.                                                              |

Copy `.env.example` locally. For Vercel, set environment variables in project settings. Public configuration is resolved during build: redeploy after changing it.

## Connecting Supabase later

1. Create private tables for applications, nominations and enquiries, plus a private Storage bucket for portfolios. Keep these separate from published professionals, recognitions and news. Suggested application columns: UUID, created_at, status, values JSONB, consent_version, consent_at, portfolio_object_keys. Store nominator and nominee consent separately.
2. Implement `SubmissionRepository` in a server-only module behind the existing `POST /api/submissions` route. The prepared client transport uses multipart fields `kind`, `values` (JSON) and repeated `portfolio` files. Validate all untrusted values, declarations and files on the server. The current POST handler deliberately returns 503 before reading the body. There is no environment switch that silently enables intake.
3. Enforce row-level security, reviewer access and storage permissions. Applicants must not read other applicants' entries. Keep the service-role key on the server. Add upload size/content verification, private signed uploads, abuse protection, duplicate handling and error reporting that does not log personal data.
4. Account for host request-size limits before enabling uploads: the full allowed portfolio can exceed a single serverless request limit. Connect private signed uploads and adapt the transport to submit validated object keys, or enforce a deployment-compatible total request limit. Do not turn on the prepared multipart path without this work. Return `{ ok: true, reference }` **only after confirmed persistence**. Empty/malformed receipts and non-2xx responses are not success. The UI retains entries on failure and disables duplicate requests while pending.
5. Finalise responsible entity/contact details, retention, rights requests, nominee consent, portfolio permissions and operational policies. Update form availability notices and the FAQ together, then change GET availability only after POST and storage are operational. Document consent versions and timestamps on the server.
6. Expose a separate public view containing only approved recognition records with unique IDs and explicit current/withdrawn status. Never publish the application table or private portfolios directly. CMS migration can similarly replace the local data exports with server-side repository queries.

## Deploy on Vercel

1. Push this repository to your own Git provider and import it into Vercel.
2. Choose the automatically detected Next.js preset, npm package manager and a supported Node version. Standard build command: `npm run build`; do not configure static export.
3. Configure the verified public environment values. Deploy and check the preview URL, forms, images and metadata.
4. Complete the actual organization/contact/leadership content and confirm intake status before treating the website as a live recognition application service.

No deployment or DNS changes have been made by this implementation.

### Connect a GoDaddy domain

In Vercel, open **Project → Settings → Domains** and add the purchased root domain and your preferred `www` variant. Choose the primary host and redirect the other. Vercel provides the exact DNS records for the project. In GoDaddy's DNS management, apply those records (typically an apex A record and a `www` CNAME). Use the values Vercel displays, not hardcoded example IP addresses. Preserve existing mail-related MX/TXT records. Wait for DNS verification and HTTPS provisioning, then set `NEXT_PUBLIC_SITE_URL` to the primary https origin and redeploy. Verify canonical URLs, the sitemap and both domain variants.

Official references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Vercel custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Browser verification

```sh
npx playwright install chromium
npm run build
npm test
```

Tests start the production server when necessary. They check all public routes and internal links, missing records, social metadata, mobile navigation including desktop resizing, layout overflow at 375/390/768/1024/1440 px, invalid phone/email/URL/experience input, image checks/previews/removal, retained form entries, no downloads or personal-data POST while unavailable, closed API responses and mocked future receipt handling. Synthetic test receipts exist only in intercepted browser requests, never in published data. Axe checks WCAG A/AA fundamentals on primary experiences. Screenshots are written to ignored `artifacts/`; failure output goes to ignored `test-results/`.

Empty news is hidden from header/footer navigation and the sitemap, and the empty news route is noindex. Adding real news restores those entry points. Empty professionals show a short 2026 publication notice; the existing filtering UI returns when verified professionals are added.
