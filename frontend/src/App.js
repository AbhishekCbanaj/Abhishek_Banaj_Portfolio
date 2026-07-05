import { useEffect, useMemo, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Mail, MapPin, ExternalLink, Star, GitFork,
  ArrowUpRight, Search, Download, Send, ChevronDown, Sparkles, Code2,
  BrainCircuit, LineChart, Workflow, Globe2, Sun, Moon,
  FileText, Award, Briefcase, GraduationCap, Zap
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ROLE_ICONS = {
  "ai-engineer": BrainCircuit,
  "data-scientist": Sparkles,
  "data-analyst": LineChart,
  "data-engineer": Workflow,
  "full-stack": Globe2,
};

// ================= THEME HOOK =================
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
};

const ThemeToggle = ({ theme, toggle }) => (
  <button
    onClick={toggle}
    data-testid="theme-toggle"
    aria-label="Toggle theme"
    className="relative w-10 h-10 rounded-full border border-border grid place-items-center overflow-hidden hover:border-[hsl(var(--accent))]"
  >
    <AnimatePresence mode="wait" initial={false}>
      {theme === "dark" ? (
        <motion.span key="sun" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }} className="absolute inset-0 grid place-items-center">
          <Sun size={16} className="text-[hsl(var(--accent))]" />
        </motion.span>
      ) : (
        <motion.span key="moon" initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.3 }} className="absolute inset-0 grid place-items-center">
          <Moon size={16} />
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

// ================= FADE-IN =================
const FadeIn = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ================= NAV =================
const Nav = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <nav data-testid="site-nav" className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? "glass" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-logo" className="font-display font-bold text-lg tracking-tight">
          AB<span className="text-[hsl(var(--accent))]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-testid={`nav-${l.label.toLowerCase()}`}
               className="text-muted-foreground hover:text-foreground relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(var(--accent))] group-hover:w-full transition-all"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <a href="https://github.com/AbhishekCbanaj" target="_blank" rel="noopener noreferrer"
             data-testid="nav-github-cta"
             className="hidden md:inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-mono hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
            <Github size={14}/> GitHub
          </a>
          <button data-testid="nav-mobile-toggle" onClick={() => setOpen(!open)} className="md:hidden">
            <ChevronDown className={`transition ${open ? "rotate-180" : ""}`}/>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-border glass overflow-hidden">
            <div className="px-6 py-4 flex flex-col gap-3 font-mono text-sm">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">{l.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ================= HERO =================
const Hero = ({ profile }) => {
  const resumeUrl = profile?.resume_url || profile?.resume_drive_url;
  return (
    <section id="top" data-testid="hero-section" className="relative pt-32 pb-24 px-6 lg:px-10 overflow-hidden bg-grid">
      <div className="orb orb-accent w-96 h-96 -top-20 -right-20 animate-float"></div>
      <div className="orb orb-accent w-72 h-72 top-1/2 -left-40 animate-float-alt opacity-25"></div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3 flex-wrap">
            <span className="w-8 h-px bg-[hsl(var(--accent))]"></span>
            <span data-testid="hero-location">{profile?.location || "Bengaluru, India"}</span>
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse"></span>
            <span>Business Analyst @ Practo · Open to opportunities</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            data-testid="hero-name"
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
            {profile?.name || "Abhishek Banaj"}
            <span className="text-[hsl(var(--accent))]">.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="hero-headline"
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {profile?.headline}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
            {profile?.summary}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" data-testid="hero-view-work"
               className="group inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-mono text-sm hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
              View my work <ArrowUpRight size={16} className="group-hover:rotate-45 transition"/>
            </a>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" data-testid="hero-resume-btn"
                 className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-full font-mono text-sm hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">
                <FileText size={16}/> Download Resume
              </a>
            )}
            <a href="#contact" data-testid="hero-contact-btn"
               className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-full font-mono text-sm hover:border-[hsl(var(--accent))]">
              Get in touch <Mail size={16}/>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center gap-6">
            <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="hero-github" className="text-muted-foreground hover:text-[hsl(var(--accent))]"><Github/></a>
            <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="hero-linkedin" className="text-muted-foreground hover:text-[hsl(var(--accent))]"><Linkedin/></a>
            <a href={`mailto:${profile?.email}`} data-testid="hero-email" className="text-muted-foreground hover:text-[hsl(var(--accent))]"><Mail/></a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 lg:pl-8">
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full bg-[hsl(var(--accent))] rounded-2xl"></div>
            <div className="relative glass-strong rounded-2xl p-6 space-y-4">
              <div className="relative overflow-hidden rounded-xl">
                <img src={profile?.avatar_url} alt="Abhishek" data-testid="hero-avatar"
                     className="w-full aspect-square object-cover grayscale hover:grayscale-0 hover:scale-105 transition duration-700"/>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono">
                {profile?.stats && Object.entries(profile.stats).map(([k, v], i) => (
                  <motion.div key={k}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                    className="p-3 rounded-lg bg-muted/70 backdrop-blur">
                    <div className="text-2xl font-display font-bold">{v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{k.replace(/_/g, " ")}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ================= MARQUEE =================
const Marquee = () => {
  const items = "Python · SQL · Power BI · Redshift · LTV & CAC Models · Cohort Analysis · A/B Testing · LLMs · Apache Spark · Kafka · Azure AI · Docker · Root Cause Analysis · XGBoost · LangChain · OpenAI · Streamlit · FastAPI".split("·");
  return (
    <div data-testid="skill-marquee" className="border-y border-border bg-card overflow-hidden py-6">
      <div className="flex animate-marquee whitespace-nowrap font-display text-3xl sm:text-4xl font-bold">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-6 flex items-center gap-6">
            {t.trim()}
            <span className="text-[hsl(var(--accent))]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ================= ABOUT =================
const About = () => (
  <section id="about" data-testid="about-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-10">
      <FadeIn className="lg:col-span-5">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">01 · About</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
          Turning data <br/>into <span className="text-outline">decisions.</span>
        </h2>
      </FadeIn>
      <FadeIn delay={0.15} className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
        <p>
          I&apos;m currently a <span className="text-foreground font-medium">Business Analyst at Practo Technologies</span>, where I own end-to-end analyses that touch millions of users — LTV/CAC models across pricing tiers, 90-day cohort retention studies, and Redshift optimization work that turns hours-long RCAs into 45-second reports.
        </p>
        <p>
          Before Practo, I built self-serve BI at <span className="text-foreground font-medium">InLighn Tech</span>, cutting a 15-hour weekly KPI process by 60%. I hold an <span className="text-foreground font-medium">M.Sc. Data Science from REVA University</span> (GPA 8.35) and I keep shipping side projects — LLM agents, Spark/Kafka pipelines, Power BI dashboards.
        </p>
        <p>
          Off the keyboard: gym, powerlifting, gaming events. I believe balanced humans build better software.
        </p>
      </FadeIn>
    </div>
  </section>
);

// ================= EXPERIENCE =================
const Experience = ({ experience, education }) => (
  <section id="experience" data-testid="experience-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <FadeIn>
      <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">02 · Journey</div>
      <h2 className="font-display text-4xl sm:text-5xl font-bold mb-12">Experience & Education.</h2>
    </FadeIn>
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        <FadeIn>
          <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase size={18} className="text-[hsl(var(--accent))]"/> Work
          </h3>
        </FadeIn>
        <div className="space-y-6 relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border"></div>
          {experience?.map((e, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div data-testid={`exp-item-${i}`} className="relative pl-10">
                <div className={`absolute left-1 top-6 w-4 h-4 rounded-full border-2 ${e.current ? "bg-[hsl(var(--accent))] border-[hsl(var(--accent))]" : "bg-background border-border"}`}>
                  {e.current && <span className="absolute inset-0 rounded-full animate-ping bg-[hsl(var(--accent))] opacity-60"></span>}
                </div>
                <div className="glass rounded-xl p-6 hover:border-[hsl(var(--accent))] transition">
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-2 flex-wrap">
                    <span>{e.period}</span>
                    <span>·</span>
                    <span>{e.location}</span>
                    {e.current && <span className="ml-auto text-[10px] uppercase tracking-widest bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <div className="font-display text-lg font-semibold">{e.role}</div>
                  <div className="text-[hsl(var(--accent))] font-mono text-sm mb-3">{e.company}</div>
                  <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {e.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2"><span className="text-[hsl(var(--accent))] mt-1">→</span><span>{b}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <div>
        <FadeIn>
          <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
            <GraduationCap size={18} className="text-[hsl(var(--accent))]"/> Education
          </h3>
        </FadeIn>
        <div className="space-y-6">
          {education?.map((e, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div data-testid={`edu-item-${i}`} className="glass rounded-xl p-6 hover:border-[hsl(var(--accent))] transition">
                <div className="font-mono text-xs text-muted-foreground mb-2">{e.period} · GPA {e.gpa}</div>
                <div className="font-display text-lg font-semibold">{e.degree}</div>
                <div className="text-[hsl(var(--accent))] font-mono text-sm mb-3">{e.school}</div>
                <div className="text-sm text-muted-foreground">{e.notes}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ================= FEATURED =================
const FeaturedProjects = ({ featured }) => {
  if (!featured?.length) return null;
  return (
    <div className="mb-14">
      <FadeIn>
        <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
          <Zap size={20} className="text-[hsl(var(--accent))]"/> Highlighted work
        </h3>
      </FadeIn>
      <div className="grid md:grid-cols-2 gap-5">
        {featured.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <a href={p.html_url} target="_blank" rel="noopener noreferrer"
               data-testid={`featured-project-${p.id}`}
               className="group relative glass rounded-2xl p-7 hover:-translate-y-1 hover:border-[hsl(var(--accent))] flex flex-col h-full overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[hsl(var(--accent))] rounded-full opacity-10 group-hover:opacity-30 transition"></div>
              <div className="flex items-start justify-between mb-3 relative">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-1 rounded-full">Featured</span>
                <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-[hsl(var(--accent))] group-hover:rotate-45 transition"/>
              </div>
              <h4 className="font-display font-bold text-xl leading-tight mb-3">{p.name}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center flex-wrap gap-2">
                {p.topics?.slice(0, 5).map((t) => (
                  <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
                ))}
                {p.homepage && (
                  <span className="ml-auto font-mono text-xs text-[hsl(var(--accent))] inline-flex items-center gap-1"><ExternalLink size={12}/> live</span>
                )}
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

// ================= PROJECTS =================
const Projects = ({ roles, featured }) => {
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");
  const [data, setData] = useState({ projects: [], counts: {}, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios.get(`${API}/projects`, { params: { role: active, q: q || undefined } })
      .then((r) => { if (!cancelled) setData(r.data); })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [active, q]);

  const tabs = useMemo(() => ([
    { id: "all", label: "All Projects", tagline: "Everything I've shipped" },
    ...(roles || []),
  ]), [roles]);

  return (
    <section id="projects" data-testid="projects-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      <FadeIn>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">03 · Portfolio</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Projects by role.</h2>
            <p className="text-muted-foreground mt-3 max-w-xl">Every repo classified by the role it demonstrates. Click a tab to filter.</p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input data-testid="projects-search" value={q} onChange={(e) => setQ(e.target.value)}
                   placeholder="Search projects…"
                   className="pl-9 pr-4 py-2.5 glass rounded-full text-sm font-mono min-w-[240px] focus:outline-none focus:border-[hsl(var(--accent))]"/>
          </div>
        </div>
      </FadeIn>

      <FeaturedProjects featured={featured} />

      <FadeIn>
        <div className="flex flex-wrap gap-2 mt-8 mb-10">
          {tabs.map((t) => {
            const Icon = ROLE_ICONS[t.id] || Code2;
            const count = data.counts?.[t.id] ?? 0;
            const isActive = active === t.id;
            return (
              <button key={t.id} data-testid={`role-tab-${t.id}`} onClick={() => setActive(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-sm ${
                  isActive ? "bg-foreground text-background border-foreground shadow-lg"
                           : "glass text-foreground hover:border-foreground/50"
                }`}>
                <Icon size={14}/>
                {t.label}
                <span className={`ml-1 text-xs ${isActive ? "opacity-70" : "text-muted-foreground"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 h-56 animate-pulse"/>
          ))}
        </div>
      ) : data.projects.length === 0 ? (
        <div data-testid="projects-empty" className="text-center py-16 text-muted-foreground font-mono">No projects match this filter.</div>
      ) : (
        <motion.div layout data-testid="projects-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {data.projects.map((p, i) => (
              <motion.div key={p.id} layout
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}>
                <ProjectCard p={p}/>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

const ProjectCard = ({ p }) => {
  const title = p.name.replace(/[-_]/g, " ");
  return (
    <a href={p.html_url} target="_blank" rel="noopener noreferrer"
       data-testid={`project-card-${p.id}`}
       className="group relative glass rounded-xl p-6 hover:border-[hsl(var(--accent))] hover:-translate-y-1 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]"></span>
          {p.language}
        </span>
        <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-[hsl(var(--accent))] group-hover:rotate-45 transition"/>
      </div>
      <h3 className="font-display font-semibold text-lg leading-tight capitalize mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
        {p.description || "A project by Abhishek Banaj — click to explore the repo."}
      </p>
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Star size={12}/>{p.stars}</span>
        <span className="inline-flex items-center gap-1"><GitFork size={12}/>{p.forks}</span>
        {p.homepage && (
          <span className="inline-flex items-center gap-1 ml-auto text-[hsl(var(--accent))]">
            <ExternalLink size={12}/> live
          </span>
        )}
      </div>
    </a>
  );
};

// ================= SKILLS =================
const Skills = ({ skills }) => (
  <section id="skills" data-testid="skills-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-10">
      <FadeIn className="lg:col-span-4">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">04 · Toolkit</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">Skills that <span className="text-outline">ship.</span></h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Battle-tested across production ML models, BI dashboards used by stakeholders, Redshift queries touching millions of users, and LLM-powered agents in the wild.
        </p>
      </FadeIn>
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
        {skills?.map((group, gi) => (
          <FadeIn key={group.group} delay={gi * 0.06}>
            <div data-testid={`skill-group-${group.group.replace(/[\s&]+/g, '-').toLowerCase()}`} className="glass rounded-xl p-6 hover:border-[hsl(var(--accent))] transition h-full">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{group.group}</div>
              <div className="space-y-3">
                {group.items.map((s, si) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{s.level}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }}
                        transition={{ duration: 1, delay: si * 0.08, ease: "easeOut" }}
                        className="h-full bg-foreground rounded-full"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ================= CERTS =================
const Certifications = ({ certifications }) => (
  <section data-testid="certs-section" className="py-16 px-6 lg:px-10 max-w-7xl mx-auto">
    <FadeIn>
      <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
        <Award size={20} className="text-[hsl(var(--accent))]"/> Certifications
      </h3>
    </FadeIn>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {certifications?.map((c, i) => (
        <FadeIn key={i} delay={i * 0.05}>
          <a href={c.url} target="_blank" rel="noopener noreferrer"
             data-testid={`cert-item-${i}`}
             className="group glass rounded-xl p-5 hover:border-[hsl(var(--accent))] hover:-translate-y-0.5 block h-full">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.date}</div>
              <ExternalLink size={14} className="text-muted-foreground group-hover:text-[hsl(var(--accent))]"/>
            </div>
            <div className="font-display font-semibold leading-tight mb-1">{c.title}</div>
            <div className="text-sm text-muted-foreground">{c.issuer}</div>
          </a>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ================= CONTACT =================
const Contact = ({ profile }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      const r = await axios.post(`${API}/contact`, form);
      if (r.data.email_sent) {
        toast.success("Message sent! Abhishek will get back to you soon.");
      } else {
        toast.success("Message received! (email delivery pending)");
      }
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send message");
    } finally { setSending(false); }
  };
  return (
    <section id="contact" data-testid="contact-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto relative overflow-hidden">
      <div className="orb orb-accent w-80 h-80 -bottom-20 -right-20 animate-float opacity-25"></div>
      <div className="relative grid lg:grid-cols-12 gap-10">
        <FadeIn className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">05 · Contact</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">Let&apos;s build <span className="text-outline">something.</span></h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Recruiter, collaborator, or just curious? Drop me a line and I&apos;ll get back within 24 hours.
          </p>
          <div className="mt-8 space-y-4 font-mono text-sm">
            <a href={`mailto:${profile?.email}`} data-testid="contact-email" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]"><Mail size={16}/> {profile?.email}</a>
            <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]"><Linkedin size={16}/> /in/abhishekbanaj</a>
            <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="contact-github" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]"><Github size={16}/> AbhishekCbanaj</a>
            <div className="flex items-center gap-3 text-muted-foreground"><MapPin size={16}/> {profile?.location}</div>
            {profile?.resume_drive_url && (
              <a href={profile.resume_drive_url} target="_blank" rel="noopener noreferrer" data-testid="contact-resumes" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]"><Download size={16}/> All tailored resumes (Drive)</a>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.15} className="lg:col-span-7">
          <form onSubmit={submit} data-testid="contact-form" className="glass-strong rounded-2xl p-8 space-y-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <input data-testid="contact-name-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                     className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input data-testid="contact-email-input" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                     className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))]"/>
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea data-testid="contact-message-input" rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                        className="w-full mt-2 bg-transparent border-b border-border py-2 focus:outline-none focus:border-[hsl(var(--accent))] resize-none"/>
            </div>
            <button data-testid="contact-submit" type="submit" disabled={sending}
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-mono text-sm hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] disabled:opacity-50">
              {sending ? "Sending…" : "Send message"} <Send size={14}/>
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
};

// ================= FOOTER =================
const Footer = ({ profile }) => (
  <footer data-testid="site-footer" className="border-t border-border py-10 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
      <div>© {new Date().getFullYear()} {profile?.name} — Built with FastAPI + React.</div>
      <div className="flex items-center gap-4">
        <a href={profile?.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
        <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
        <a href={`mailto:${profile?.email}`} className="hover:text-foreground">Email</a>
        {profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Resume</a>}
      </div>
    </div>
  </footer>
);

// ================= HOME =================
const Home = () => {
  const { theme, toggle } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/profile`)
      .then((r) => setProfileData(r.data))
      .catch((e) => { setError(e.message); toast.error("Failed to load profile"); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div data-testid="loading-screen" className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground animate-pulse">Loading portfolio…</div>
      </div>
    );
  }
  if (error || !profileData) {
    return (
      <div data-testid="error-screen" className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="font-display text-2xl mb-3">Something broke.</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain">
      <Nav theme={theme} toggleTheme={toggle}/>
      <Hero profile={profileData.profile}/>
      <Marquee/>
      <About/>
      <Experience experience={profileData.experience} education={profileData.education}/>
      <Projects roles={profileData.roles} featured={profileData.featured_projects}/>
      <Skills skills={profileData.skills}/>
      <Certifications certifications={profileData.certifications}/>
      <Contact profile={profileData.profile}/>
      <Footer profile={profileData.profile}/>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton theme="system"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
