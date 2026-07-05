import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, useInView, useMotionValue, animate, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, MapPin, Download, Send, Sun, Moon,
  ArrowUpRight, CheckCircle2, TrendingUp, Award, GraduationCap, Sparkles,
  Zap, Globe, HelpCircle
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
    role: "Business Analyst Intern · Sep 2025 – Present",
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
  },
  {
    id: "inlighn",
    title: "InLighn Tech · KPI Automation",
    role: "Data Analyst Intern · Mar – Jun 2025",
    problem: "15+ hrs/week burned on manual KPI reporting; ad-hoc requests overwhelming the team.",
    action: "Built a SQL pipeline with validation checks, shipped 5 self-serve Power BI + Excel dashboards, audited revenue models to unify definitions.",
    result: [
      "60% faster KPI delivery",
      "70% drop in ad-hoc requests (month 1)",
      "6 hrs/week reconciliation eliminated",
    ],
    stack: ["SQL", "Power BI", "Excel", "DAX", "Data Modeling"],
    href: "https://www.linkedin.com/in/abhishekbanaj/",
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

// ================ NAV ================
const Nav = ({ theme, toggle, resumeUrl }) => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
    data-testid="site-nav"
    className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(var(--background))]/85 border-b border-border">
    <div className="container-x h-16 flex items-center justify-between">
      <a href="#top" data-testid="nav-logo" className="font-serif text-xl font-bold tracking-tight link-underline">
        Abhishek Banaj<span className="text-[hsl(var(--accent))]">.</span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        {[{href:"#work",label:"Work"},{href:"#experience",label:"Experience"},{href:"#skills",label:"Skills"},{href:"#contact",label:"Contact"}].map(l => (
          <a key={l.href} href={l.href} data-testid={`nav-${l.label.toLowerCase()}`}
             className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] link-underline">{l.label}</a>
        ))}
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
          <span data-testid="hero-availability">Open to Analytics · Data Science · AI roles</span>
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
          I turn <span className="marker text-[hsl(var(--foreground))] font-medium">messy data into growth</span>. Recently at Practo: unlocked 6–10% growth via LTV/CAC modeling, saved ₹12L/month by killing SEM fraud, and cut a 4-minute RCA query to 45 seconds.
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
            <div><div className="font-serif text-2xl font-bold">1.5+</div><div className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Years shipping</div></div>
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
const Work = () => (
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
      {CASE_STUDIES.map((cs, i) => (
        <Reveal key={cs.id} delay={i * 0.06}>
          <motion.a href={cs.href} target="_blank" rel="noopener noreferrer" data-testid={`case-${cs.id}`}
             onClick={() => track("project_click", cs.id, { source: "case_study" })}
             whileHover={{ y: -3 }}
             transition={{ type: "spring", stiffness: 260, damping: 22 }}
             className="group card-soft rounded-2xl p-6 md:p-8 block">
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
                    View details <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                  </span>
                </div>
              </div>
            </div>
          </motion.a>
        </Reveal>
      ))}
    </div>
    <div className="mt-8 text-sm text-[hsl(var(--muted-foreground))]">
      More projects on <a href="https://github.com/AbhishekCbanaj" target="_blank" rel="noopener noreferrer"
                          onClick={() => track("external_click", "github", { source: "work_footer" })}
                          className="link-underline text-[hsl(var(--foreground))]">GitHub</a>.
    </div>
  </section>
);

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
              <dd className="text-sm text-[hsl(var(--muted-foreground))] mt-1">1 year (Business Analyst &amp; Data Analyst internships)</dd>
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

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton/>
      <BrowserRouter>
        <Routes><Route path="/" element={<Home/>}/></Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
