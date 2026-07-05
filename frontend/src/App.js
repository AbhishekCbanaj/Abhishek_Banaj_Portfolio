import { useEffect, useMemo, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Github, Linkedin, Mail, MapPin, ExternalLink, Star, GitFork,
  ArrowUpRight, Search, Download, Send, ChevronDown, Sparkles, Code2, Database, BrainCircuit, LineChart, Workflow, Globe2
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

// ================= NAV =================
const Nav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <nav data-testid="site-nav" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-logo" className="font-display font-bold text-lg tracking-tight">
          AB<span className="text-[hsl(var(--accent))]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} data-testid={`nav-${l.label.toLowerCase()}`}
               className="text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
        <a href="https://github.com/AbhishekCbanaj" target="_blank" rel="noopener noreferrer"
           data-testid="nav-github-cta"
           className="hidden md:inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-mono hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
          <Github size={14}/> GitHub
        </a>
        <button data-testid="nav-mobile-toggle" onClick={() => setOpen(!open)} className="md:hidden">
          <ChevronDown className={`transition ${open ? "rotate-180" : ""}`}/>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 flex flex-col gap-3 font-mono text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                 className="text-muted-foreground hover:text-foreground">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// ================= HERO =================
const Hero = ({ profile }) => (
  <section id="top" data-testid="hero-section" className="relative pt-32 pb-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-8 animate-fade-up">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[hsl(var(--accent))]"></span>
          <span data-testid="hero-location">{profile?.location || "Bengaluru, India"}</span>
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse"></span>
          <span>Available for opportunities</span>
        </div>
        <h1 data-testid="hero-name" className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
          {profile?.name || "Abhishek Banaj"}
          <span className="text-[hsl(var(--accent))]">.</span>
        </h1>
        <p data-testid="hero-headline" className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {profile?.headline}
        </p>
        <p className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
          {profile?.summary}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#projects" data-testid="hero-view-work"
             className="group inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-mono text-sm hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
            View my work <ArrowUpRight size={16} className="group-hover:rotate-45 transition"/>
          </a>
          <a href="#contact" data-testid="hero-contact-btn"
             className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-full font-mono text-sm hover:border-[hsl(var(--accent))]">
            Get in touch <Mail size={16}/>
          </a>
        </div>
        <div className="mt-12 flex items-center gap-6">
          <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="hero-github"
             className="text-muted-foreground hover:text-foreground"><Github/></a>
          <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="hero-linkedin"
             className="text-muted-foreground hover:text-foreground"><Linkedin/></a>
          <a href={`mailto:${profile?.email}`} data-testid="hero-email"
             className="text-muted-foreground hover:text-foreground"><Mail/></a>
        </div>
      </div>
      <div className="lg:col-span-4 lg:pl-8">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-[hsl(var(--accent))] rounded-2xl"></div>
          <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4">
            <img src={profile?.avatar_url} alt="Abhishek"
                 data-testid="hero-avatar"
                 className="w-full aspect-square object-cover rounded-xl grayscale hover:grayscale-0 transition duration-500"/>
            <div className="grid grid-cols-2 gap-3 font-mono">
              {profile?.stats && Object.entries(profile.stats).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-muted">
                  <div className="text-2xl font-display font-bold">{v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{k.replace(/_/g, " ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ================= ROLE TAGLINE MARQUEE =================
const Marquee = () => (
  <div data-testid="skill-marquee" className="border-y border-border bg-card overflow-hidden py-6">
    <div className="flex animate-marquee whitespace-nowrap font-display text-3xl sm:text-4xl font-bold">
      {[..."Python · SQL · Power BI · Machine Learning · LLMs · Apache Spark · Kafka · Azure AI · Docker · Data Pipelines · XGBoost · NLP · Prompt Engineering · Streamlit · FastAPI · ".repeat(2)].join("").split("·").map((t, i) => (
        <span key={i} className="mx-6 flex items-center gap-6">
          {t.trim()}
          <span className="text-[hsl(var(--accent))]">◆</span>
        </span>
      ))}
    </div>
  </div>
);

// ================= PROJECTS =================
const Projects = ({ roles }) => {
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
    ...roles,
  ]), [roles]);

  return (
    <section id="projects" data-testid="projects-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">02 · Portfolio</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Projects by role.</h2>
          <p className="text-muted-foreground mt-3 max-w-xl">Every repo classified by the role it demonstrates. Click a tab to filter.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input data-testid="projects-search" value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Search projects…"
                 className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-full text-sm font-mono min-w-[240px] focus:outline-none focus:border-[hsl(var(--accent))]"/>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mt-8 mb-10">
        {tabs.map((t) => {
          const Icon = ROLE_ICONS[t.id] || Code2;
          const count = data.counts?.[t.id] ?? 0;
          const isActive = active === t.id;
          return (
            <button key={t.id} data-testid={`role-tab-${t.id}`} onClick={() => setActive(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-sm ${
                isActive ? "bg-foreground text-background border-foreground"
                         : "bg-transparent text-foreground border-border hover:border-foreground/50"
              }`}>
              <Icon size={14}/>
              {t.label}
              <span className={`ml-1 text-xs ${isActive ? "opacity-70" : "text-muted-foreground"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 h-56 animate-pulse"/>
          ))}
        </div>
      ) : data.projects.length === 0 ? (
        <div data-testid="projects-empty" className="text-center py-16 text-muted-foreground font-mono">
          No projects match this filter.
        </div>
      ) : (
        <div data-testid="projects-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.projects.map((p) => (
            <ProjectCard key={p.id} p={p}/>
          ))}
        </div>
      )}
    </section>
  );
};

const ProjectCard = ({ p }) => {
  const title = p.name.replace(/[-_]/g, " ").replace(/\bML\b/i, "ML");
  return (
    <a href={p.html_url} target="_blank" rel="noopener noreferrer"
       data-testid={`project-card-${p.id}`}
       className="group relative bg-card border border-border rounded-xl p-6 hover:border-[hsl(var(--accent))] hover:-translate-y-1 flex flex-col">
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
      <div className="lg:col-span-4">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">03 · Toolkit</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">Skills that ship.</h2>
        <p className="text-muted-foreground mt-4">
          Battle-tested across production ML models, BI dashboards used by stakeholders, and LLM-powered agents in the wild.
        </p>
      </div>
      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
        {skills?.map((group) => (
          <div key={group.group} data-testid={`skill-group-${group.group.replace(/\s+/g, '-').toLowerCase()}`}
               className="bg-card border border-border rounded-xl p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">{group.group}</div>
            <div className="space-y-3">
              {group.items.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all duration-700"
                         style={{ width: `${s.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ================= EXPERIENCE & EDUCATION =================
const Experience = ({ experience, education, certifications }) => (
  <section id="experience" data-testid="experience-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">04 · Journey</div>
    <h2 className="font-display text-4xl sm:text-5xl font-bold mb-12">Experience & Education.</h2>
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-6 h-px bg-[hsl(var(--accent))]"></span> Work
        </h3>
        <div className="space-y-6">
          {experience?.map((e, i) => (
            <div key={i} data-testid={`exp-item-${i}`} className="bg-card border border-border rounded-xl p-6">
              <div className="font-mono text-xs text-muted-foreground mb-2">{e.period} · {e.location}</div>
              <div className="font-display text-lg font-semibold">{e.role}</div>
              <div className="text-[hsl(var(--accent))] font-mono text-sm mb-3">{e.company}</div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {e.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2"><span className="text-[hsl(var(--accent))]">→</span>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-6 h-px bg-[hsl(var(--accent))]"></span> Education
        </h3>
        <div className="space-y-6">
          {education?.map((e, i) => (
            <div key={i} data-testid={`edu-item-${i}`} className="bg-card border border-border rounded-xl p-6">
              <div className="font-mono text-xs text-muted-foreground mb-2">{e.period} · GPA {e.gpa}</div>
              <div className="font-display text-lg font-semibold">{e.degree}</div>
              <div className="text-[hsl(var(--accent))] font-mono text-sm mb-3">{e.school}</div>
              <div className="text-sm text-muted-foreground">{e.notes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Certifications */}
    <div className="mt-16">
      <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-6 h-px bg-[hsl(var(--accent))]"></span> Certifications
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications?.map((c, i) => (
          <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
             data-testid={`cert-item-${i}`}
             className="group bg-card border border-border rounded-xl p-5 hover:border-[hsl(var(--accent))]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.date}</div>
              <ExternalLink size={14} className="text-muted-foreground group-hover:text-[hsl(var(--accent))]"/>
            </div>
            <div className="font-display font-semibold leading-tight mb-1">{c.title}</div>
            <div className="text-sm text-muted-foreground">{c.issuer}</div>
          </a>
        ))}
      </div>
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
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent! Abhishek will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send message");
    } finally { setSending(false); }
  };
  return (
    <section id="contact" data-testid="contact-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">05 · Contact</div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">Let's build something.</h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Recruiter, collaborator, or just curious? Drop me a line and I'll get back within 24 hours.
          </p>
          <div className="mt-8 space-y-4 font-mono text-sm">
            <a href={`mailto:${profile?.email}`} data-testid="contact-email" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]">
              <Mail size={16}/> {profile?.email}
            </a>
            <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]">
              <Linkedin size={16}/> /in/abhishekbanaj
            </a>
            <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="contact-github" className="flex items-center gap-3 hover:text-[hsl(var(--accent))]">
              <Github size={16}/> AbhishekCbanaj
            </a>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin size={16}/> {profile?.location}
            </div>
          </div>
        </div>
        <form onSubmit={submit} data-testid="contact-form" className="lg:col-span-7 bg-card border border-border rounded-2xl p-8 space-y-5">
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
      </div>
    </section>
  );
};

// ================= ABOUT (About Me detail) =================
const About = ({ profile }) => (
  <section id="about" data-testid="about-section" className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5">
        <div className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-3">01 · About</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
          Turning data <br/>into decisions.
        </h2>
      </div>
      <div className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
        <p>
          I'm a Data Science graduate from <span className="text-foreground">REVA University</span> with a passion for transforming complex data into meaningful business outcomes. My journey spans classical machine learning, big data analytics, business intelligence, and now — LLM-powered agents.
        </p>
        <p>
          I've shipped projects across <span className="text-foreground">finance, healthcare, retail and supply chain</span> — from real-time stock prediction and clinical risk stratification, to Power BI dashboards, Spark/Kafka pipelines, and AI agents that turn doctor notes into patient-friendly summaries.
        </p>
        <p>
          Off the keyboard, you'll find me at the gym powerlifting or at gaming events. I believe balanced humans build better software.
        </p>
      </div>
    </div>
  </section>
);

// ================= FOOTER =================
const Footer = ({ profile }) => (
  <footer data-testid="site-footer" className="border-t border-border py-10 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-muted-foreground">
      <div>© {new Date().getFullYear()} {profile?.name} — Built with FastAPI + React.</div>
      <div className="flex items-center gap-4">
        <a href={profile?.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
        <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
        <a href={`mailto:${profile?.email}`} className="hover:text-foreground">Email</a>
      </div>
    </div>
  </footer>
);

// ================= HOME =================
const Home = () => {
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
        <div className="font-mono text-sm text-muted-foreground">Loading portfolio…</div>
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
      <Nav/>
      <Hero profile={profileData.profile}/>
      <Marquee/>
      <About profile={profileData.profile}/>
      <Projects roles={profileData.roles}/>
      <Skills skills={profileData.skills}/>
      <Experience experience={profileData.experience} education={profileData.education} certifications={profileData.certifications}/>
      <Contact profile={profileData.profile}/>
      <Footer profile={profileData.profile}/>
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
