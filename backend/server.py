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
import certifi
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url, tlsCAFile=certifi.where())
db = client[os.environ['DB_NAME']]

# Resend email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL', 'Abhisshekbanaj09@gmail.com')
RESUME_URL = os.environ.get('RESUME_URL', '')
RESUME_DRIVE_URL = os.environ.get('RESUME_DRIVE_URL', '')
ANALYTICS_TOKEN = os.environ.get('ANALYTICS_TOKEN', '')
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
    "location": "Bengaluru, Karnataka, India",
    "email": "Abhisshekbanaj09@gmail.com",
    "phone": "+91 91725 33709",
    "github": "https://github.com/AbhishekCbanaj",
    "linkedin": "https://www.linkedin.com/in/abhishekbanaj/",
    "calendly": "https://calendly.com/abhishekbanaj01/30min",
    "portfolio_legacy": "https://abhishekbanaj.netlify.app/",
    "avatar_url": "https://api.dicebear.com/9.x/notionists/svg?seed=AbhishekBanaj&backgroundColor=c0aede,b6e3f4,ffd5dc&radius=20",
    "headline": "Data Analyst & Business Analyst · Data · Analytics · AI",
    "value_prop": "I turn messy data into decisions. At Practo: lifted paid transactions 6–10% via LTV/CAC modeling, stopped ₹12L/month in SEM fraud, and cut a 4-minute RCA query down to 45 seconds.",
    "summary": (
        "MSc Data Science (REVA, 8.35 GPA). Data Analyst and Business Analyst with "
        "hands-on experience shipping revenue-moving analytics on 4M+ users at Practo. "
        "Fluent in SQL, Python, Power BI, Redshift, and LLM-powered tooling. Available "
        "for full-time roles in Data Analysis, Business Analysis, Data Science, and "
        "AI Engineering (junior/intern level)."
    ),
    "impact_metrics": [
        {"value": "6–10%", "label": "Paid transactions lifted at Practo via LTV/CAC repricing"},
        {"value": "₹12L", "label": "Monthly SEM fraud spend paused after RCA analysis"},
        {"value": "12%", "label": "30-day retention improved through cohort targeting"},
        {"value": "4× ↓", "label": "Redshift RCA query cut from 4 min → 45 sec"},
    ],
    "why_hire_me": [
        {
            "title": "Business impact first",
            "body": "Every project I've shipped at Practo and Shameem Arts & Handicrafts moved a real metric: retention, conversion, cost, or cycle time. If a dashboard looks nice but nothing downstream changes, I don't count it as done.",
        },
        {
            "title": "Full analytics stack",
            "body": "SQL (CTEs, window functions, Redshift tuning) · Python (Pandas, Scikit-learn) · Power BI (DAX + modeling) · GA4 · A/B testing · cohort & funnel analysis · RCA.",
        },
        {
            "title": "Comfortable with AI engineering too",
            "body": "Built LLM+SQL agents that dropped ad-hoc turnaround from 24h to 5min. Pair traditional analytics with LangChain, OpenAI, and RAG at a junior/intern level when it's the better tool for the job.",
        },
    ],
    "roles_open_to": ["Data Analyst", "Business Analyst", "Data Scientist", "Product Analyst", "AI Engineer (Junior)"],
    "stats": {
        "years_experience": "2+",
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
        "period": "Sep 2025 – Jun 2026",
        "current": False,
        "bullets": [
            "Built LTV, CAC, and contribution-margin models across 5 tiers, isolated acquisition cost by channel, and flagged 2 loss-making tiers; Growth repriced and retargeted those tiers, lifting paid transactions 6–10%.",
            "Diagnosed a 34% payment drop by segmenting 500K+ sessions by device and network quality, tracing it to an SDK bug affecting low-connectivity users; Product shipped a fix in 2 weeks and recovered the lost conversion.",
            "Analyzed 90-day cohort retention for 4M+ users and mapped drop-off by segment and day-range; CRM used it to replace 2 blanket campaigns with 5 targeted ones, improving 30-day retention about 12%.",
            "Validated SEM spend by comparing click-to-install ratios across 3 campaigns, flagged ₹12L/month in fraudulent spend, and paused all 3.",
            "Rewrote 4 Redshift queries to remove full-table scans and redundant joins, cutting execution from 3–4 minutes to 45 seconds; automated the RCA report and saved 6+ analyst-hours a week.",
        ],
    },
    {
        "role": "MIS Executive (Remote)",
        "company": "Shameem Arts & Handicrafts",
        "location": "Goa, India",
        "period": "Apr 2024 – Jul 2025",
        "current": False,
        "bullets": [
            "Produced 6+ daily sales reports a week covering 500+ SKUs across 2–3 outlets, teaching myself Power BI to replace roughly half a day of manual compilation with the company's first live dashboards.",
            "Wrote SQL queries and used Excel and Google Sheets to pull and clean sales and stock data across 500+ products, giving management a single view of performance by product, category, and outlet.",
            "Ran an A/B test on 2 promotional offers; the premium offer won on sales and informed later promotions.",
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
            "SQL, covering 20+ query types with schema validation to reject malformed outputs. "
            "Cut ad-hoc turnaround from 24 hours to 5 minutes for non-technical teams."
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


# ============= Recruiter Analytics =============
@api_router.post("/track")
async def track_event(payload: Dict[str, Any]):
    from datetime import datetime, timezone
    import uuid as _uuid
    event_type = (payload.get("type") or "").strip()
    if not event_type or len(event_type) > 64:
        raise HTTPException(status_code=400, detail="Invalid event type")
    label = (payload.get("label") or "")[:200]
    meta = payload.get("meta") or {}
    if not isinstance(meta, dict):
        meta = {}
    # Trim meta to avoid abuse
    meta = {k: (str(v)[:200] if v is not None else None) for k, v in list(meta.items())[:10]}
    doc = {
        "id": str(_uuid.uuid4()),
        "type": event_type,
        "label": label,
        "meta": meta,
        "path": (payload.get("path") or "")[:200],
        "referrer": (payload.get("referrer") or "")[:200],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.portfolio_events.insert_one(doc)
    return {"ok": True}


@api_router.get("/analytics")
async def get_analytics(token: str = Query(...), days: int = Query(30, ge=1, le=365)):
    if not ANALYTICS_TOKEN or token != ANALYTICS_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    from datetime import datetime, timezone, timedelta
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    # Totals per event type
    pipeline_types = [
        {"$match": {"created_at": {"$gte": since}}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]

    # Top project clicks (label used for project name/id)
    pipeline_projects = [
        {"$match": {"created_at": {"$gte": since},
                    "type": {"$in": ["project_click", "featured_project_click"]}}},
        {"$group": {"_id": "$label", "count": {"$sum": 1},
                    "type": {"$first": "$type"}}},
        {"$sort": {"count": -1}},
        {"$limit": 25},
    ]

    # Top referrers
    pipeline_refs = [
        {"$match": {"created_at": {"$gte": since}, "referrer": {"$ne": ""}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 15},
    ]

    # Daily timeline
    pipeline_daily = [
        {"$match": {"created_at": {"$gte": since}}},
        {"$group": {"_id": {"$substr": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]

    # Run all reads concurrently instead of one-by-one to stay well under the function timeout
    types, top_projects, referrers, daily, contacts_count, recent = await asyncio.gather(
        db.portfolio_events.aggregate(pipeline_types).to_list(200),
        db.portfolio_events.aggregate(pipeline_projects).to_list(50),
        db.portfolio_events.aggregate(pipeline_refs).to_list(50),
        db.portfolio_events.aggregate(pipeline_daily).to_list(400),
        db.contact_messages.count_documents({"created_at": {"$gte": since}}),
        db.portfolio_events.find({"created_at": {"$gte": since}}, {"_id": 0}).sort("created_at", -1).limit(30).to_list(30),
    )

    return {
        "range_days": days,
        "totals_by_type": [{"type": t["_id"], "count": t["count"]} for t in types],
        "top_projects": [{"label": p["_id"], "count": p["count"], "type": p["type"]} for p in top_projects],
        "top_referrers": [{"referrer": r["_id"], "count": r["count"]} for r in referrers],
        "daily": [{"date": d["_id"], "count": d["count"]} for d in daily],
        "contact_messages": contacts_count,
        "recent_events": recent,
    }


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
