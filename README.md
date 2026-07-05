# Abhishek Banaj — Portfolio

Personal portfolio site for **Abhishek Banaj** (Business Analyst @ Practo · Data · Analytics · AI).
Showcases experience, projects, skills, and a working contact form, backed by a small FastAPI service.

## Tech Stack

**Frontend**
- React 19 (Create React App, customized via [CRACO](https://craco.js.org/))
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Framer Motion for animations
- Axios for API calls, React Router for routing

**Backend**
- FastAPI (Python) with MongoDB (via Motor/PyMongo)
- Resend for transactional email (contact form notifications)

## Project Structure

```
.
├── backend/            FastAPI app (server.py), profile/content data, tests
├── frontend/           React app
│   └── src/
│       ├── App.js      All sections (Hero, Experience, Contact, Footer, ...)
│       └── components/ui/   shadcn/Radix UI primitives
├── tests/               Additional test suites
└── test_reports/        Generated test output
```

## Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.10+
- A running MongoDB instance

### Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `backend/.env` file with:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio
CORS_ORIGINS=http://localhost:3000
RESEND_API_KEY=            # optional — enables contact-form email delivery
SENDER_EMAIL=onboarding@resend.dev
OWNER_EMAIL=abhishekbanaj01@gmail.com
RESUME_URL=                # optional — direct PDF link
RESUME_DRIVE_URL=          # optional — Google Drive resume link
ANALYTICS_TOKEN=           # optional — protects analytics endpoints
```

Run the API:

```bash
uvicorn server:app --reload
```

### Frontend setup

```bash
cd frontend
yarn install
```

Create a `frontend/.env` file with:

```
REACT_APP_BACKEND_URL=http://localhost:8000
```

Run the app:

```bash
yarn start    # start dev server
yarn build    # production build
yarn test     # run tests
```

## Deploying to Vercel

The frontend and backend deploy as **two separate Vercel projects** from this same repo (Vercel builds each from a different Root Directory).

### 1. Set up MongoDB Atlas (free tier)

1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free **M0** cluster.
2. Under **Database Access**, create a database user + password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — Vercel serverless functions run on dynamic IPs.
4. Under **Database → Connect**, copy the connection string (`mongodb+srv://<user>:<password>@.../`). This is your `MONGO_URL`.

### 2. Deploy the backend

1. In the [Vercel dashboard](https://vercel.com/new), import this GitHub repo as a **new project**.
2. Set **Root Directory** to `backend`.
3. Framework Preset: **Other** (Vercel auto-detects the Python function at `backend/api/index.py` via `backend/vercel.json`).
4. Add environment variables:

   | Variable | Value |
   |---|---|
   | `MONGO_URL` | your Atlas connection string |
   | `DB_NAME` | `portfolio` |
   | `CORS_ORIGINS` | your frontend's Vercel URL (set after step 3, e.g. `https://your-frontend.vercel.app`) |
   | `RESEND_API_KEY` | optional — enables contact-form email delivery |
   | `SENDER_EMAIL` | optional, defaults to `onboarding@resend.dev` |
   | `OWNER_EMAIL` | optional, defaults to `abhishekbanaj01@gmail.com` |
   | `RESUME_URL` / `RESUME_DRIVE_URL` | optional resume links |
   | `ANALYTICS_TOKEN` | optional — protects the `/api/analytics` endpoint |

5. Deploy. Note the resulting URL (e.g. `https://abhishek-portfolio-api.vercel.app`).

### 3. Deploy the frontend

1. Import the same GitHub repo as a **second** Vercel project.
2. Set **Root Directory** to `frontend`. Framework Preset: **Create React App** (auto-detected).
3. Add environment variable:

   | Variable | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | the backend URL from step 2 (no trailing `/api`) |

4. Deploy.

### 4. Wire CORS

Go back to the **backend** project's `CORS_ORIGINS` env var and set it to the frontend's deployed URL, then redeploy the backend so the contact form and API calls aren't blocked by CORS.

## Contact

Reach out via the links in the site's **Contact** section, or:
- Email: abhishekbanaj01@gmail.com
- LinkedIn: [linkedin.com/in/abhishekbanaj](https://www.linkedin.com/in/abhishekbanaj/)
- GitHub: [@AbhishekCbanaj](https://github.com/AbhishekCbanaj)
