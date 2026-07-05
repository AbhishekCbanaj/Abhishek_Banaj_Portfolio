import { useEffect, useMemo, useRef, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github, Linkedin, Mail, MapPin, ExternalLink, Star, GitFork,
  ArrowUpRight, Search, Download, Send, Sparkles, Code2,
  BrainCircuit, LineChart, Workflow, Globe2
} from "lucide-react";
import {
  useTheme, FadeIn, Magnet, AnimatedText,
  ContactButton, LiveProjectButton, ThemeToggle
} from "@/primitives.jsx";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ROLE_ICONS = {
  "ai-engineer": BrainCircuit,
  "data-scientist": Sparkles,
  "data-analyst": LineChart,
  "data-engineer": Workflow,
  "full-stack": Globe2,
};

const MARQUEE_GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const FEATURED_IMAGES = {
  hiremory: {
    col1a: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    col1b: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop",
    col2:  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop",
  },
  "nl-analytics": {
    col1a: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
    col1b: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&q=80&auto=format&fit=crop",
    col2:  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1400&q=80&auto=format&fit=crop",
  },
  "practo-analytics": {
    col1a: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&q=80&auto=format&fit=crop",
    col1b: "https://images.unsplash.com/photo-1642132652860-471b4228023e?w=1200&q=80&auto=format&fit=crop",
    col2:  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80&auto=format&fit=crop",
  },
};

const PRACTO_CARD = {
  id: "practo-analytics",
  name: "Practo Growth Analytics",
  category: "Business Analytics @ Practo",
  description: "LTV/CAC modeling, cohort retention, and Redshift query optimization for a healthtech platform serving 4M+ users.",
  html_url: "https://www.linkedin.com/in/abhishekbanaj/",
  homepage: "",
};

// ============= NAV =============
const Nav = ({ theme, toggle }) => {
  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <FadeIn as="nav" y={-20} className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 relative z-30" delay={0}>
      <a href="#top" data-testid="nav-logo" className="font-display font-bold text-lg text-[#D7E2EA] tracking-tight">
        AB<span className="text-[#B600A8]">.</span>
      </a>
      <div className="hidden md:flex items-center gap-8 lg:gap-12">
        {links.map((l) => (
          <a key={l.href} href={l.href} data-testid={`nav-${l.label.toLowerCase()}`}
             className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.2rem] hover:opacity-70">
            {l.label}
          </a>
        ))}
      </div>
      <ThemeToggle theme={theme} toggle={toggle}/>
    </FadeIn>
  );
};

// ============= HERO =============
const Hero = ({ profile, theme, toggle }) => (
  <section id="top" data-testid="hero-section"
           className="relative h-screen flex flex-col"
           style={{ overflowX: "clip" }}>
    <Nav theme={theme} toggle={toggle}/>
    <div className="flex-1 flex flex-col justify-between relative">
      <FadeIn delay={0.15} y={40} className="w-full overflow-hidden px-2 sm:px-4 md:px-6 mt-6 sm:mt-4 md:-mt-5">
        <h1 data-testid="hero-heading"
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center
                       text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
          Hi, i&apos;m Abhishek
        </h1>
      </FadeIn>

      <div className="absolute left-1/2 -translate-x-1/2 z-10
                      top-1/2 -translate-y-1/2
                      sm:top-auto sm:translate-y-0 sm:bottom-0
                      w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#B600A8]/40 to-transparent blur-3xl animate-glow"></div>
              <img data-testid="hero-portrait"
                   src={profile?.avatar_url}
                   alt="Abhishek Banaj"
                   className="relative rounded-full w-full aspect-square object-cover
                              border-4 border-[#D7E2EA]/10 shadow-2xl"/>
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 gap-4 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p data-testid="hero-tagline"
             className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
             style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}>
            a data scientist &amp; business analyst driven by turning complex data into decisions
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton testId="hero-contact-btn"/>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ============= MARQUEE =============
const Marquee = () => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const val = (window.scrollY - (window.scrollY + rect.top) + window.innerHeight) * 0.3;
      setOffset(val);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const row1 = MARQUEE_GIFS.slice(0, 11);
  const row2 = MARQUEE_GIFS.slice(11);
  const t1 = [...row1, ...row1, ...row1];
  const t2 = [...row2, ...row2, ...row2];
  return (
    <section ref={ref} data-testid="marquee-section" className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden" style={{ background: "#0C0C0C" }}>
      <div className="flex gap-3 mb-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: "transform" }}>
        {t1.map((src, i) => (
          <div key={`r1-${i}`} className="shrink-0 rounded-2xl overflow-hidden" style={{ width: 420, height: 270 }}>
            <img src={src} loading="lazy" alt="" className="w-full h-full object-cover"/>
          </div>
        ))}
      </div>
      <div className="flex gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: "transform" }}>
        {t2.map((src, i) => (
          <div key={`r2-${i}`} className="shrink-0 rounded-2xl overflow-hidden" style={{ width: 420, height: 270 }}>
            <img src={src} loading="lazy" alt="" className="w-full h-full object-cover"/>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============= ABOUT =============
const About = ({ profile }) => (
  <section id="about" data-testid="about-section" className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20">
    <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] animate-float-slow">
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-full pointer-events-none"/>
    </FadeIn>
    <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] animate-float-slow" style={{ animationDelay: "1s" }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-full pointer-events-none"/>
    </FadeIn>
    <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] animate-float-slow" style={{ animationDelay: "0.5s" }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-full pointer-events-none"/>
    </FadeIn>
    <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] animate-float-slow" style={{ animationDelay: "1.5s" }}>
      <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-full pointer-events-none"/>
    </FadeIn>
    <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
      <FadeIn delay={0} y={40}>
        <h2 data-testid="about-heading"
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          About me
        </h2>
      </FadeIn>
      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <AnimatedText
          text={profile?.summary || "Business Analyst @ Practo. Data Science graduate from REVA University. I ship end-to-end analytics that move the needle. Let's build something incredible together!"}
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[720px] mx-auto"
        />
        <FadeIn delay={0.2} y={20}>
          <ContactButton testId="about-contact-btn"/>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ============= SERVICES =============
const SERVICES = [
  { n: "01", name: "Business & Product Analytics", desc: "LTV, CAC, cohort retention, funnel & RCA — the exact stack I used at Practo to unlock 6–10% growth and pause ₹12L/month in fraudulent SEM spend." },
  { n: "02", name: "Machine Learning", desc: "Predictive models with Scikit-learn, XGBoost and LightGBM — deployed for clinical risk, equipment failure, and customer segmentation." },
  { n: "03", name: "AI Engineering / LLMs", desc: "LLM-powered agents, RAG pipelines, NL→SQL tools with LangChain + OpenAI — bring conversational analytics to your product." },
  { n: "04", name: "Data Engineering", desc: "SQL pipelines, Redshift optimization, Spark/Kafka streaming — battle-tested query tuning that cut a 4-minute report to 45 seconds." },
  { n: "05", name: "BI & Dashboards", desc: "Self-serve Power BI, Tableau and Excel dashboards — reduced ad-hoc reporting requests by 70% in month one at InLighn Tech." },
];
const Services = () => (
  <section id="services" data-testid="services-section"
    className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    style={{ background: "#FFFFFF", color: "#0C0C0C" }}>
    <FadeIn delay={0} y={40}>
      <h2 data-testid="services-heading"
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)", color: "#0C0C0C", lineHeight: 0.9 }}>
        What I do
      </h2>
    </FadeIn>
    <div className="max-w-5xl mx-auto">
      {SERVICES.map((s, i) => (
        <FadeIn key={s.n} delay={i * 0.1} y={30}>
          <div data-testid={`service-item-${s.n}`}
               className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8 sm:py-10 md:py-12"
               style={{ borderTop: i === 0 ? "1px solid rgba(12,12,12,0.15)" : "none", borderBottom: "1px solid rgba(12,12,12,0.15)" }}>
            <div className="font-black shrink-0" style={{ fontSize: "clamp(3rem, 10vw, 140px)", color: "#0C0C0C", lineHeight: 0.85 }}>{s.n}</div>
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)", color: "#0C0C0C" }}>{s.name}</div>
              <div className="font-light leading-relaxed max-w-2xl" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", color: "#0C0C0C", opacity: 0.6 }}>{s.desc}</div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ============= FEATURED PROJECTS (sticky stack) =============
const FeaturedProjects = ({ featured }) => {
  const cards = useMemo(() => {
    const list = featured && featured.length ? [...featured] : [];
    list.push(PRACTO_CARD);
    return list.slice(0, 3);
  }, [featured]);
  return (
    <section id="projects" data-testid="featured-projects-section"
             className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 pt-16 sm:pt-20 md:pt-24 pb-8 px-5 sm:px-8 md:px-10"
             style={{ background: "#0C0C0C" }}>
      <FadeIn delay={0} y={40}>
        <h2 data-testid="featured-heading"
            className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 md:mb-16"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Featured Work
        </h2>
      </FadeIn>
      <div>
        {cards.map((p, i) => (
          <FeaturedCard key={p.id || i} index={i} total={cards.length} project={p}/>
        ))}
      </div>
    </section>
  );
};
const FeaturedCard = ({ index, total, project }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "start start"] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const imgs = FEATURED_IMAGES[project.id] || FEATURED_IMAGES.hiremory;
  const category = project.category || (project.roles?.includes("ai-engineer") ? "AI Engineering" : "Client Work");
  return (
    <div ref={containerRef} className="h-[85vh]">
      <motion.div
        data-testid={`featured-card-${project.id}`}
        style={{ scale, top: `${index * 28 + 96}px`, background: "#0C0C0C" }}
        className="sticky rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="font-black shrink-0 hero-heading" style={{ fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 0.85 }}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60">{category}</div>
            <div className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>{project.name}</div>
            <div className="text-[#D7E2EA]/70 font-light max-w-2xl mt-1" style={{ fontSize: "clamp(0.85rem, 1.4vw, 1.1rem)" }}>{project.description}</div>
          </div>
          <div className="shrink-0 mt-2 md:mt-0">
            <LiveProjectButton href={project.homepage || project.html_url} testId={`featured-live-${project.id}`}/>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
            <img src={imgs.col1a} alt="" loading="lazy" className="w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" style={{ height: "clamp(130px, 16vw, 230px)" }}/>
            <img src={imgs.col1b} alt="" loading="lazy" className="w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" style={{ height: "clamp(160px, 22vw, 340px)" }}/>
          </div>
          <div className="col-span-3">
            <img src={imgs.col2} alt="" loading="lazy" className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" style={{ minHeight: "clamp(300px, 40vw, 580px)" }}/>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============= SKILLS =============
const Skills = ({ skills }) => (
  <section id="skills" data-testid="skills-section" className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10" style={{ background: "#0C0C0C" }}>
    <FadeIn delay={0} y={40}>
      <h2 data-testid="skills-heading" className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 md:mb-16" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>Toolkit</h2>
    </FadeIn>
    <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {skills?.map((group, gi) => (
        <FadeIn key={group.group} delay={gi * 0.05} y={30}>
          <div data-testid={`skill-group-${group.group.replace(/\s+/g, "-").toLowerCase()}`}
               className="glass-strong rounded-3xl p-6 h-full">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60 mb-5">{group.group}</div>
            <div className="space-y-3">
              {group.items.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1 text-[#D7E2EA]">
                    <span>{s.name}</span>
                    <span className="font-mono text-xs opacity-60">{s.level}%</span>
                  </div>
                  <div className="h-1.5 bg-[#D7E2EA]/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #B600A8 0%, #7621B0 60%, #BE4C00 100%)" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ============= EXPERIENCE =============
const Experience = ({ experience, education, certifications }) => (
  <section id="experience" data-testid="experience-section" className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10" style={{ background: "#0C0C0C" }}>
    <FadeIn delay={0} y={40}>
      <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-12 md:mb-16" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>Journey</h2>
    </FadeIn>
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60 mb-4 pl-2">Work</div>
        <div className="space-y-4">
          {experience?.map((e, i) => (
            <FadeIn key={i} delay={i * 0.08} y={30}>
              <div data-testid={`exp-item-${i}`} className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="font-mono text-xs text-[#D7E2EA]/60">{e.period} · {e.location}</div>
                  {e.current && <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#B600A8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse"></span> current
                  </span>}
                </div>
                <div className="font-display text-xl font-semibold text-[#D7E2EA]">{e.role}</div>
                <div className="font-mono text-sm mb-3" style={{ background: "linear-gradient(90deg, #B600A8, #BE4C00)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{e.company}</div>
                <ul className="space-y-2 text-sm text-[#D7E2EA]/80">
                  {e.bullets.map((b, bi) => (<li key={bi} className="flex gap-2"><span className="text-[#B600A8] shrink-0">→</span><span>{b}</span></li>))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60 mb-4 pl-2">Education</div>
        <div className="space-y-4">
          {education?.map((e, i) => (
            <FadeIn key={i} delay={i * 0.08} y={30}>
              <div data-testid={`edu-item-${i}`} className="glass rounded-3xl p-6">
                <div className="font-mono text-xs text-[#D7E2EA]/60 mb-2">{e.period} · GPA {e.gpa}</div>
                <div className="font-display text-xl font-semibold text-[#D7E2EA]">{e.degree}</div>
                <div className="font-mono text-sm mb-3" style={{ background: "linear-gradient(90deg, #B600A8, #BE4C00)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{e.school}</div>
                <div className="text-sm text-[#D7E2EA]/70">{e.notes}</div>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60 mt-8 mb-4 pl-2">Certifications</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications?.map((c, i) => (
            <FadeIn key={i} delay={i * 0.04} y={20}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" data-testid={`cert-item-${i}`} className="group glass rounded-2xl p-4 block hover:border-[#B600A8]/60">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#D7E2EA]/60">{c.date}</div>
                  <ExternalLink size={12} className="text-[#D7E2EA]/40 group-hover:text-[#B600A8]"/>
                </div>
                <div className="font-display font-semibold leading-tight text-[#D7E2EA] text-sm">{c.title}</div>
                <div className="text-xs text-[#D7E2EA]/60 mt-0.5">{c.issuer}</div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ============= ALL PROJECTS =============
const AllProjects = ({ roles }) => {
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
  const tabs = useMemo(() => ([{ id: "all", label: "All Projects" }, ...(roles || [])]), [roles]);
  return (
    <section id="all-projects" data-testid="all-projects-section" className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10" style={{ background: "#0C0C0C" }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-4" style={{ fontSize: "clamp(2.5rem, 10vw, 130px)" }}>More on GitHub</h2>
      </FadeIn>
      <p className="text-center text-[#D7E2EA]/60 font-light max-w-2xl mx-auto mb-10">Every repo auto-classified by the role it demonstrates. Filter or search below.</p>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = ROLE_ICONS[t.id] || Code2;
              const count = data.counts?.[t.id] ?? 0;
              const isActive = active === t.id;
              return (
                <button key={t.id} data-testid={`role-tab-${t.id}`} onClick={() => setActive(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border font-mono text-sm ${
                    isActive ? "bg-[#D7E2EA] text-[#0C0C0C] border-[#D7E2EA]" : "bg-transparent text-[#D7E2EA] border-[#D7E2EA]/20 hover:border-[#D7E2EA]/60"}`}>
                  <Icon size={14}/>{t.label}
                  <span className={`ml-1 text-xs ${isActive ? "opacity-70" : "opacity-50"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D7E2EA]/50"/>
            <input data-testid="projects-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…"
                   className="pl-9 pr-4 py-2.5 bg-transparent glass rounded-full text-sm font-mono min-w-[240px] focus:outline-none focus:border-[#B600A8] text-[#D7E2EA] placeholder-[#D7E2EA]/40"/>
          </div>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-56 animate-pulse"/>)}</div>
        ) : data.projects.length === 0 ? (
          <div data-testid="projects-empty" className="text-center py-16 text-[#D7E2EA]/60 font-mono">No projects match this filter.</div>
        ) : (
          <div data-testid="projects-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{data.projects.map((p) => <ProjectCard key={p.id} p={p}/>)}</div>
        )}
      </div>
    </section>
  );
};
const ProjectCard = ({ p }) => {
  const title = p.name.replace(/[-_]/g, " ");
  return (
    <a href={p.html_url} target="_blank" rel="noopener noreferrer" data-testid={`project-card-${p.id}`}
       className="group relative glass rounded-2xl p-5 hover:border-[#B600A8]/60 hover:-translate-y-1 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[#D7E2EA]/10 text-[#D7E2EA]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8]"></span>{p.language}
        </span>
        <ArrowUpRight size={18} className="text-[#D7E2EA]/40 group-hover:text-[#B600A8] group-hover:rotate-45 transition"/>
      </div>
      <h3 className="font-display font-semibold text-base leading-tight capitalize mb-2 text-[#D7E2EA]">{title}</h3>
      <p className="text-sm text-[#D7E2EA]/60 line-clamp-3 flex-1">{p.description || "A project by Abhishek Banaj — click to explore."}</p>
      <div className="mt-4 pt-4 border-t border-[#D7E2EA]/10 flex items-center gap-4 font-mono text-xs text-[#D7E2EA]/60">
        <span className="inline-flex items-center gap-1"><Star size={12}/>{p.stars}</span>
        <span className="inline-flex items-center gap-1"><GitFork size={12}/>{p.forks}</span>
        {p.homepage && <span className="inline-flex items-center gap-1 ml-auto text-[#B600A8]"><ExternalLink size={12}/> live</span>}
      </div>
    </a>
  );
};

// ============= CONTACT =============
const Contact = ({ profile }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all fields"); return; }
    setSending(true);
    try {
      const r = await axios.post(`${API}/contact`, form);
      if (r.data.email_sent) toast.success("Message sent — email delivered to Abhishek!");
      else toast.success("Message received! Abhishek will get back to you.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) { toast.error(err.response?.data?.detail || "Failed to send message"); }
    finally { setSending(false); }
  };
  return (
    <section id="contact" data-testid="contact-section" className="py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10" style={{ background: "#0C0C0C" }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-4" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>Let&apos;s Talk</h2>
      </FadeIn>
      <p className="text-center text-[#D7E2EA]/60 font-light max-w-2xl mx-auto mb-12">Recruiter, collaborator, or just curious? Send a message — it lands in my inbox within a minute.</p>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <a href={`mailto:${profile?.email}`} data-testid="contact-email" className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-[#B600A8]/60">
            <Mail className="text-[#B600A8]"/><div><div className="text-xs text-[#D7E2EA]/60 font-mono uppercase tracking-widest">Email</div><div className="text-[#D7E2EA]">{profile?.email}</div></div>
          </a>
          <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" data-testid="contact-linkedin" className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-[#B600A8]/60">
            <Linkedin className="text-[#B600A8]"/><div><div className="text-xs text-[#D7E2EA]/60 font-mono uppercase tracking-widest">LinkedIn</div><div className="text-[#D7E2EA]">/in/abhishekbanaj</div></div>
          </a>
          <a href={profile?.github} target="_blank" rel="noopener noreferrer" data-testid="contact-github" className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-[#B600A8]/60">
            <Github className="text-[#B600A8]"/><div><div className="text-xs text-[#D7E2EA]/60 font-mono uppercase tracking-widest">GitHub</div><div className="text-[#D7E2EA]">AbhishekCbanaj</div></div>
          </a>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <MapPin className="text-[#B600A8]"/><div><div className="text-xs text-[#D7E2EA]/60 font-mono uppercase tracking-widest">Location</div><div className="text-[#D7E2EA]">{profile?.location}</div></div>
          </div>
        </div>
        <form onSubmit={submit} data-testid="contact-form" className="lg:col-span-7 glass-strong rounded-3xl p-8 space-y-5">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60">Name</label>
            <input data-testid="contact-name-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                   className="w-full mt-2 bg-transparent border-b border-[#D7E2EA]/20 py-2 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8]"/>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60">Email</label>
            <input data-testid="contact-email-input" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                   className="w-full mt-2 bg-transparent border-b border-[#D7E2EA]/20 py-2 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8]"/>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/60">Message</label>
            <textarea data-testid="contact-message-input" rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                      className="w-full mt-2 bg-transparent border-b border-[#D7E2EA]/20 py-2 text-[#D7E2EA] focus:outline-none focus:border-[#B600A8] resize-none"/>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button data-testid="contact-submit" type="submit" disabled={sending}
                    className="contact-btn inline-flex items-center gap-2 rounded-full font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm disabled:opacity-50">
              {sending ? "Sending…" : "Send message"} <Send size={14}/>
            </button>
            <div className="flex gap-3 flex-wrap">
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" data-testid="contact-resume-download"
                   className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 text-xs sm:text-sm hover:bg-[#D7E2EA]/10">
                  <Download size={14}/> Resume PDF
                </a>
              )}
              {profile?.resume_drive_url && (
                <a href={profile.resume_drive_url} target="_blank" rel="noopener noreferrer" data-testid="contact-resume-drive"
                   className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/40 text-[#D7E2EA]/70 font-medium uppercase tracking-widest px-6 py-2.5 text-xs hover:border-[#D7E2EA]">
                  <ExternalLink size={12}/> All resumes (Drive)
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

// ============= FOOTER =============
const Footer = ({ profile }) => (
  <footer data-testid="site-footer" className="border-t border-[#D7E2EA]/10 py-10 px-6 lg:px-10" style={{ background: "#0C0C0C" }}>
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-[#D7E2EA]/50">
      <div>© {new Date().getFullYear()} {profile?.name} — Data · AI · Analytics</div>
      <div className="flex items-center gap-4">
        <a href={profile?.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#D7E2EA]">GitHub</a>
        <a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#D7E2EA]">LinkedIn</a>
        <a href={`mailto:${profile?.email}`} className="hover:text-[#D7E2EA]">Email</a>
        {profile?.resume_url && <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#D7E2EA]">Resume</a>}
      </div>
    </div>
  </footer>
);

// ============= HOME =============
const Home = () => {
  const [theme, toggleTheme] = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    document.title = "Abhishek Banaj — Data · AI · Analytics";
    axios.get(`${API}/profile`)
      .then((r) => setData(r.data))
      .catch((e) => { setError(e.message); toast.error("Failed to load profile"); })
      .finally(() => setLoading(false));
  }, []);
  if (loading) return (
    <div data-testid="loading-screen" className="min-h-screen flex items-center justify-center" style={{ background: "#0C0C0C" }}>
      <div className="font-mono text-sm text-[#D7E2EA]/60">Loading…</div>
    </div>
  );
  if (error || !data) return (
    <div data-testid="error-screen" className="min-h-screen flex items-center justify-center text-center px-6" style={{ background: "#0C0C0C" }}>
      <div>
        <div className="font-display text-2xl mb-3 text-[#D7E2EA]">Something broke.</div>
        <div className="text-[#D7E2EA]/60">{error}</div>
      </div>
    </div>
  );
  return (
    <div className="grain" style={{ overflowX: "clip" }}>
      <Hero profile={data.profile} theme={theme} toggle={toggleTheme}/>
      <Marquee/>
      <About profile={data.profile}/>
      <Services/>
      <FeaturedProjects featured={data.featured_projects}/>
      <Skills skills={data.skills}/>
      <Experience experience={data.experience} education={data.education} certifications={data.certifications}/>
      <AllProjects roles={data.roles}/>
      <Contact profile={data.profile}/>
      <Footer profile={data.profile}/>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton theme="dark"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
