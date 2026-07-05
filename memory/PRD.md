# PRD — Abhishek Banaj Portfolio Website

## Problem Statement
Job-winning portfolio for Abhishek Banaj with role-based project sections, pulled live from GitHub. Attractive, professional, distinctive.

## Architecture
- **Backend**: FastAPI + MongoDB + httpx (GitHub API proxy with 15-min in-memory cache) + Resend (transactional email). Endpoints: `/api/profile`, `/api/projects?role=&q=`, `/api/contact`.
- **Frontend**: React SPA. Kanit + IBM Plex Mono fonts. Dark-default with light mode toggle. Framer Motion for scroll animations, sticky-stack projects, character-by-character text reveals, magnetic portrait hover.
- **Env**: `RESEND_API_KEY`, `SENDER_EMAIL=onboarding@resend.dev`, `OWNER_EMAIL=abhishekbanaj01@gmail.com`, `RESUME_URL`, `RESUME_DRIVE_URL`.

## Iterations
### v1 (Dec 2025) — MVP
- Hero with stats, About, Skills matrix, Experience/Education/Certifications, Contact form → Mongo, 5 role-tabbed project grid, all 50 GitHub repos auto-classified.

### v2 (Dec 2025) — Redesign + integrations
- Practo Business Analyst Intern experience added with 5 achievement bullets (LTV/CAC, cohort retention, Redshift optimization).
- Kanit-font design with massive gradient hero heading (silver in dark → magenta in light).
- Motionsites marquee (21 gifs, 2 rows, scroll-reactive translateX).
- About section with 4 floating decorative icons.
- White-bg Services section (5 services with numbered layout).
- Sticky-stacking Featured Projects (3 cards with scale-on-scroll): Hiremory, NL Analytics Tool, Practo Growth Analytics.
- Glass-morphism cards (Skills, Journey, Contact).
- Dark/light theme toggle (Sun/Moon icon in nav).
- Resend email integration — contact form delivers HTML email to abhishekbanaj01@gmail.com.
- Resume download (PDF from uploaded artifact + Google Drive folder for all tailored variants).
- Kept `/api/projects` role-tabbed grid at bottom as "More on GitHub".

## Backlog
- **P2**: Admin panel to feature/pin best projects per role.
- **P2**: Blog section (Dev.to / Medium RSS pull).
- **P2**: Recruiter analytics — track which projects & sections get clicked most.
- **P2**: Domain verification on Resend so from-address is `hello@abhishekbanaj.com` instead of onboarding@resend.dev.
- **P3**: SEO meta tags + Open Graph per role.
- **P3**: Calendly "Book intro call" CTA in hero.

## Known caveats
- Featured project mockup images are Unsplash placeholders (data/dashboard themed). Real project screenshots would strengthen credibility further.
- Resend uses shared `onboarding@resend.dev` sender — verify a custom domain in Resend to avoid spam filters.
