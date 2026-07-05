import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") html.classList.add("light");
    else html.classList.remove("light");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return [theme, () => setTheme(t => t === "dark" ? "light" : "dark")];
};

export const FadeIn = ({ children, delay = 0, duration = 0.7, y = 30, x = 0, className = "", as = "div", style }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Comp>
  );
};

export const Magnet = ({ children, padding = 150, strength = 3, className = "" }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < rect.width / 2 + padding) {
        setActive(true);
        setPos({ x: dx / strength, y: dy / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [padding, strength]);
  return (
    <div ref={ref}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? "transform 0.3s ease-out" : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
      className={className}>
      {children}
    </div>
  );
};

const Char = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span style={{ opacity: 0.18 }}>{children}</span>
      <motion.span style={{ opacity, position: "absolute", left: 0, top: 0 }}>{children}</motion.span>
    </span>
  );
};
export const AnimatedText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} className={className} style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}>
      {chars.map((c, i) => (
        <Char key={i} progress={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]}>{c}</Char>
      ))}
    </p>
  );
};

export const ContactButton = ({ href = "#contact", label = "Contact Me", testId = "contact-btn" }) => (
  <a href={href} data-testid={testId}
     className="contact-btn inline-flex items-center rounded-full font-medium uppercase tracking-widest
                px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base">
    {label}
  </a>
);

export const LiveProjectButton = ({ href, label = "Live Project", testId }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" data-testid={testId}
     className="inline-flex items-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA]
                font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm
                hover:bg-[#D7E2EA]/10">
    {label}
  </a>
);

export const ThemeToggle = ({ theme, toggle }) => (
  <button onClick={toggle} data-testid="theme-toggle" aria-label="Toggle theme"
    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D7E2EA]/30
               text-[#D7E2EA] hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/10">
    {theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>}
  </button>
);
