# PRD — Abhishek Banaj Portfolio Website

## Problem Statement
Portfolio website for Abhishek Banaj with role-based project sections (Analytics, AI Engineer, etc.) pulling from GitHub (AbhishekCbanaj) and linking LinkedIn/Netlify legacy site. Attractive, professional, user-friendly, job-winning.

## Architecture
- **Backend**: FastAPI, MongoDB, httpx (GitHub proxy with 15-min cache), resend (email). Endpoints: `/api/profile`, `/api/projects?role=&q=`, `/api/contact`.
- **Frontend**: React (single-page), Tailwind, framer-motion animations, sonner toasts, Space Grotesk + IBM Plex Mono + Inter, cream light theme with lime accent + grain overlay + glass morphism.
- **Data flow**: Static profile/skills/edu/certs/featured in server.py; GitHub repos fetched live and auto-classified into 5 roles.

## Implemented

### Iteration 1 (Dec 2025)
- Hero with avatar, stats grid, GitHub/LinkedIn/Email links
- Marquee of tech skills
- About Me narrative
- Projects section with 5 role tabs + All + search
- Skills matrix
- Experience + Education + 6 Certifications
- Contact form → stored in Mongo (no email)
- 100% test pass on backend + frontend

### Iteration 2 (Dec 2025)
- **Practo Business Analyst** experience card as current role (Sep 2025 – Present) with 5 impact bullets from actual resume
- Updated InLighn as Data Analyst Intern with real achievements
- **Dark / light theme toggle** with animated Sun/Moon icons, localStorage persistence, class-based CSS variables
- **Resume PDF download button** in hero (from uploaded PDF) + Drive folder link with all tailored resumes in contact section
- **Resend email integration** — contact form actually delivers to abhishekbanaj01@gmail.com (verified: email successfully sent during testing)
- **Featured/Highlighted projects** section — Hiremory + Natural Language Analytics Tool with special "Featured" styling above the role tabs
- **Glass morphism** on cards + **framer-motion scroll animations** + **animated orbs** in hero + **staggered fade-ins**
- Expanded skills to 6 groups including new Analysis Techniques + Analytics tools from resume
- Nav has scroll-based glass effect + underline hover animations

## Backlog

### P1
- Admin panel to manually feature/pin projects + edit profile fields without redeploy
- Blog section pulling Dev.to or Medium RSS feed

### P2
- Recruiter analytics: track most-clicked projects/tabs, session heatmap
- Verify a custom domain in Resend (currently uses `onboarding@resend.dev`) so `Reply-To` shows Abhishek's domain
- OG image auto-generator per role (Twitter/LinkedIn shareable)
- Add case-study deep-dive pages for top 3 projects (Practo work, Hiremory, NL Analytics)
- Booking widget (Calendly) in hero for recruiter intro calls

### P3
- SEO meta tags + sitemap.xml
- View counter per project
- Downloadable "role-tailored" resume per tab (Data Analyst / AI Engineer / etc.)

## Files
- `/app/backend/server.py` — API + Resend + Mongo
- `/app/backend/.env` — RESEND_API_KEY, RESUME_URL, etc.
- `/app/frontend/src/App.js` — single-file React (~700 lines, all sections)
- `/app/frontend/src/index.css` — theme vars + glass + animations
