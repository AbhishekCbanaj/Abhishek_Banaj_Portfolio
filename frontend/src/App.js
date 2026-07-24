import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, useInView, useMotionValue, animate, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Github, Linkedin, Mail, MapPin, Download, Send, Sun, Moon,
  ArrowUpRight, CheckCircle2, TrendingUp, Award, GraduationCap, Sparkles,
  Zap, Globe, HelpCircle, X, Lock, RefreshCw, LogOut, Phone, Calendar
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const track = (type, label = "", meta = {}) => {
  try {
    axios.post(`${API}/track`, {
      type, label, meta,
      path: window.location.pathname,
      referrer: document.referrer || "",
    }).catch(() => {});
  } catch (_) {}
};

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return [theme, () => setTheme(t => t === "dark" ? "light" : "dark")];
};

// Fade in on scroll
const Reveal = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.75, delay, ease: [0.2, 0.9, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Number that animates counting up
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!inView) return;
    // If value contains only digits + %, animate. Otherwise display as-is.
    const match = String(value).match(/^([0-9.,–\-]+)([^0-9]*)$/);
    if (!match) { setDisplay(value); return; }
    // A dash after the first character means a range (e.g. "6–10%"), not a sign — don't mangle it.
    if (/[–-]/.test(match[1].slice(1))) { setDisplay(value); return; }
    const rawNum = match[1].replace(/[^\d.]/g, "");
    const num = parseFloat(rawNum);
    if (isNaN(num)) { setDisplay(value); return; }
    const mv = { v: 0 };
    const controls = animate(0, num, {
      duration: 1.3,
      ease: [0.2, 0.9, 0.3, 1],
      onUpdate: (latest) => {
        const isFloat = rawNum.includes(".");
        const shown = isFloat ? latest.toFixed(1) : Math.round(latest).toString();
        setDisplay(String(value).replace(match[1], (String(value).startsWith("–") || String(value).startsWith("-")) ? "-" + shown : (match[1].startsWith("–") ? "–" + shown : shown)));
      },
    });
    return controls.stop;
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
};

const CASE_STUDIES = [
  {
    id: "practo",
    title: "Practo · Growth Analytics",
    role: "Business Analyst Intern · Sep 2025 – Jun 2026",
    problem: "4M+ user healthtech platform with unclear channel economics and a 34% payment drop.",
    action: "Built LTV/CAC/margin models across 5 tiers, ran 90-day cohort retention, segmented 500K sessions by device × network quality, rewrote Redshift RCA queries.",
    result: [
      "6–10% lift in paid transactions",
      "12% improvement in 30-day retention",
      "₹12L/month SEM fraud paused",
      "4-min RCA query → 45 seconds",
    ],
    stack: ["SQL", "Redshift", "GA4", "Python", "Cohort", "A/B Testing"],
    href: "https://www.linkedin.com/in/abhishekbanaj/",
    details: {
      context: "Practo is a 4M+ user healthtech platform. Channel-level unit economics were unclear (some acquisition channels were quietly loss-making), and a 34% drop in payment completions had gone unexplained.",
      approach: [
        "Built LTV, CAC, and contribution-margin models across 5 pricing tiers to isolate acquisition cost by channel, and flagged 2 tiers that were structurally loss-making.",
        "Segmented 500K+ payment sessions by device and network quality to trace the 34% payment drop to an SDK bug affecting low-connectivity users.",
        "Ran 90-day cohort retention analysis across 4M+ users, mapping drop-off by segment × day-range.",
        "Validated SEM spend by comparing click-to-install ratios across 3 campaigns to catch fraudulent spend.",
        "Rewrote 4 Redshift queries, removing full-table scans and redundant joins, and automated the resulting RCA report.",
      ],
      impact: [
        "Growth repriced/retargeted the 2 flagged tiers, lifting paid transactions 6–10%",
        "Product shipped the SDK fix in 2 weeks, recovering lost conversion",
        "CRM replaced 2 blanket campaigns with 5 targeted ones, improving 30-day retention ~12%",
        "₹12L/month in fraudulent SEM spend caught and paused",
        "RCA query time cut from 3–4 min to 45 sec, saving 6+ analyst-hours/week",
      ],
    },
  },
  {
    id: "credit-card-dashboard",
    title: "Credit Card Transaction Analytics Dashboard",
    role: "Personal Project · Data Analyst",
    problem: "Raw transaction-level data with no visibility into activation, delinquency, or revenue mix by card type and geography.",
    action: "Modeled raw SQL transaction data into a Power BI dashboard covering activation, delinquency, and revenue segmentation.",
    result: [
      "$45.5M YTD transaction volume tracked",
      "57.5% card activation rate surfaced",
      "6.06% delinquency rate isolated",
      "$56.5M YTD revenue segmented by card type, geography, and spend category",
    ],
    stack: ["SQL", "Power BI", "DAX", "Data Modeling"],
    details: {
      context: "Card-issuing businesses need to see past a single blended number to know which cards are actually getting used, which accounts are at risk, and where revenue is really coming from.",
      approach: [
        "Modeled raw SQL transaction data into a star schema suited for Power BI reporting.",
        "Built dashboard views for activation rate, delinquency rate, and revenue mix.",
        "Segmented $56.5M in YTD revenue by card type, geography, and spend category to surface where revenue concentration and risk actually sat.",
      ],
      impact: [
        "$45.5M in YTD transaction volume made visible in one dashboard",
        "57.5% activation rate and 6.06% delinquency rate surfaced as trackable metrics",
        "Revenue segmentation gave a clear view of which card types/geographies drove the $56.5M in YTD revenue",
      ],
    },
  },
  {
    id: "bank-loan-portfolio",
    title: "Bank Loan Portfolio Report",
    role: "Personal Project · Data Analyst",
    problem: "38.6K loan applications with no consolidated view of funded amount, bad-loan concentration, or rate/DTI trends.",
    action: "Built a Power BI + SQL loan portfolio dashboard covering applications, funded amount, and risk segmentation.",
    result: [
      "38.6K applications tracked",
      "$435.8M in funded amount consolidated",
      "14.1% bad-loan segment isolated",
      "Interest rate & DTI trends modeled",
    ],
    stack: ["Power BI", "Excel", "SQL"],
    details: {
      context: "A lending portfolio spanning 38.6K applications and $435.8M in funded amount had no single report tying application volume, funding, and loan quality together.",
      approach: [
        "Consolidated loan application and funding data into a single SQL-backed model.",
        "Built Power BI views for application volume, total funded amount, and loan status breakdown.",
        "Isolated the bad-loan segment (14.1% of the book) and modeled how interest rate and debt-to-income trends related to it.",
      ],
      impact: [
        "$435.8M in funded amount made visible across 38.6K applications in one report",
        "14.1% bad-loan segment isolated for risk review",
        "Interest rate and DTI trend modeling gave a starting point for tightening underwriting criteria",
      ],
    },
  },
  {
    id: "pr-reviewer",
    title: "Practo · AI PR Reviewer",
    role: "Personal Project · Built & Deployed at Practo",
    problem: "Every PR needed a human to manually catch the same recurring issues (unhandled errors, unsafe SQL, oversized functions) before it could be approved.",
    action: "Built an event-driven system with four parallel LangGraph agents (static analysis, security, architecture, style) that review every PR the moment it's opened, then rolled it out on Practo's existing workflow infra so no team had to run a server.",
    result: [
      "Automated first-pass review on every PR before a human opens it",
      "Checklist-driven auto-approval for PRs that satisfy a team's own criteria",
      "Learns each repo's conventions from merged-PR history over time",
      "Rolled out org-wide with zero new infrastructure for any team",
    ],
    stack: ["Python", "LangGraph", "FastAPI", "Celery", "Redis", "PostgreSQL", "Prefect"],
    href: "https://github.com/AbhishekCbanaj/ai-pr-reviewer",
    details: {
      context: "Every pull request needed a human reviewer to manually catch the same recurring categories of issues: unhandled errors, SQL built from string concatenation, functions that had grown too large. That first pass ate reviewer time on every single PR, regardless of the team or repo.",
      approach: [
        "Built an event-driven pipeline: GitHub fires a webhook on PR open/update, a gateway verifies the signature, and the payload is queued as a job.",
        "Fanned the diff out to four parallel LangGraph agents (static analysis, security via OWASP Top 10, architecture, and code style) so all checks run concurrently instead of one long sequential pass.",
        "Deduplicated and capped findings per file before posting, so the bot's PR comments stay signal, not noise.",
        "Added a checklist-based auto-approval path: once a PR satisfies a team-defined checklist, it's approved automatically, leaving the human reviewer to spot-check the actual logic rather than the boilerplate.",
        "Added a learning step that mines merged PRs for each repo's own conventions, so review feedback adapts to how each team actually writes code.",
        "Prototyped and tested the whole stack locally first (Docker Compose, fake LLM/GitHub clients, Prometheus + Grafana), then deployed it on Practo's existing Bacron/Prefect workflow infrastructure instead of a dedicated server, so no team had to provision or maintain anything to use it.",
      ],
      impact: [
        "Every PR gets an automated first-pass review before a human ever opens it",
        "Checklist-driven auto-approval removes repetitive review overhead from clean PRs",
        "Rolled out without asking any team to run new infrastructure",
        "Review feedback improves over time as the learner mines each repo's merged-PR history",
      ],
    },
  },
  {
    id: "shameem",
    title: "Shameem Arts & Handicrafts · Sales Reporting",
    role: "MIS Executive (Remote) · Apr 2023 – Jul 2025",
    problem: "Sales and stock data for 500+ SKUs across 2–3 outlets compiled manually, taking half a day per report with no live view of performance.",
    action: "Taught myself Power BI to build the company's first live dashboards, wrote SQL/Excel/Sheets pipelines to clean and pull sales and stock data, and ran an A/B test on promotional offers.",
    result: [
      "6+ daily sales reports a week automated",
      "500+ SKUs across 2–3 outlets covered",
      "~Half a day of manual compilation replaced with live dashboards",
      "A/B test identified the winning promotional offer",
    ],
    stack: ["SQL", "Power BI", "Excel", "Google Sheets", "A/B Testing"],
    details: {
      context: "A small retail business selling 500+ SKUs across 2–3 outlets had no live view of its own sales and stock performance — every report was compiled by hand, eating roughly half a day of work each time.",
      approach: [
        "Taught myself Power BI from scratch to build the company's first live dashboards.",
        "Wrote SQL queries and used Excel and Google Sheets to pull and clean sales and stock data across 500+ products.",
        "Produced 6+ daily sales reports a week covering performance by product, category, and outlet.",
        "Designed and ran an A/B test comparing two promotional offers to see which actually drove sales.",
      ],
      impact: [
        "Replaced roughly half a day of manual report compilation with live, self-serve dashboards",
        "Gave management a single view of performance across 500+ products and 2–3 outlets",
        "The premium offer won the A/B test on sales and informed how later promotions were structured",
      ],
    },
  },
  {
    id: "nl-analytics",
    title: "Natural Language Analytics",
    role: "Personal · Open source",
    problem: "Non-technical teams waiting 24h for basic SQL answers.",
    action: "Built an LLM tool (LangChain + OpenAI) that converts plain-English questions to validated SQL, covering 20+ query types with schema guardrails.",
    result: [
      "24 hours → 5 minutes turnaround",
      "20+ query types supported",
      "Schema validation prevents bad joins",
    ],
    stack: ["Python", "LangChain", "OpenAI", "SQL", "Streamlit"],
    href: "https://github.com/AbhishekCbanaj/AI-Powered-Data-Analysis-Assistant-Using-Natural-Language-and-LLMs",
  },
];

const STATIC_PROFILE = {
  name: "Abhishek Banaj",
  github: "https://github.com/AbhishekCbanaj",
  linkedin: "https://www.linkedin.com/in/abhishekbanaj/",
  email: "Abhisshekbanaj09@gmail.com",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const formatBlogDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
};

const BLOG_POSTS = [
  {
    slug: "loss-making-tiers-ltv-cac",
    title: "The two pricing tiers nobody was watching",
    dek: "A channel-level LTV/CAC breakdown at Practo surfaced two structurally loss-making tiers hiding inside a healthy-looking blended number.",
    date: "2025-11-12",
    readTime: "5 min read",
    tags: ["Analytics", "LTV/CAC", "Practo"],
    content: [
      "When I joined Practo's Growth team, the topline numbers looked fine. Paid transactions were growing, blended CAC looked reasonable, and nobody was asking hard questions about unit economics. That's usually a sign you're not looking closely enough.",
      "Practo prices differently across roughly five tiers, and each tier pulls users through different acquisition channels at different costs. Blended CAC across all of that can look healthy while individual pieces are quietly losing money. I wanted to know which pieces.",
      "So I built LTV, CAC, and contribution-margin models broken out by tier, and matched acquisition cost to the channel that actually drove it, not just whichever channel got the last click. That distinction mattered: a user acquired cheaply through one channel but converting at a much lower rate than users from a pricier channel can still be the worse investment once you run the lifetime-value math.",
      "Two tiers came out structurally loss-making. Not marginally negative, not \"give it time to mature\" negative. The math didn't work no matter how I adjusted the assumptions.",
      "I handed the breakdown to Growth along with the channel-level detail behind it. They repriced and retargeted the two flagged tiers, and paid transactions went up 6–10% afterward.",
      "The part I keep coming back to is how ordinary the fix was once the diagnosis was right. Nobody needed a clever growth hack. They needed someone to actually break the blended number apart and show where it was hiding.",
    ],
  },
];

// ================ NAV ================
const Nav = ({ theme, toggle, resumeUrl }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const sectionHref = (hash) => (isHome ? hash : `/${hash}`);
  return (
  <motion.nav
    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
    data-testid="site-nav"
    className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(var(--background))]/85 border-b border-border">
    <div className="container-x h-16 flex items-center justify-between">
      <a href={sectionHref("#top")} data-testid="nav-logo" className="font-serif text-xl font-bold tracking-tight link-underline">
        Abhishek Banaj<span className="text-[hsl(var(--accent))]">.</span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        {[{href:"#work",label:"Work"},{href:"#experience",label:"Experience"},{href:"#skills",label:"Skills"},{href:"#contact",label:"Contact"}].map(l => (
          <a key={l.href} href={sectionHref(l.href)} data-testid={`nav-${l.label.toLowerCase()}`}
             className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] link-underline">{l.label}</a>
        ))}
        <Link to="/blog" data-testid="nav-blog"
           className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] link-underline">Blog</Link>
      </div>
      <div className="flex items-center gap-2">
        {resumeUrl && (
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
             data-testid="nav-resume-btn" onClick={() => track("resume_download", "nav")}
             className="btn-primary hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Download size={14}/> Resume
          </a>
        )}
        <button onClick={toggle} data-testid="theme-toggle" aria-label="Toggle theme"
                className="btn-ghost inline-flex items-center justify-center w-9 h-9 rounded-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme}
              initial={{ y: -10, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 10, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25 }} className="inline-flex">
              {theme === "dark" ? <Sun size={15}/> : <Moon size={15}/>}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  </motion.nav>
  );
};

// ================ HERO ================
const Hero = ({ profile }) => (
  <section id="top" data-testid="hero-section" className="relative container-x pt-16 md:pt-24 pb-20 overflow-hidden">
    <div className="blob blob-1" style={{ top: "-100px", right: "-80px", width: "420px", height: "420px" }}/>
    <div className="blob blob-2" style={{ top: "40%", left: "-60px", width: "320px", height: "320px" }}/>
    <div className="blob blob-3" style={{ bottom: "-100px", right: "20%", width: "360px", height: "360px" }}/>

    <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div className="lg:col-span-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-mono text-[hsl(var(--muted-foreground))] mb-6 bg-[hsl(var(--card))]/60 backdrop-blur">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping"/>
            <span className="relative rounded-full w-2 h-2 bg-emerald-600"/>
          </span>
          <span data-testid="hero-availability">Open to Data Analyst · Business Analyst · AI roles</span>
        </motion.div>

        <h1 data-testid="hero-heading" className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-bold leading-[1.02] tracking-tight mb-6">
          {["Data.", "Decisions.", "Delivered."].map((w, i) => (
            <motion.span key={w}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.2, 0.9, 0.3, 1] }}
              className={`inline-block ${i === 1 ? "italic-accent text-[hsl(var(--accent))] mr-3" : "mr-3"}`}>
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p data-testid="hero-value-prop"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
          className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed mb-3">
          I turn <span className="marker text-[hsl(var(--foreground))] font-medium">messy data into decisions</span>. At Practo: lifted paid transactions 6–10% via LTV/CAC modeling, stopped ₹12L/month in SEM fraud, and cut a 4-minute RCA query down to 45 seconds.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="text-sm md:text-base text-[hsl(var(--muted-foreground))]/85 max-w-2xl">
          {profile?.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.85 }}
          className="flex flex-wrap items-center gap-3 mt-8">
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer"
               data-testid="hero-resume-btn" onClick={() => track("resume_download", "hero")}
               className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
              <Download size={15}/> Download Resume
            </a>
          )}
          {profile?.calendly && (
            <a href={profile.calendly} target="_blank" rel="noopener noreferrer"
               data-testid="hero-calendly-btn" onClick={() => track("external_click", "calendly", { source: "hero" })}
               className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
              <Calendar size={15}/> Book a call
            </a>
          )}
          <a href="#contact" data-testid="hero-contact-btn"
             className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
            <Mail size={15}/> Get in touch
          </a>
          <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer"
             onClick={() => track("external_click", "linkedin", { source: "hero" })}
             className="link-underline inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2"><Linkedin size={14}/> LinkedIn</a>
          <a href={profile?.github} target="_blank" rel="noopener noreferrer"
             onClick={() => track("external_click", "github", { source: "hero" })}
             className="link-underline inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2"><Github size={14}/> GitHub</a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.9, 0.3, 1] }}
        className="lg:col-span-4">
        <motion.div
          whileHover={{ y: -4, rotate: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="card-soft rounded-3xl p-6">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--accent))]/20 via-[hsl(var(--highlight))]/25 to-[hsl(var(--accent-2))]/15">
            <img src={profile?.avatar_url} alt="Abhishek Banaj — AI avatar" data-testid="hero-avatar"
                 loading="eager" className="w-full h-full object-cover"/>
          </div>
          <div className="text-center">
            <div className="font-serif text-xl font-semibold">{profile?.name}</div>
            <div className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] mt-1">{profile?.headline}</div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] mt-3">
              <MapPin size={12}/> {profile?.location}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3">
            <div><div className="font-serif text-2xl font-bold">8.35</div><div className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">MSc GPA / REVA</div></div>
            <div><div className="font-serif text-2xl font-bold">1+</div><div className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Years shipping</div></div>
          </div>
        </motion.div>
      </motion.div>
    </div>

    {/* Impact strip */}
    <div data-testid="impact-strip" className="relative mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-10 border-t border-border">
      {profile?.impact_metrics?.map((m, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <div data-testid={`impact-${i}`}>
            <div className="impact-num text-5xl md:text-6xl leading-none mb-3"><AnimatedNumber value={m.value}/></div>
            <div className="text-xs md:text-sm text-[hsl(var(--muted-foreground))] leading-snug max-w-[220px]">{m.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// ================ WHY HIRE ME ================
const WhyHireMe = ({ items }) => (
  <section id="why" data-testid="why-hire-me-section" className="container-x py-16 md:py-20">
    <Reveal>
      <div className="max-w-3xl mb-10 md:mb-14">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 inline-flex items-center gap-2"><Sparkles size={12}/> Why hire me</div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          What you get on <span className="italic-accent text-[hsl(var(--accent))]">day one</span>.
        </h2>
      </div>
    </Reveal>
    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
      {items?.map((it, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div data-testid={`why-item-${i}`} className="card-soft rounded-2xl p-6 md:p-7 h-full">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] inline-flex items-center justify-center mb-4">
              <CheckCircle2 size={18}/>
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">{it.title}</h3>
            <p className="text-sm md:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">{it.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// ================ WORK ================
const Work = () => {
  const [activeId, setActiveId] = useState(null);
  const active = CASE_STUDIES.find(cs => cs.id === activeId);
  return (
    <section id="work" data-testid="work-section" className="container-x py-16 md:py-20">
      <Reveal>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Selected work</div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Problems solved, <span className="italic-accent text-[hsl(var(--accent))]">metrics moved</span>.
            </h2>
          </div>
        </div>
      </Reveal>
      <div className="space-y-4 md:space-y-6">
        {CASE_STUDIES.map((cs, i) => {
          const hasDetails = !!cs.details;
          const CardTag = hasDetails ? motion.button : motion.a;
          const cardProps = hasDetails
            ? { type: "button", onClick: () => { setActiveId(cs.id); track("case_study_open", cs.id); } }
            : { href: cs.href, target: "_blank", rel: "noopener noreferrer", onClick: () => track("project_click", cs.id, { source: "case_study" }) };
          return (
          <Reveal key={cs.id} delay={i * 0.06}>
            <CardTag data-testid={`case-${cs.id}`}
               whileHover={{ y: -3 }}
               transition={{ type: "spring", stiffness: 260, damping: 22 }}
               className="group card-soft rounded-2xl p-6 md:p-8 block w-full text-left"
               {...cardProps}>
              <div className="grid md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-5">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-outline font-serif text-4xl md:text-5xl font-bold">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Case</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">{cs.title}</h3>
                  <div className="text-xs font-mono text-[hsl(var(--muted-foreground))] mb-4">{cs.role}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cs.stack.map(s => (
                      <span key={s} className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-3 text-sm md:text-base">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1">Problem</div>
                    <p className="leading-relaxed">{cs.problem}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1">Action</div>
                    <p className="leading-relaxed">{cs.action}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5">Result</div>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {cs.result.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-sm">
                          <TrendingUp size={14} className="text-[hsl(var(--accent))] mt-0.5 shrink-0"/>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[hsl(var(--accent))]">
                      {hasDetails ? "View case study" : "View details"} <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                    </span>
                  </div>
                </div>
              </div>
            </CardTag>
          </Reveal>
          );
        })}
      </div>
      <div className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">
        More projects on <a href="https://github.com/AbhishekCbanaj" target="_blank" rel="noopener noreferrer"
                            onClick={() => track("external_click", "github", { source: "work_footer" })}
                            className="link-underline text-[hsl(var(--foreground))]">GitHub</a>.
      </div>
      <Dialog.Root open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content
            data-testid="case-study-modal"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto card-soft rounded-2xl p-6 md:p-8 focus:outline-none">
            {active && active.details && (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <Dialog.Title className="font-serif text-2xl md:text-3xl font-semibold">{active.title}</Dialog.Title>
                    <div className="text-xs font-mono text-[hsl(var(--muted-foreground))] mt-1">{active.role}</div>
                  </div>
                  <Dialog.Close data-testid="case-study-modal-close" aria-label="Close"
                    className="btn-ghost inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0">
                    <X size={16}/>
                  </Dialog.Close>
                </div>
                <div className="space-y-5 text-sm md:text-base">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5">Context</div>
                    <p className="leading-relaxed">{active.details.context}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5">Approach</div>
                    <ol className="space-y-2.5">
                      {active.details.approach.map((step, si) => (
                        <li key={si} className="flex items-start gap-3">
                          <span className="font-mono text-xs text-[hsl(var(--accent))] mt-0.5 shrink-0">{String(si + 1).padStart(2, "0")}</span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1.5">Impact</div>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {active.details.impact.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-sm">
                          <TrendingUp size={14} className="text-[hsl(var(--accent))] mt-0.5 shrink-0"/>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {active.stack.map(s => (
                      <span key={s} className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{s}</span>
                    ))}
                  </div>
                  {active.href && (
                    <a href={active.href} target="_blank" rel="noopener noreferrer" data-testid="case-study-modal-repo-link"
                       onClick={() => track("external_click", "repo", { source: "case_study_modal", id: active.id })}
                       className="inline-flex items-center gap-1.5 text-xs font-mono text-[hsl(var(--accent))] link-underline pt-1">
                      <Github size={13}/> View repository <ArrowUpRight size={12}/>
                    </a>
                  )}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};

// ================ EXPERIENCE ================
const Experience = ({ experience }) => (
  <section id="experience" data-testid="experience-section" className="container-x py-16 md:py-20">
    <div className="grid md:grid-cols-12 gap-8 md:gap-10">
      <div className="md:col-span-4">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Experience</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">Where I&apos;ve <span className="italic-accent text-[hsl(var(--accent))]">shipped</span>.</h2>
        </Reveal>
      </div>
      <div className="md:col-span-8 space-y-4">
        {experience?.map((e, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div data-testid={`exp-item-${i}`} className="card-soft rounded-2xl p-6 md:p-7">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="font-serif text-xl font-semibold">{e.role}</div>
                  <div className="text-sm text-[hsl(var(--accent))] font-medium">{e.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-[hsl(var(--muted-foreground))]">{e.period}</div>
                  <div className="text-xs font-mono text-[hsl(var(--muted-foreground))]">{e.location}</div>
                  {e.current && <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Current</div>}
                </div>
              </div>
              <ul className="space-y-2 text-sm md:text-[15px] text-[hsl(var(--muted-foreground))]">
                {e.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2">
                    <TrendingUp size={14} className="text-[hsl(var(--accent))] mt-1 shrink-0"/>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ================ SKILLS ================
const Skills = ({ skills }) => (
  <section id="skills" data-testid="skills-section" className="container-x py-16 md:py-20">
    <Reveal>
      <div className="max-w-2xl mb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Toolkit</div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
          The <span className="italic-accent text-[hsl(var(--accent))]">stack</span> I ship with.
        </h2>
      </div>
    </Reveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills?.map((group, gi) => (
        <Reveal key={group.group} delay={gi * 0.05}>
          <div data-testid={`skill-group-${group.group.replace(/\s+/g, "-").toLowerCase()}`} className="card-soft rounded-2xl p-5 h-full">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((s) => (
                <motion.span key={s.name}
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] border border-transparent hover:border-[hsl(var(--accent))]/40 hover:bg-[hsl(var(--accent))]/10 hover:text-[hsl(var(--accent))] cursor-default">
                  {s.name}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// ================ EDUCATION + CERTS ================
const EducationCerts = ({ education, certifications }) => (
  <section data-testid="education-section" className="container-x py-16 md:py-20">
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-5">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 flex items-center gap-2"><GraduationCap size={14}/> Education</div>
          <div className="space-y-3">
            {education?.map((e, i) => (
              <div key={i} data-testid={`edu-item-${i}`} className="card-soft rounded-2xl p-5">
                <div className="font-serif text-lg font-semibold">{e.degree}</div>
                <div className="text-sm text-[hsl(var(--accent))]">{e.school}</div>
                <div className="text-xs font-mono text-[hsl(var(--muted-foreground))] mt-1">{e.period} · GPA {e.gpa}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-2">{e.notes}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="md:col-span-7">
        <Reveal delay={0.1}>
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3 flex items-center gap-2"><Award size={14}/> Certifications</div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {certifications?.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
                 data-testid={`cert-${i}`} onClick={() => track("cert_click", c.title, { issuer: c.issuer })}
                 className="card-soft rounded-xl p-4 block">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{c.date}</div>
                  <ArrowUpRight size={12} className="text-[hsl(var(--muted-foreground))]"/>
                </div>
                <div className="font-serif text-sm font-semibold leading-tight">{c.title}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{c.issuer}</div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ================ CONTACT ================
const Contact = ({ profile }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all fields"); return; }
    setSending(true);
    try {
      const r = await axios.post(`${API}/contact`, form);
      track("contact_submit", "", { email_sent: !!r.data.email_sent });
      if (r.data.email_sent) toast.success("Message sent — email delivered to Abhishek!");
      else toast.success("Message received! Abhishek will get back to you.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) { toast.error(err.response?.data?.detail || "Failed to send message"); }
    finally { setSending(false); }
  };
  return (
    <section id="contact" data-testid="contact-section" className="container-x py-16 md:py-24">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <Reveal className="md:col-span-5">
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Contact</div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Let&apos;s <span className="italic-accent text-[hsl(var(--accent))]">talk</span>.</h2>
          <p className="text-[hsl(var(--muted-foreground))] mt-4 max-w-md text-sm md:text-base">
            Hiring for Analytics, Business Analyst, Data Scientist, or AI Engineer roles? I reply within 24 hours.
          </p>
          {profile?.calendly && (
            <a href={profile.calendly} target="_blank" rel="noopener noreferrer" data-testid="contact-calendly"
               onClick={() => track("external_click", "calendly", { source: "contact" })}
               className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium mt-5">
              <Calendar size={14}/> Book a call
            </a>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--accent))]">
              <Zap size={12}/> Immediate Joiner
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--accent))]">
              <Globe size={12}/> Open for Relocation
            </span>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <a href={`mailto:${profile?.email}`} data-testid="contact-email" onClick={() => track("external_click", "email")}
               className="flex items-center gap-3 hover:text-[hsl(var(--accent))] link-underline"><Mail size={15}/> Email</a>
            {profile?.phone && (
              <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} data-testid="contact-phone" onClick={() => track("external_click", "phone")}
                 className="flex items-center gap-3 hover:text-[hsl(var(--accent))] link-underline"><Phone size={15}/> {profile.phone}</a>
            )}
            <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin"
               onClick={() => track("external_click", "linkedin", { source: "contact" })}
               className="flex items-center gap-3 hover:text-[hsl(var(--accent))] link-underline"><Linkedin size={15}/> LinkedIn</a>
            <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="contact-github"
               onClick={() => track("external_click", "github", { source: "contact" })}
               className="flex items-center gap-3 hover:text-[hsl(var(--accent))] link-underline"><Github size={15}/> GitHub</a>
            <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]"><MapPin size={15}/> {profile?.location}</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer"
                 data-testid="contact-resume-download" onClick={() => track("resume_download", "contact")}
                 className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
                <Download size={14}/> Resume PDF
              </a>
            )}
            {profile?.resume_drive_url && (
              <a href={profile.resume_drive_url} target="_blank" rel="noopener noreferrer"
                 data-testid="contact-resume-drive" onClick={() => track("resume_download", "drive")}
                 className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
                <ArrowUpRight size={14}/> All resume variants
              </a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-7">
          <form onSubmit={submit} data-testid="contact-form" className="card-soft rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Name</label>
              <input data-testid="contact-name-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                     className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Email</label>
              <input data-testid="contact-email-input" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                     className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Message</label>
              <textarea data-testid="contact-message-input" rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                        className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))] resize-none"/>
            </div>
            <button data-testid="contact-submit" type="submit" disabled={sending}
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium disabled:opacity-50">
              {sending ? "Sending…" : "Send message"} <Send size={14}/>
            </button>
          </form>
        </Reveal>
      </div>
      <Reveal delay={0.15} className="mt-10 md:mt-16">
        <div className="card-soft rounded-2xl p-6 md:p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-5 flex items-center gap-2">
            <HelpCircle size={14}/> Recruiter Questions
          </div>
          <dl className="grid sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-semibold">Total Years of Experience</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">1+ year (Business Analyst Intern @ Practo; MIS Executive @ Shameem Arts & Handicrafts)</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Current CTC</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">₹3.6 LPA (₹30,000/month)</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Expected CTC (ECTC)</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">₹6–10 LPA (Negotiable)</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Notice Period</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Immediate Joiner</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Current Location</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Bengaluru, Karnataka</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">Open For Relocation</dt>
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Yes, comfortable relocating and working from the office or remote.</dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  );
};

// ================ FOOTER ================
const Footer = ({ profile }) => (
  <footer data-testid="site-footer" className="border-t border-border py-8">
    <div className="container-x flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[hsl(var(--muted-foreground))]">
      <div>© {new Date().getFullYear()} {profile?.name} · Data · AI · Analytics</div>
      <div className="flex items-center gap-4">
        <a href={profile?.github} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[hsl(var(--foreground))]">GitHub</a>
        <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[hsl(var(--foreground))]">LinkedIn</a>
        <a href={`mailto:${profile?.email}`} className="link-underline hover:text-[hsl(var(--foreground))]">Email</a>
        {profile?.phone && <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="link-underline hover:text-[hsl(var(--foreground))]">{profile.phone}</a>}
        {profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[hsl(var(--foreground))]">Resume</a>}
      </div>
    </div>
  </footer>
);

const Home = () => {
  const [theme, toggleTheme] = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    document.title = "Abhishek Banaj — Data · AI · Analytics";
    track("page_view", "home");
    axios.get(`${API}/profile`)
      .then((r) => setData(r.data))
      .catch((e) => { setError(e.message); toast.error("Failed to load profile"); })
      .finally(() => setLoading(false));
  }, []);
  if (loading) return (
    <div data-testid="loading-screen" className="min-h-screen flex items-center justify-center">
      <div className="font-mono text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
    </div>
  );
  if (error || !data) return (
    <div data-testid="error-screen" className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="font-serif text-2xl mb-3">Something broke.</div>
        <div className="text-[hsl(var(--muted-foreground))]">{error}</div>
      </div>
    </div>
  );
  return (
    <div>
      <Nav theme={theme} toggle={toggleTheme} resumeUrl={data.profile?.resume_url}/>
      <Hero profile={data.profile}/>
      <WhyHireMe items={data.profile?.why_hire_me}/>
      <Work/>
      <Experience experience={data.experience}/>
      <Skills skills={data.skills}/>
      <EducationCerts education={data.education} certifications={data.certifications}/>
      <Contact profile={data.profile}/>
      <Footer profile={data.profile}/>
    </div>
  );
};

// ================ ANALYTICS ADMIN ================
const BarRow = ({ label, count, max }) => (
  <div>
    <div className="flex items-baseline justify-between text-sm mb-1">
      <span className="truncate pr-2">{label}</span>
      <span className="font-mono text-[hsl(var(--muted-foreground))] shrink-0">{count}</span>
    </div>
    <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
      <div className="h-full rounded-full bg-[hsl(var(--accent))]" style={{ width: `${max ? (count / max) * 100 : 0}%` }}/>
    </div>
  </div>
);

const AdminCard = ({ title, children }) => (
  <div className="card-soft rounded-2xl p-6">
    <div className="font-mono text-[11px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">{title}</div>
    {children}
  </div>
);

const AnalyticsAdmin = () => {
  const [token, setToken] = useState(() => localStorage.getItem("analytics_token") || "");
  const [tokenInput, setTokenInput] = useState("");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = (tok, d) => {
    if (!tok) return;
    setLoading(true); setError(null);
    axios.get(`${API}/analytics`, { params: { token: tok, days: d } })
      .then((r) => { setData(r.data); localStorage.setItem("analytics_token", tok); setToken(tok); })
      .catch((e) => {
        if (e.response?.status === 403) { setError("Invalid token"); localStorage.removeItem("analytics_token"); setToken(""); }
        else setError("Failed to load analytics");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Analytics — Abhishek Banaj";
    if (token) fetchData(token, days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token && data) fetchData(token, days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const logout = () => { localStorage.removeItem("analytics_token"); setToken(""); setData(null); };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={(e) => { e.preventDefault(); fetchData(tokenInput, days); }}
              data-testid="admin-login-form" className="card-soft rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-5 text-[hsl(var(--muted-foreground))]">
            <Lock size={16}/><span className="font-mono text-xs uppercase tracking-widest">Analytics access</span>
          </div>
          <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)}
                 data-testid="admin-token-input" placeholder="Enter access token" autoFocus
                 className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))] mb-4"/>
          {error && <div className="text-sm text-red-400 mb-3">{error}</div>}
          <button type="submit" disabled={loading} data-testid="admin-token-submit"
                  className="btn-primary w-full inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50">
            {loading ? "Checking…" : "View analytics"}
          </button>
        </form>
      </div>
    );
  }

  const maxType = Math.max(1, ...(data?.totals_by_type || []).map((t) => t.count));
  const maxProject = Math.max(1, ...(data?.top_projects || []).map((p) => p.count));
  const maxReferrer = Math.max(1, ...(data?.top_referrers || []).map((r) => r.count));
  const maxDaily = Math.max(1, ...(data?.daily || []).map((d) => d.count));

  return (
    <div className="container-x py-10 md:py-14">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">Private</div>
          <h1 className="font-serif text-3xl font-bold">Portfolio analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)} data-testid={`admin-days-${d}`}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${days === d ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border-transparent" : "border-border text-[hsl(var(--muted-foreground))]"}`}>
              {d}d
            </button>
          ))}
          <button onClick={() => fetchData(token, days)} aria-label="Refresh" className="btn-ghost inline-flex items-center justify-center w-9 h-9 rounded-full">
            <RefreshCw size={15}/>
          </button>
          <button onClick={logout} aria-label="Log out" data-testid="admin-logout" className="btn-ghost inline-flex items-center justify-center w-9 h-9 rounded-full">
            <LogOut size={15}/>
          </button>
        </div>
      </div>

      {loading && !data && <div className="font-mono text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>}
      {error && <div className="text-sm text-red-400 mb-4">{error}</div>}

      {data && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AdminCard title="Contact messages">
            <div className="font-serif text-5xl font-bold text-[hsl(var(--accent))]">{data.contact_messages}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))] mt-1">in the last {data.range_days} days</div>
          </AdminCard>

          <AdminCard title="Events by type">
            <div className="space-y-3">
              {(data.totals_by_type || []).length ? data.totals_by_type.map((t) => (
                <BarRow key={t.type} label={t.type} count={t.count} max={maxType}/>
              )) : <div className="text-sm text-[hsl(var(--muted-foreground))]">No events yet.</div>}
            </div>
          </AdminCard>

          <AdminCard title="Top referrers">
            <div className="space-y-3">
              {(data.top_referrers || []).length ? data.top_referrers.map((r, i) => (
                <BarRow key={i} label={r.referrer} count={r.count} max={maxReferrer}/>
              )) : <div className="text-sm text-[hsl(var(--muted-foreground))]">No referrers yet.</div>}
            </div>
          </AdminCard>

          <AdminCard title="Top project clicks">
            <div className="space-y-3">
              {(data.top_projects || []).length ? data.top_projects.map((p, i) => (
                <BarRow key={i} label={p.label || "(unlabeled)"} count={p.count} max={maxProject}/>
              )) : <div className="text-sm text-[hsl(var(--muted-foreground))]">No project clicks yet.</div>}
            </div>
          </AdminCard>

          <AdminCard title="Daily activity">
            <div className="flex items-end gap-1 h-24">
              {(data.daily || []).map((d, i) => (
                <div key={i} title={`${d.date}: ${d.count}`} className="flex-1 bg-[hsl(var(--accent))]/70 rounded-sm min-h-[2px]"
                     style={{ height: `${(d.count / maxDaily) * 100}%` }}/>
              ))}
              {!(data.daily || []).length && <div className="text-sm text-[hsl(var(--muted-foreground))]">No activity yet.</div>}
            </div>
          </AdminCard>

          <AdminCard title="Recent events">
            <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
              {(data.recent_events || []).length ? data.recent_events.map((e, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-1.5 last:border-0">
                  <span className="truncate">{e.type}{e.label ? ` · ${e.label}` : ""}</span>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] shrink-0">{new Date(e.created_at).toLocaleString()}</span>
                </div>
              )) : <div className="text-[hsl(var(--muted-foreground))]">No events yet.</div>}
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
};

// ================ BLOG ================
const BlogList = () => {
  const [theme, toggleTheme] = useTheme();
  useEffect(() => {
    document.title = "Blog — Abhishek Banaj";
    track("page_view", "blog");
  }, []);
  return (
    <div>
      <Nav theme={theme} toggle={toggleTheme} resumeUrl={undefined}/>
      <section className="container-x py-16 md:py-24 min-h-[60vh]">
        <Reveal>
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Blog</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">Notes from <span className="italic-accent text-[hsl(var(--accent))]">the work</span>.</h1>
          </div>
        </Reveal>
        <div className="space-y-4 md:space-y-6">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link to={`/blog/${post.slug}`} data-testid={`blog-card-${post.slug}`} onClick={() => track("blog_open", post.slug)}
                 className="group card-soft rounded-2xl p-6 md:p-8 block">
                <div className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-2">
                  {formatBlogDate(post.date)} · {post.readTime}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">{post.title}</h2>
                <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base">{post.dek}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.tags.map(t => (
                    <span key={t} className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{t}</span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer profile={STATIC_PROFILE}/>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [theme, toggleTheme] = useTheme();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  useEffect(() => {
    document.title = post ? `${post.title} — Abhishek Banaj` : "Post not found — Abhishek Banaj";
    track("page_view", post ? `blog_${slug}` : "blog_404");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return (
    <div>
      <Nav theme={theme} toggle={toggleTheme} resumeUrl={undefined}/>
      <article className="container-x py-16 md:py-24 max-w-2xl min-h-[60vh]">
        <Link to="/blog" data-testid="blog-back-link"
           className="inline-flex items-center gap-1.5 text-xs font-mono text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] link-underline mb-8">
          ← All posts
        </Link>
        {post ? (
          <>
            <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
              {formatBlogDate(post.date)} · {post.readTime}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
            <div className="flex flex-wrap gap-1.5 mb-10">
              {post.tags.map(t => (
                <span key={t} className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{t}</span>
              ))}
            </div>
            <div className="space-y-5 text-base md:text-lg leading-relaxed">
              {post.content.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </>
        ) : (
          <div className="font-serif text-2xl">Post not found.</div>
        )}
      </article>
      <Footer profile={STATIC_PROFILE}/>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<AnalyticsAdmin/>}/>
          <Route path="/blog" element={<BlogList/>}/>
          <Route path="/blog/:slug" element={<BlogPost/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
