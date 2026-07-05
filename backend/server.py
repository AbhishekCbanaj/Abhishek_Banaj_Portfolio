from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import time
import re
import asyncio
import httpx
import resend
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'abhishekbanaj01@gmail.com')
RESUME_URL = os.environ.get('RESUME_URL', '')
RESUME_DRIVE_URL = os.environ.get('RESUME_DRIVE_URL', '')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Abhishek Banaj Portfolio API")
api_router = APIRouter(prefix="/api")

GITHUB_USERNAME = "AbhishekCbanaj"
GITHUB_API = "https://api.github.com"

# ============= In-memory cache =============
_cache: Dict[str, Any] = {"repos": None, "ts": 0}
CACHE_TTL = 60 * 15  # 15 minutes

# ============= Role classification rules =============
ROLE_RULES = [
    {
        "id": "ai-engineer",
        "label": "AI Engineer",
        "tagline": "LLMs, Agents, NLP, Generative AI",
        "keywords": ["llm", "gpt", "agent", "chatbot", "nlp", "voice", "openai", "genai",
                     "generative", "prompt", "rag", "langchain", "assistant"],
    },
    {
        "id": "data-scientist",
        "label": "Data Scientist / ML",
        "tagline": "Machine Learning, Predictive Modeling, Statistics",
        "keywords": ["machine-learning", "machine learning", "ml", "prediction", "predict",
                     "xgboost", "clustering", "regression", "classification", "risk",
                     "forecast", "clinical", "segmentation", "sklearn"],
    },
    {
        "id": "data-analyst",
        "label": "Data Analyst / BI",
        "tagline": "Power BI, SQL, Dashboards, Reporting",
        "keywords": ["powerbi", "power-bi", "power bi", "sql", "dashboard", "analysis",
                     "sales", "analytics", "kpi", "reporting", "excel", "tableau"],
    },
    {
        "id": "data-engineer",
        "label": "Data Engineer",
        "tagline": "Pipelines, Spark, Kafka, ETL & Big Data",
        "keywords": ["spark", "kafka", "pipeline", "etl", "big-data", "airflow", "streaming",
                     "hadoop", "data-engineering", "warehouse"],
    },
    {
        "id": "full-stack",
        "label": "Full-Stack / App Dev",
        "tagline": "Web apps, TypeScript, React, Next.js",
        "keywords": ["react", "next", "nextjs", "typescript", "web", "app", "android",
                     "supabase", "vercel", "flask", "streamlit"],
    },
]

# Repos to hide (throwaway / very old / irrelevant)
HIDE_REPOS = {"OnlineCalculator", "AnalogClock", "Linear-Search", "Instagram-post",
              "BMI_Calculator", "WeatherApp"}


def classify_repo(repo: Dict[str, Any]) -> List[str]:
    """Return list of role ids that this repo belongs to."""
    text = " ".join([
        (repo.get("name") or "").lower().replace("-", " ").replace("_", " "),
        (repo.get("description") or "").lower(),
        (repo.get("language") or "").lower(),
        " ".join(repo.get("topics") or []).lower(),
    ])
    roles = []
    for rule in ROLE_RULES:
        if any(kw in text for kw in rule["keywords"]):
            roles.append(rule["id"])
    if not roles:
        # fallback: language-based
        lang = (repo.get("language") or "").lower()
        if lang in ("python", "jupyter notebook"):
            roles.append("data-scientist")
        elif lang in ("typescript", "javascript", "html", "css", "java"):
            roles.append("full-stack")
        else:
            roles.append("data-scientist")
    return roles


def shape_repo(repo: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": repo.get("id"),
        "name": repo.get("name"),
        "full_name": repo.get("full_name"),
        "description": repo.get("description") or "",
        "html_url": repo.get("html_url"),
        "homepage": repo.get("homepage") or "",
        "language": repo.get("language") or "Other",
        "stars": repo.get("stargazers_count", 0),
        "forks": repo.get("forks_count", 0),
        "topics": repo.get("topics") or [],
        "updated_at": repo.get("updated_at"),
        "created_at": repo.get("created_at"),
        "size": repo.get("size", 0),
        "roles": classify_repo(repo),
    }


async def fetch_github_repos() -> List[Dict[str, Any]]:
    """Fetch and cache all public repos."""
    now = time.time()
    if _cache["repos"] and (now - _cache["ts"]) < CACHE_TTL:
        return _cache["repos"]
    async with httpx.AsyncClient(timeout=20.0) as httpc:
        try:
            r = await httpc.get(
                f"{GITHUB_API}/users/{GITHUB_USERNAME}/repos",
                params={"per_page": 100, "sort": "updated"},
                headers={"Accept": "application/vnd.github+json"},
            )
            r.raise_for_status()
            raw = r.json()
        except Exception as e:
            logger.error(f"GitHub fetch failed: {e}")
            if _cache["repos"]:
                return _cache["repos"]
            raise HTTPException(status_code=502, detail="Failed to fetch GitHub repos")
    shaped = [shape_repo(r) for r in raw if r.get("name") not in HIDE_REPOS and not r.get("fork")]
    # sort by size desc + updated
    shaped.sort(key=lambda x: (x["stars"], x["size"], x["updated_at"] or ""), reverse=True)
    _cache["repos"] = shaped
    _cache["ts"] = now
    return shaped


# ============= Static profile data =============
PROFILE = {
    "name": "Abhishek Banaj",
    "headline": "Data Scientist · AI Engineer · Analytics Professional",
    "location": "Bengaluru, Karnataka, India",
    "email": "abhishekbanaj01@gmail.com",
    "github": "https://github.com/AbhishekCbanaj",
    "linkedin": "https://www.linkedin.com/in/abhishekbanaj/",
    "portfolio_legacy": "https://abhishekbanaj.netlify.app/",
    "avatar_url": "https://avatars.githubusercontent.com/u/110324276?v=4",
    "summary": (
        "Business Analyst @ Practo · Data Science graduate from REVA University (GPA 8.35). "
        "I ship end-to-end analytics that move the needle — LTV/CAC models that flagged 2 "
        "loss-making tiers, cohort analyses that lifted retention 12%, Redshift query "
        "rewrites that cut RCA reporting from 4 minutes to 45 seconds. Also building "
        "LLM-powered agents and real-time data pipelines on the side."
    ),
    "stats": {
        "years_experience": "1.5+",
        "projects_shipped": "20+",
        "domains": "6",
        "certifications": "6+",
    },
    "resume_url": RESUME_URL,
    "resume_drive_url": RESUME_DRIVE_URL,
}

EXPERIENCE = [
    {
        "role": "Business Analyst Intern",
        "company": "Practo Technologies",
        "location": "Bengaluru",
        "period": "Sep 2025 – Present",
        "current": True,
        "bullets": [
            "Built LTV, CAC & contribution-margin models across 5 tiers; isolated acquisition cost by channel and flagged 2 loss-making tiers — Growth team repriced/retargeted and lifted paid transactions by 6–10%.",
            "Diagnosed a 34% payment drop by segmenting 500K+ sessions by device & network quality — traced to an SDK bug on low-connectivity users; Product shipped a fix in 2 weeks and recovered conversion.",
            "Analyzed 90-day cohort retention for 4M+ users and mapped drop-off by segment × day-range — CRM replaced 2 blanket campaigns with 5 targeted ones, improving 30-day retention ~12%.",
            "Validated SEM spend by comparing click-to-install ratios across 3 campaigns — flagged ₹12L/month in fraudulent spend and paused all 3.",
            "Rewrote 4 Redshift queries (removed full-table scans + redundant joins) — cut execution from 3–4 min to 45s, automated the RCA report, saved 6+ analyst-hours/week.",
        ],
    },
    {
        "role": "Data Analyst Intern",
        "company": "InLighn Tech (InLighnX Global Pvt Ltd)",
        "location": "Bengaluru",
        "period": "Mar 2025 – Jun 2025",
        "current": False,
        "bullets": [
            "Built a SQL pipeline with validation checks to automate a 15+ hr/week manual KPI process — cut delivery time by 60% and reduced recurring data errors.",
            "Developed 5 self-serve dashboards in Power BI & Excel — reduced ad-hoc requests by 70% in the first month.",
            "Audited SQL models after revenue reporting discrepancies, identified drifted filters and aligned teams to unified definitions — removed 6 hrs/week of reconciliation.",
        ],
    },
]

EDUCATION = [
    {
        "degree": "M.Sc. Data Science",
        "school": "REVA University",
        "period": "Sep 2023 – Jul 2025",
        "gpa": "8.35 / 10",
        "notes": "Machine Learning · Big Data Analytics · Business Intelligence · Statistics",
    },
    {
        "degree": "Bachelor of Computer Applications",
        "school": "M.E.S. Vasant Joshi College of Arts & Commerce",
        "period": "Jun 2020 – May 2023",
        "gpa": "8.56 / 10",
        "notes": "Database Management · Statistical Analysis · Python Programming",
    },
]

SKILLS = [
    {"group": "Languages", "items": [
        {"name": "Python (Pandas, NumPy, Scikit-learn)", "level": 92},
        {"name": "SQL (CTEs, Window Functions)", "level": 92},
        {"name": "TypeScript / JavaScript", "level": 62},
        {"name": "R", "level": 65},
    ]},
    {"group": "Analytics & BI", "items": [
        {"name": "Power BI (DAX, Modeling)", "level": 92},
        {"name": "Excel (Pivot, Power Query, Macros)", "level": 90},
        {"name": "Tableau", "level": 72},
        {"name": "Google Analytics (GA4)", "level": 78},
        {"name": "CleverTap", "level": 74},
    ]},
    {"group": "ML & AI", "items": [
        {"name": "Scikit-learn", "level": 88},
        {"name": "XGBoost / LightGBM", "level": 82},
        {"name": "TensorFlow / PyTorch", "level": 72},
        {"name": "LLMs / LangChain / RAG", "level": 82},
        {"name": "OpenAI API & Prompt Engineering", "level": 86},
    ]},
    {"group": "Data Engineering & Cloud", "items": [
        {"name": "Amazon Redshift", "level": 84},
        {"name": "PostgreSQL / MySQL", "level": 90},
        {"name": "Apache Spark & Kafka", "level": 76},
        {"name": "AWS S3", "level": 76},
        {"name": "Microsoft Azure AI", "level": 78},
    ]},
    {"group": "Analysis Techniques", "items": [
        {"name": "A/B Testing", "level": 85},
        {"name": "Cohort & Funnel Analysis", "level": 90},
        {"name": "Root Cause Analysis (RCA)", "level": 88},
        {"name": "User Segmentation & KPI Tracking", "level": 90},
        {"name": "Statistical Analysis", "level": 84},
    ]},
    {"group": "Tools & DevOps", "items": [
        {"name": "Docker", "level": 80},
        {"name": "Git / GitHub", "level": 92},
        {"name": "Streamlit / FastAPI", "level": 84},
        {"name": "Next.js / Supabase", "level": 68},
    ]},
]

# Highlighted projects that deserve top billing (from resume)
FEATURED_PROJECTS = [
    {
        "id": "hiremory",
        "name": "Hiremory — Recruiter Outreach SaaS",
        "description": (
            "Full-stack platform (Next.js + Python + Supabase/Postgres) that personalizes "
            "recruiter emails from your inbox and auto-follows-up. Includes Postgres schema, "
            "funnel dashboard (sent → replied → resume-sent → bounced), and row-level security."
        ),
        "html_url": "https://github.com/AbhishekCbanaj/hiremory",
        "homepage": "https://hiremory.vercel.app",
        "language": "TypeScript",
        "topics": ["nextjs", "python", "supabase", "saas", "outreach"],
        "roles": ["full-stack", "ai-engineer"],
        "featured": True,
    },
    {
        "id": "nl-analytics",
        "name": "Natural Language Analytics Tool",
        "description": (
            "LLM-powered tool (LangChain + OpenAI) that converts plain-English questions into "
            "SQL — 20+ query types, schema validation to reject malformed outputs. Cut ad-hoc "
            "turnaround from 24 hours to 5 minutes for non-technical teams."
        ),
        "html_url": "https://github.com/AbhishekCbanaj/AI-Powered-Data-Analysis-Assistant-Using-Natural-Language-and-LLMs",
        "homepage": "",
        "language": "Python",
        "topics": ["langchain", "openai", "nl2sql", "llm"],
        "roles": ["ai-engineer", "data-analyst"],
        "featured": True,
    },
]

CERTIFICATIONS = [
    {"title": "AI Engineer for Data Scientists Associate", "issuer": "DataCamp",
     "date": "Feb 2025", "url": "https://www.datacamp.com/certificate/AEDS0010356903780"},
    {"title": "Career Essentials in Data Analysis", "issuer": "Microsoft & LinkedIn",
     "date": "Feb 2025", "url": "https://www.linkedin.com/learning/certificates/ef5d2cf7d267ff6d33767c85bdddd82b4614d5e109e6c64a19768134ea73a142"},
    {"title": "Docker Foundations Professional Certificate", "issuer": "Docker, Inc.",
     "date": "Feb 2025", "url": "https://www.linkedin.com/learning/certificates/501542c61522201f1424273289e09b6088f2a9ec321844d1dc17233e05f7277c"},
    {"title": "Microsoft Azure AI Essentials", "issuer": "Microsoft & LinkedIn",
     "date": "Feb 2025", "url": "https://www.linkedin.com/learning/certificates/08a27c72ba0644d71b9df8421a73d29b0edec05b71981635809b9238ceac9c88"},
    {"title": "Prompt Engineering for ChatGPT", "issuer": "Vanderbilt University",
     "date": "Feb 2025", "url": "https://www.coursera.org/account/accomplishments/verify/D9UKWEKE1WOD"},
    {"title": "Introduction to Data Engineering", "issuer": "IBM",
     "date": "Jan 2025", "url": "https://www.coursera.org/account/accomplishments/verify/TWPPTV4AWD2G"},
]


# ============= Routes =============
@api_router.get("/")
async def root():
    return {"status": "ok", "service": "portfolio-api"}


@api_router.get("/profile")
async def get_profile():
    return {
        "profile": PROFILE,
        "experience": EXPERIENCE,
        "education": EDUCATION,
        "skills": SKILLS,
        "certifications": CERTIFICATIONS,
        "roles": [{"id": r["id"], "label": r["label"], "tagline": r["tagline"]} for r in ROLE_RULES],
        "featured_projects": FEATURED_PROJECTS,
    }


@api_router.get("/projects")
async def get_projects(role: Optional[str] = Query(None), q: Optional[str] = Query(None)):
    repos = await fetch_github_repos()
    out = repos
    if role and role != "all":
        out = [r for r in out if role in r["roles"]]
    if q:
        ql = q.lower()
        out = [r for r in out
               if ql in (r["name"] or "").lower()
               or ql in (r["description"] or "").lower()
               or ql in (r["language"] or "").lower()]
    # count per role for tabs
    counts = {"all": len(repos)}
    for rule in ROLE_RULES:
        counts[rule["id"]] = sum(1 for r in repos if rule["id"] in r["roles"])
    return {"projects": out, "counts": counts, "total": len(repos)}


@api_router.post("/contact")
async def submit_contact(payload: Dict[str, Any]):
    # Store contact messages in Mongo (no email service configured)
    from datetime import datetime, timezone
    import uuid
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()
    if not name or not email or not message:
        raise HTTPException(status_code=400, detail="name, email, message are required")
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=400, detail="Invalid email")
    doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "email_sent": False,
    }

    # Send email via Resend (non-blocking, fail-soft)
    email_sent = False
    email_error = None
    if RESEND_API_KEY:
        try:
            html = f"""
            <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #faf9f5; color: #1c1917;">
              <div style="border-left: 4px solid #a3e635; padding: 12px 20px; background: #ffffff; border-radius: 6px;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #78716c; margin-bottom: 8px;">New Portfolio Contact</div>
                <h2 style="margin: 0 0 16px 0; font-size: 22px;">{name}</h2>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color:#78716c; padding: 4px 0;">Email</td><td><a href="mailto:{email}" style="color:#0f766e;">{email}</a></td></tr>
                  <tr><td style="color:#78716c; padding: 4px 0;">Sent</td><td>{doc['created_at']}</td></tr>
                </table>
                <div style="margin-top: 16px; padding: 16px; background: #f5f5f4; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">{message}</div>
              </div>
              <div style="margin-top: 16px; text-align: center; font-size: 11px; color: #a8a29e;">via abhishekbanaj.com portfolio</div>
            </div>
            """
            params = {
                "from": f"Portfolio <{SENDER_EMAIL}>",
                "to": [OWNER_EMAIL],
                "reply_to": email,
                "subject": f"Portfolio contact: {name}",
                "html": html,
            }
            result = await asyncio.to_thread(resend.Emails.send, params)
            email_sent = bool(result)
            doc["email_sent"] = email_sent
            doc["email_id"] = (result or {}).get("id")
        except Exception as e:
            email_error = str(e)
            logger.error(f"Resend email failed: {e}")

    await db.contact_messages.insert_one(doc)
    return {"ok": True, "id": doc["id"], "email_sent": email_sent, "email_error": email_error}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
