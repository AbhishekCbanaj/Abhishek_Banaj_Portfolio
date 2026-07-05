# PRD — Abhishek Banaj Portfolio Website

## Problem Statement
Portfolio website for Abhishek Banaj with role-based project sections (Analytics, AI Engineer, etc.) pulling from GitHub (AbhishekCbanaj) and linking LinkedIn/Netlify legacy site. Attractive, professional, user-friendly, job-winning.

## Architecture
- **Backend**: FastAPI, MongoDB, httpx for GitHub API proxy with 15-min in-memory cache. Endpoints: `/api/profile`, `/api/projects?role=&q=`, `/api/contact`.
- **Frontend**: React (single-page), Tailwind + shadcn utilities, sonner toasts, Space Grotesk (display) + IBM Plex Mono + Inter, cream light theme with lime (#a8e055 area) accent + grain overlay.
- **Data flow**: Static profile/skills/edu/certs in server.py PROFILE constants; GitHub repos fetched live and auto-classified into 5 roles via keyword rules on name/desc/language/topics.

## User Personas
- Recruiters & hiring managers (primary) — quick scan of experience + role-tagged projects
- Fellow engineers/collaborators — deep dive into GitHub repos
- Abhishek — owner, wants job through this site

## Implemented (Dec 2025)
- Hero with avatar, stats grid, GitHub/LinkedIn/Email links
- Marquee of tech skills
- About Me with narrative
- Projects section with 5 role tabs (AI Engineer, Data Scientist/ML, Data Analyst/BI, Data Engineer, Full-Stack) + All + search
- Skills matrix (5 groups × 4-5 skills with progress bars)
- Experience + Education + 6 Certifications
- Contact form → stored in Mongo `contact_messages` (no email service)
- Fully responsive, all interactive elements have data-testid
- Tested: 100% pass on backend and frontend (iteration_1.json)

## Backlog
- **P1**: Wire Resend email so contact messages actually reach abhishekbanaj01@gmail.com
- **P1**: Resume PDF upload + download button (add to Hero)
- **P2**: Admin panel to manually tag/promote featured projects
- **P2**: Blog section pulling from Dev.to or Medium RSS
- **P2**: Dark/light theme toggle
- **P2**: Recruiter analytics — track which projects get clicked most
- **P3**: SEO meta tags + Open Graph image per role
