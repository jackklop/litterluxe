import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  cream: "#FAF8F5",
  sage: "#8B9E7E",
  sageDark: "#6B7E5E",
  sageLight: "#C5D4BC",
  charcoal: "#2A2A28",
  warmGray: "#9C9890",
  gold: "#C4A265",
  white: "#FFFFFF",
  offWhite: "#F0EDE8",
};

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setIsVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
};

const useCountUp = (end, duration = 2000, startOnView = false) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const start = useCallback(() => setStarted(true), []);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return [count, start];
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const AnimatedText = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useInView(0.1);
  const isMobile = useIsMobile();
  // Cut delays and duration roughly in half on mobile for snappier reveal
  const effectiveDelay = isMobile ? delay * 0.4 : delay;
  const duration = isMobile ? "0.5s" : "0.9s";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(40px)",
        transition: `all ${duration} cubic-bezier(0.22, 1, 0.36, 1) ${effectiveDelay}s`,
      }}
    >
      {children}
    </div>
  );
};

const Particles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;
        const o = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,158,126,${o})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(196,162,101,${o * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - p.size * 2, p.y);
        ctx.lineTo(p.x + p.size * 2, p.y);
        ctx.moveTo(p.x, p.y - p.size * 2);
        ctx.lineTo(p.x, p.y + p.size * 2);
        ctx.stroke();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

const RobotSilhouette = () => (
  <svg
    viewBox="0 0 200 260"
    style={{ width: "100%", maxWidth: "220px", height: "auto", opacity: 0.06 }}
    fill={COLORS.charcoal}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="100" cy="240" rx="70" ry="18" />
    <rect x="40" y="140" width="120" height="100" rx="16" />
    <circle cx="100" cy="100" r="80" />
    <circle cx="100" cy="100" r="65" fill={COLORS.cream} />
    <ellipse cx="100" cy="105" rx="35" ry="28" fill={COLORS.charcoal} />
  </svg>
);

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`;

const GrainOverlay = ({ opacity = 0.3 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      pointerEvents: "none",
      backgroundImage: GRAIN,
    }}
  />
);

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const links = ["services", "pricing", "about", "faq", "contact"];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "16px 40px" : "28px 40px",
        background: scrolled ? "rgba(250,248,245,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(42,42,40,0.06)" : "none",
        transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        onClick={() => scrollTo("hero")}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "22px",
          fontWeight: 600,
          color: COLORS.charcoal,
          cursor: "pointer",
          letterSpacing: "-0.02em",
        }}
      >
        Litter<span style={{ color: COLORS.sage }}>Luxe</span>
      </div>
      <div
        className="nav-links"
        style={{ display: "flex", gap: "36px", alignItems: "center" }}
      >
        {links.map((l) => (
          <span
            key={l}
            onClick={() => scrollTo(l)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.charcoal,
              cursor: "pointer",
              opacity: 0.7,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
          >
            {l}
          </span>
        ))}
      </div>
      <button
        className="nav-cta"
        onClick={() => scrollTo("contact")}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: COLORS.cream,
          background: COLORS.charcoal,
          border: "none",
          padding: "12px 28px",
          borderRadius: "100px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.background = COLORS.sage)}
        onMouseLeave={(e) => (e.target.style.background = COLORS.charcoal)}
      >
        Join Waitlist
      </button>
    </nav>
  );
};

const Hero = () => {
  const [mp, setMp] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) =>
      setMp({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
        background: COLORS.cream,
      }}
    >
      <GrainOverlay opacity={0.35} />
      {[
        {
          w: 600,
          t: "5%",
          l: "-10%",
          c: COLORS.sageLight,
          o: "35",
          mx: 0.8,
          my: 0.8,
        },
        {
          w: 500,
          t: null,
          b: "0%",
          r: "-8%",
          c: COLORS.gold,
          o: "18",
          mx: -0.5,
          my: -0.5,
        },
        {
          w: 300,
          t: "40%",
          r: "20%",
          c: COLORS.sage,
          o: "12",
          mx: 0.3,
          my: -0.3,
        },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: orb.w,
            height: orb.w,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.c}${orb.o}, transparent 70%)`,
            top: orb.t,
            bottom: orb.b,
            left: orb.l,
            right: orb.r,
            transform: `translate(${mp.x * orb.mx}px, ${mp.y * orb.my}px)`,
            transition: "transform 0.4s ease-out",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
      <Particles />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "8%",
          zIndex: 0,
          transform: `translate(${mp.x * -0.2}px, ${mp.y * -0.2}px)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <RobotSilhouette />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <AnimatedText delay={0.1}>
          <div
            className="hero-subtitle"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <span
              style={{ width: "40px", height: "1px", background: COLORS.sage }}
            />
            Philadelphia's Premier Litter-Robot Cleaning
            <span
              style={{ width: "40px", height: "1px", background: COLORS.sage }}
            />
          </div>
        </AnimatedText>
        <AnimatedText delay={0.3}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              margin: "0 auto 24px",
            }}
          >
            We clean your
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              Litter-Robot
            </span>
          </h1>
        </AnimatedText>
        <AnimatedText delay={0.4}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              color: COLORS.charcoal,
              lineHeight: 1.5,
              maxWidth: "620px",
              margin: "0 auto 16px",
              letterSpacing: "-0.01em",
            }}
          >
            A cleaner throne for your majesty — so you don't have to scrub it
            yourself.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.5}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: COLORS.warmGray,
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 20px",
              fontWeight: 400,
            }}
          >
            Professional on-site deep cleaning for busy Philadelphia cat
            parents. Pet-safe enzyme treatment, no harsh chemicals, no hassle.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.6}>
          <div
            style={{
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: COLORS.gold,
              background: `${COLORS.gold}12`,
              padding: "10px 24px",
              borderRadius: "100px",
              marginBottom: "36px",
            }}
          >
            ✦ Launching May 2026
          </div>
        </AnimatedText>
        <AnimatedText delay={0.7}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: COLORS.cream,
                background: COLORS.charcoal,
                border: "none",
                padding: "18px 44px",
                borderRadius: "100px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = COLORS.sage;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 12px 40px ${COLORS.sage}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = COLORS.charcoal;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              View Pricing
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: COLORS.charcoal,
                background: "transparent",
                border: `1.5px solid ${COLORS.charcoal}25`,
                padding: "18px 44px",
                borderRadius: "100px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = COLORS.charcoal;
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = `${COLORS.charcoal}25`;
                e.target.style.transform = "translateY(0)";
              }}
            >
              How It Works
            </button>
          </div>
        </AnimatedText>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "float 3s ease-in-out infinite",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "1px",
            height: "40px",
            background: `linear-gradient(to bottom, transparent, ${COLORS.warmGray})`,
          }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        @keyframes float{0%,100%{transform:translateX(-50%) translateY(0);opacity:.5}50%{transform:translateX(-50%) translateY(10px);opacity:1}}
        @keyframes countPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${COLORS.cream}}
        ::selection{background:${COLORS.sageLight};color:${COLORS.charcoal}}
        @media(max-width:768px){
          nav{padding:14px 16px !important}
          .nav-links{display:none !important}
          .nav-cta{padding:10px 20px !important;font-size:12px !important}
          section{padding-left:20px !important;padding-right:20px !important}
          .about-grid{grid-template-columns:1fr !important;gap:40px !important}
          .pricing-grid{grid-template-columns:1fr !important}
          .stats-grid{grid-template-columns:1fr !important}
          .steps-grid{grid-template-columns:1fr !important}
          .footer-inner{flex-direction:column !important;text-align:center !important}
          .hero-subtitle{font-size:11px !important;flex-wrap:wrap !important}
          .hero-subtitle span:first-child,.hero-subtitle span:last-child{display:none !important}
        }
      `}</style>
    </section>
  );
};

const Stats = () => {
  const [ref, vis] = useInView(0.2);
  const [c1, s1] = useCountUp(4, 2000, true);
  const [c2, s2] = useCountUp(100, 2000, true);
  const [c3, s3] = useCountUp(60, 2000, true);
  useEffect(() => {
    if (vis) {
      s1();
      s2();
      s3();
    }
  }, [vis, s1, s2, s3]);
  const stats = [
    {
      value: `${c1}-Step`,
      label: "Deep clean process",
      icon: "🏠",
      desc: "On-site professional service — we bring everything, you just point us to the Litter-Robot",
    },
    {
      value: `${c2}%`,
      label: "Pet-safe products",
      icon: "🌿",
      desc: "Enzyme cleaners, no harsh chemicals, no essential oils — safe for cats and humans",
    },
    {
      value: `${c3}min`,
      label: "Average service time",
      icon: "🐾",
      desc: "We handle the disassembly, scrubbing, and reassembly so you can reclaim your weekend",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        padding: "100px 40px",
        background: COLORS.white,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GrainOverlay opacity={0.2} />
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}
      >
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Why LitterLuxe
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "64px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            The details{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              matter
            </span>
          </h2>
        </AnimatedText>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {stats.map((s, i) => (
            <AnimatedText key={i} delay={0.15 * i}>
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 32px",
                  borderRadius: "24px",
                  background: COLORS.cream,
                  border: `1px solid ${COLORS.charcoal}06`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 60px ${COLORS.charcoal}06`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>
                  {s.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "44px",
                    fontWeight: 500,
                    color: COLORS.charcoal,
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.sage,
                    marginBottom: "12px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: COLORS.warmGray,
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 🖼️ BEFORE / AFTER SECTION
// To add your images:
//   1. Drop files into your project's `public/` folder (e.g., `public/gasket-before.jpg`)
//   2. The paths below reference them as `/gasket-before.jpg`
// Recommended: shoot tight close-ups in natural light against a clean
// neutral background. Empty the unit first — the "before" story is
// grime and buildup, not waste. Same angle / same framing for before
// and after pairs.
// ═══════════════════════════════════════════════════════════════════
const BeforeAfterSlider = ({ before, after, label }) => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const handleUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [updatePos]);

  const handleDown = (e) => {
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updatePos(clientX);
  };

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
          background: COLORS.offWhite,
          boxShadow: `0 12px 48px ${COLORS.charcoal}10`,
        }}
      >
        {/* After image (full, background) */}
        <img
          src={after}
          alt={`${label} after cleaning`}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
        {/* Before image (clipped to left side) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pos}%`,
            overflow: "hidden",
          }}
        >
          <img
            src={before}
            alt={`${label} before cleaning`}
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${containerRef.current?.offsetWidth || 400}px`,
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Before / After labels */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            padding: "6px 14px",
            borderRadius: "100px",
            background: `${COLORS.charcoal}cc`,
            backdropFilter: "blur(8px)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: COLORS.cream,
            opacity: pos > 10 ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        >
          Before
        </div>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            padding: "6px 14px",
            borderRadius: "100px",
            background: `${COLORS.sage}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: COLORS.cream,
            opacity: pos < 90 ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
          }}
        >
          After
        </div>

        {/* Divider line + handle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: "2px",
            background: COLORS.cream,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            boxShadow: `0 0 12px ${COLORS.charcoal}40`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pos}%`,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: COLORS.cream,
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 20px ${COLORS.charcoal}30`,
            pointerEvents: "none",
            border: `2px solid ${COLORS.sage}`,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.sage}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline
              points="15 18 9 12 15 6"
              transform="translate(24 0) scale(-1 1)"
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: COLORS.sage,
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const BeforeAfter = () => {
  const pairs = [
    {
      label: "Gasket & Seal",
      before: "/gasket-before.jpg",
      after: "/gasket-after.jpg",
    },
    {
      label: "Waste Drawer",
      before: "/drawer-before.jpg",
      after: "/drawer-after.jpg",
    },
    {
      label: "Base & Sensors",
      before: "/base-before.jpg",
      after: "/base-after.jpg",
    },
  ];
  return (
    <section
      style={{
        padding: "120px 40px",
        background: COLORS.offWhite,
        position: "relative",
      }}
    >
      <GrainOverlay opacity={0.2} />
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
      >
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            The Difference
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            See it for{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              yourself
            </span>
          </h2>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: COLORS.warmGray,
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 64px",
              textAlign: "center",
            }}
          >
            Drag the slider to reveal what a real LitterLuxe deep clean looks
            like. No filters, no staging — just the work.
          </p>
        </AnimatedText>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {pairs.map((p, i) => (
            <AnimatedText key={i} delay={0.12 * i}>
              <BeforeAfterSlider
                before={p.before}
                after={p.after}
                label={p.label}
              />
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const steps = [
    {
      num: "01",
      title: "We Arrive",
      desc: "We come to your home with everything needed for a professional deep clean. No prep required on your end — just point us to the Litter-Robot.",
      icon: "🚗",
    },
    {
      num: "02",
      title: "We Deep Clean",
      desc: "We disassemble your Litter-Robot, apply enzyme cleaner to break down buildup, then scrub and wet vac the globe, drawer, base, sensors, and gaskets while the enzymes work.",
      icon: "🧼",
    },
    {
      num: "03",
      title: "We Restore",
      desc: "Your Litter-Robot is reassembled, tested, and finished with a pet-safe signature scent. Like it just came out of the box.",
      icon: "✨",
    },
    {
      num: "04",
      title: "You Relax",
      desc: "Your Litter-Robot is back in action with a pet-safe finishing scent and full photo documentation of the work. One less chore, forever.",
      icon: "☕",
    },
  ];
  return (
    <section
      id="services"
      style={{
        padding: "120px 40px",
        background: COLORS.cream,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
            }}
          >
            The Process
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "72px",
              lineHeight: 1.15,
            }}
          >
            Effortless from
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              start to finish
            </span>
          </h2>
        </AnimatedText>
        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((step, i) => (
            <AnimatedText key={i} delay={0.12 * i}>
              <div
                style={{
                  padding: "40px 32px",
                  borderRadius: "20px",
                  background: i === 3 ? COLORS.charcoal : COLORS.white,
                  border: i === 3 ? "none" : `1px solid ${COLORS.charcoal}06`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 20px 60px ${COLORS.charcoal}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "64px",
                    fontWeight: 400,
                    color: i === 3 ? `${COLORS.sage}25` : `${COLORS.sage}12`,
                    position: "absolute",
                    top: "12px",
                    right: "20px",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                {i === 3 && (
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: COLORS.charcoal,
                      background: COLORS.gold,
                      padding: "4px 12px",
                      borderRadius: "100px",
                      alignSelf: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    Monthly Exclusive
                  </div>
                )}
                <div style={{ fontSize: "32px", marginBottom: "20px" }}>
                  {step.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: COLORS.sage,
                    marginBottom: "12px",
                  }}
                >
                  Step {step.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "24px",
                    fontWeight: 500,
                    color: i === 3 ? COLORS.cream : COLORS.charcoal,
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: i === 3 ? `${COLORS.cream}70` : COLORS.warmGray,
                    lineHeight: 1.7,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const [ref] = useInView(0.2);
  // ═══════════════════════════════════════════════════════════════════
  // 🚨 PLACEHOLDER TESTIMONIALS — SWAP BEFORE LAUNCH
  // Replace these with real quotes + first names + neighborhoods
  // once you have your first clients. Offer your first 3 clients a
  // discount in exchange for a testimonial + before/after photos.
  // ═══════════════════════════════════════════════════════════════════
  const testimonials = [
    {
      quote:
        "I'd been putting off deep cleaning my Litter-Robot for almost a year. It looks brand new. My only regret is not booking sooner.",
      name: "Sarah M.",
      neighborhood: "Fishtown",
    },
    {
      quote:
        "Worth every penny. Pregnant and couldn't do it myself — they were on time, professional, and the unit came back smelling incredible.",
      name: "Jessica T.",
      neighborhood: "Graduate Hospital",
    },
    {
      quote:
        "Three cats, one Litter-Robot, and a gasket situation I didn't want to talk about. They took it all apart without judgment.",
      name: "Marcus R.",
      neighborhood: "Northern Liberties",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        padding: "100px 40px",
        background: COLORS.charcoal,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.sage}12, transparent 70%)`,
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      <GrainOverlay opacity={0.15} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            What Clients Say
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 500,
              color: COLORS.cream,
              letterSpacing: "-0.02em",
              marginBottom: "64px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Trusted by Philly{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              cat parents
            </span>
          </h2>
        </AnimatedText>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
          }}
        >
          {testimonials.map((t, i) => (
            <AnimatedText key={i} delay={0.15 * i}>
              <div
                style={{
                  padding: "40px 32px",
                  borderRadius: "20px",
                  background: `${COLORS.cream}08`,
                  border: `1px solid ${COLORS.cream}10`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.background = `${COLORS.cream}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = `${COLORS.cream}08`;
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "48px",
                    color: COLORS.sage,
                    lineHeight: 1,
                    marginBottom: "12px",
                    fontStyle: "italic",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: `${COLORS.cream}cc`,
                    lineHeight: 1.7,
                    marginBottom: "28px",
                    flex: 1,
                  }}
                >
                  {t.quote}
                </p>
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: COLORS.cream,
                      marginBottom: "4px",
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.sage,
                    }}
                  >
                    {t.neighborhood}
                  </div>
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const [hp, setHp] = useState(null);
  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "100",
      interval: "/ visit",
      desc: "Best value. On-site deep cleaning every month, priority scheduling, locked-in rate.",
      features: [
        "Full on-site deep clean",
        "Deep base, sensor & gasket cleaning",
        "New carbon filter included",
        "Exterior wipe down",
        "Mat vacuuming",
        "Freshness kit (waste liners + charcoal bag)",
        "Priority scheduling",
        "Locked-in rate guarantee",
      ],
      highlight: true,
      badge: "Best Value",
      note: "First visit is a Reset Clean ($150)",
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: "125",
      interval: "/ visit",
      desc: "On-site deep clean every 3 months. Great maintenance rhythm.",
      features: [
        "On-site globe & drawer deep clean",
        "Enzyme treatment with dwell time",
        "Wet vac extraction",
        "Deep base cleaning",
        "New carbon filter included",
        "Exterior wipe down",
        "Mat vacuuming",
      ],
      highlight: false,
    },
    {
      id: "reset",
      name: "Reset Clean",
      price: "150",
      interval: "one-time",
      desc: "Your first visit. Required for all new customers — intensive on-site restoration to start fresh.",
      features: [
        "Intensive on-site globe & drawer cleaning",
        "Extended enzyme soak & multiple passes",
        "Wet vac extraction",
        "Intensive base deep clean",
        "New carbon filter included",
        "Sensor & gasket detailing",
        "Exterior wipe down",
        "Mat vacuuming",
      ],
      highlight: false,
      badge: "First Visit",
    },
  ];
  return (
    <section
      id="pricing"
      style={{ padding: "120px 40px", background: COLORS.white }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Pricing
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
              textAlign: "center",
            }}
          >
            Simple, transparent{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              pricing
            </span>
          </h2>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "17px",
              color: COLORS.warmGray,
              textAlign: "center",
              maxWidth: "500px",
              margin: "0 auto 64px",
            }}
          >
            No hidden fees. No long-term contracts. Just a sparkling clean
            Litter-Robot.
          </p>
        </AnimatedText>
        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {plans.map((plan, i) => (
            <AnimatedText key={plan.id} delay={0.15 * i}>
              <div
                onMouseEnter={() => setHp(plan.id)}
                onMouseLeave={() => setHp(null)}
                style={{
                  padding: "44px 36px",
                  borderRadius: "24px",
                  background: plan.highlight ? COLORS.charcoal : COLORS.cream,
                  border: plan.highlight
                    ? "none"
                    : `1px solid ${COLORS.charcoal}06`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  transform:
                    hp === plan.id ? "translateY(-8px)" : "translateY(0)",
                  boxShadow:
                    hp === plan.id
                      ? plan.highlight
                        ? `0 24px 64px ${COLORS.charcoal}30`
                        : `0 20px 60px ${COLORS.charcoal}08`
                      : "none",
                  position: "relative",
                  cursor: "default",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "24px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: plan.highlight ? COLORS.charcoal : COLORS.sage,
                      background: plan.highlight
                        ? COLORS.gold
                        : `${COLORS.sage}15`,
                      padding: "6px 14px",
                      borderRadius: "100px",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: plan.highlight ? COLORS.sageLight : COLORS.sage,
                    marginBottom: "20px",
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "52px",
                      fontWeight: 500,
                      color: plan.highlight ? COLORS.cream : COLORS.charcoal,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      color: COLORS.warmGray,
                    }}
                  >
                    {plan.interval}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: plan.highlight
                      ? `${COLORS.cream}90`
                      : COLORS.warmGray,
                    lineHeight: 1.6,
                    marginBottom: plan.note ? "12px" : "32px",
                  }}
                >
                  {plan.desc}
                </p>
                {plan.note && (
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: COLORS.gold,
                      marginBottom: "32px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>✦</span> {plan.note}
                  </div>
                )}
                <div
                  style={{
                    borderTop: `1px solid ${plan.highlight ? `${COLORS.cream}12` : `${COLORS.charcoal}08`}`,
                    paddingTop: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {plan.features.map((f, j) => (
                    <div
                      key={j}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "14px",
                        color: plan.highlight
                          ? `${COLORS.cream}85`
                          : COLORS.charcoal,
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: plan.highlight
                            ? `${COLORS.sage}40`
                            : `${COLORS.sage}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: plan.highlight
                            ? COLORS.sageLight
                            : COLORS.sage,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    marginTop: "32px",
                    width: "100%",
                    padding: "16px",
                    borderRadius: "100px",
                    border: plan.highlight
                      ? "none"
                      : `1.5px solid ${COLORS.charcoal}15`,
                    background: plan.highlight ? COLORS.sage : "transparent",
                    color: plan.highlight ? COLORS.white : COLORS.charcoal,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.highlight) {
                      e.target.style.background = COLORS.sageDark;
                    } else {
                      e.target.style.background = COLORS.charcoal;
                      e.target.style.color = COLORS.cream;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlight) {
                      e.target.style.background = COLORS.sage;
                    } else {
                      e.target.style.background = "transparent";
                      e.target.style.color = COLORS.charcoal;
                    }
                  }}
                >
                  Get Started
                </button>
              </div>
            </AnimatedText>
          ))}
        </div>
        <AnimatedText delay={0.5}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: COLORS.warmGray,
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            <span style={{ color: COLORS.sage, fontWeight: 600 }}>
              Multiple units?
            </span>{" "}
            Each additional Litter-Robot at the same address is $25 off.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.6}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: COLORS.warmGray,
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            <span style={{ color: COLORS.gold, fontWeight: 600 }}>
              ✦ $5 from every service
            </span>{" "}
            is donated to ACCT Philly to support local rescue cats.
          </p>
        </AnimatedText>
      </div>
    </section>
  );
};

const About = () => (
  <section
    id="about"
    style={{ padding: "120px 40px", background: COLORS.cream }}
  >
    <div
      className="about-grid"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        alignItems: "center",
      }}
    >
      <div>
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
            }}
          >
            About
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 4vw, 44px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              lineHeight: 1.2,
            }}
          >
            Built by a cat parent
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              who gets it
            </span>
          </h2>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: COLORS.warmGray,
              lineHeight: 1.8,
              marginBottom: "20px",
            }}
          >
            I own multiple Litter-Robots. I love the technology. But the deep
            cleaning? Taking the whole thing apart, scrubbing dried litter out
            of every corner, dealing with the waste port buildup — that's where
            I drew the line.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.3}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: COLORS.warmGray,
              lineHeight: 1.8,
            }}
          >
            LitterLuxe was born out of that exact frustration. We use
            professional-grade enzyme cleaners, specialized wet/dry vacuums, and
            a meticulous multi-step process so your Litter-Robot gets a true
            studio-quality restoration — right in your home, every single
            visit.
          </p>
        </AnimatedText>
      </div>
      <AnimatedText delay={0.2}>
        <div
          style={{
            background: COLORS.white,
            borderRadius: "24px",
            padding: "48px 40px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "120px",
              color: `${COLORS.sage}15`,
              position: "absolute",
              top: "10px",
              left: "24px",
              lineHeight: 1,
            }}
          >
            "
          </div>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "20px",
              color: COLORS.charcoal,
              lineHeight: 1.7,
              fontStyle: "italic",
              position: "relative",
              zIndex: 1,
            }}
          >
            Every product we use is pet-safe, every cloth is eco-friendly, and
            every Litter-Robot leaves our hands looking and smelling like new.
          </p>
          <div
            style={{
              marginTop: "24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.sage,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            — LitterLuxe, Philadelphia
          </div>
        </div>
      </AnimatedText>
    </div>
  </section>
);

const FAQ = () => {
  const [oi, setOi] = useState(null);
  const faqs = [
    {
      q: "Which Litter-Robot models do you service?",
      a: "We currently service Litter-Robot 3 and Litter-Robot 4 models. More models and automatic litter boxes are coming soon — if you have a different model, reach out and request it. We're always expanding.",
    },
    {
      q: "How does the first visit work?",
      a: "Every new customer starts with a Reset Clean ($150). This is an intensive on-site deep clean that gets your unit back to baseline. After that, you can sign up for a Monthly ($100/visit) or Quarterly ($125/visit) plan to keep it that way.",
    },
    {
      q: "Do I need to be home during the cleaning?",
      a: "We prefer that you're home, but it's not required as long as we have access to your home. If we arrive and can't get in, the visit will still be charged in full.",
    },
    {
      q: "Are all your products safe for cats?",
      a: "Absolutely. We use enzyme-based cleaners with no harsh chemicals, eco-friendly Swedish dishcloths, and our finishing scent is a pet-safe, non-toxic formula free from essential oils, phthalates, and parabens.",
    },
    {
      q: "What if I haven't cleaned my Litter-Robot in over 6 months?",
      a: "No judgment — that's exactly why we exist. Heavily soiled units are booked as a Reset Clean ($150). We've seen it all and we'll get it looking great.",
    },
    {
      q: "What areas do you serve?",
      a: "We serve Philadelphia and the surrounding suburbs including the Main Line, Montgomery County, Delaware County, and parts of Bucks and Chester counties.",
    },
    {
      q: "I have multiple Litter-Robots. Do you offer a discount?",
      a: "Yes! Each additional unit at the same address is $25 off — so $75/visit for Monthly, $100/visit for Quarterly, or $125 for an additional Reset Clean. Since we're already at your home, it's a no-brainer.",
    },
    {
      q: "Are there any hidden fees or extra charges?",
      a: "Never. Your price covers everything — all cleaning products, the new carbon filter, and the pet-safe finishing scent. One flat price, no surprises.",
    },
    {
      q: "Can I cancel or pause my recurring service?",
      a: "Yes, anytime. No contracts, no cancellation fees. We just ask for at least one week's notice before your next scheduled visit. Cancellations with less than one week's notice may be charged in full.",
    },
    {
      q: "Can I upgrade from Quarterly to Monthly?",
      a: "Absolutely! You can upgrade at any time — just let us know and we'll adjust your next visit.",
    },
  ];
  return (
    <section
      id="faq"
      style={{ padding: "120px 40px", background: COLORS.white }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <AnimatedText>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: COLORS.sage,
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            FAQ
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 48px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "56px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Common{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              questions
            </span>
          </h2>
        </AnimatedText>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {faqs.map((faq, i) => (
            <AnimatedText key={i} delay={0.05 * i}>
              <div
                onClick={() => setOi(oi === i ? null : i)}
                style={{
                  background: COLORS.cream,
                  cursor: "pointer",
                  padding: "24px 32px",
                  borderRadius:
                    i === 0
                      ? "16px 16px 4px 4px"
                      : i === faqs.length - 1
                        ? "4px 4px 16px 16px"
                        : "4px",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: COLORS.charcoal,
                      flex: 1,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: COLORS.sage,
                      flexShrink: 0,
                      marginLeft: "16px",
                      transition:
                        "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                      transform: oi === i ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: oi === i ? "300px" : "0",
                    overflow: "hidden",
                    transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    opacity: oi === i ? 1 : 0,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "15px",
                      color: COLORS.warmGray,
                      lineHeight: 1.7,
                      paddingTop: "16px",
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  // ═══════════════════════════════════════════════════════════════════
  // 📅 TO ADD REAL BOOKING (recommended before scaling past ~10 clients):
  // Replace this form with a Calendly embed OR a tool like Cal.com /
  // SavvyCal. Drop the embed iframe inside the <div> that currently
  // wraps the <form>. Keep the form below as a fallback for people
  // who don't want to pick a time.
  // ═══════════════════════════════════════════════════════════════════
  <section
    id="contact"
    style={{
      padding: "120px 40px",
      background: COLORS.charcoal,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.sage}10, transparent 70%)`,
        top: "-20%",
        right: "-10%",
        pointerEvents: "none",
      }}
    />
    <GrainOverlay opacity={0.15} />
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      <AnimatedText>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: COLORS.sage,
            marginBottom: "20px",
          }}
        >
          Get Started
        </div>
      </AnimatedText>
      <AnimatedText delay={0.1}>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 500,
            color: COLORS.cream,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
            lineHeight: 1.15,
          }}
        >
          Ready for a{" "}
          <span style={{ fontStyle: "italic", color: COLORS.sage }}>
            fresh start?
          </span>
        </h2>
      </AnimatedText>
      <AnimatedText delay={0.2}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "17px",
            color: `${COLORS.cream}70`,
            lineHeight: 1.7,
            marginBottom: "16px",
          }}
        >
          Book your first Reset Clean or set up a recurring plan. Serving
          Philadelphia and the surrounding suburbs.
        </p>
      </AnimatedText>
      <AnimatedText delay={0.25}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: COLORS.gold,
            background: `${COLORS.gold}12`,
            padding: "10px 24px",
            borderRadius: "100px",
            marginBottom: "48px",
          }}
        >
          ✦ Launching May 2026 — Join the Waitlist
        </div>
      </AnimatedText>
      <AnimatedText delay={0.3}>
        <WaitlistForm />
      </AnimatedText>
    </div>
  </section>
);

const WaitlistForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/xlgoojwn", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: "20px",
          background: `${COLORS.sage}15`,
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>✓</div>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "24px",
            fontWeight: 500,
            color: COLORS.cream,
            marginBottom: "12px",
          }}
        >
          You're on the list!
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            color: `${COLORS.cream}60`,
            lineHeight: 1.6,
          }}
        >
          We'll reach out before our May 2026 launch to schedule your first
          clean.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "18px 24px",
    borderRadius: "14px",
    border: `1px solid ${COLORS.cream}15`,
    background: `${COLORS.cream}08`,
    color: COLORS.cream,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = `${COLORS.cream}15`)}
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = `${COLORS.cream}15`)}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = `${COLORS.cream}15`)}
        />
        <input
          name="address"
          type="text"
          placeholder="Address (city & zip)"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = `${COLORS.cream}15`)}
        />
        <input
          name="model"
          type="text"
          placeholder="Litter-Robot model (3, 4, or other)"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
          onBlur={(e) => (e.target.style.borderColor = `${COLORS.cream}15`)}
        />
        <select
          name="plan"
          style={{
            width: "100%",
            padding: "18px 24px",
            borderRadius: "14px",
            border: `1px solid ${COLORS.cream}15`,
            background: COLORS.charcoal,
            color: `${COLORS.cream}80`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            outline: "none",
            WebkitAppearance: "menulist",
            appearance: "menulist",
          }}
        >
          <option
            value=""
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Select a plan
          </option>
          <option
            value="Reset Clean — $150"
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Reset Clean — $150 (one-time, on-site)
          </option>
          <option
            value="Monthly — $100/visit (on-site)"
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Monthly — $100/visit (on-site)
          </option>
          <option
            value="Quarterly — $125/visit (on-site)"
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Quarterly — $125/visit (on-site clean)
          </option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "100px",
            border: "none",
            background: submitting ? COLORS.warmGray : COLORS.sage,
            color: COLORS.white,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.03em",
            cursor: submitting ? "wait" : "pointer",
            transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            marginTop: "8px",
            opacity: submitting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.target.style.background = COLORS.sageDark;
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 12px 40px ${COLORS.sage}40`;
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting) {
              e.target.style.background = COLORS.sage;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }
          }}
        >
          {submitting ? "Joining..." : "Join the Waitlist — Launching May 2026"}
        </button>
      </form>
    </div>
  );
};

const Footer = () => (
  <footer
    style={{
      padding: "48px 40px",
      background: COLORS.charcoal,
      borderTop: `1px solid ${COLORS.cream}08`,
    }}
  >
    <div
      className="footer-inner"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "20px",
          fontWeight: 600,
          color: COLORS.cream,
        }}
      >
        Litter<span style={{ color: COLORS.sage }}>Luxe</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: `${COLORS.cream}35`,
          }}
        >
          © 2026 LitterLuxe · Philadelphia, PA & surrounding suburbs ·
          hello@litterluxe.co
        </div>
        <span
          onClick={() =>
            document
              .getElementById("terms")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: `${COLORS.cream}30`,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = `${COLORS.cream}60`)}
          onMouseLeave={(e) => (e.target.style.color = `${COLORS.cream}30`)}
        >
          Terms of Service
        </span>
      </div>
    </div>
  </footer>
);

const Terms = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      id="terms"
      style={{
        padding: "60px 40px",
        background: COLORS.charcoal,
        borderTop: `1px solid ${COLORS.cream}06`,
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: `${COLORS.cream}40`,
            }}
          >
            Terms of Service
          </span>
          <span
            style={{
              fontSize: "18px",
              color: `${COLORS.cream}30`,
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: expanded ? "rotate(45deg)" : "rotate(0)",
            }}
          >
            +
          </span>
        </div>
        <div
          style={{
            maxHeight: expanded ? "3000px" : "0",
            overflow: "hidden",
            transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: `${COLORS.cream}45`,
              lineHeight: 1.9,
              paddingTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Service Scope
              </strong>
              <br />
              LitterLuxe provides professional cleaning services for
              Litter-Robot automatic litter boxes. Our service includes on-site
              deep cleaning using enzyme treatments and wet/dry extraction, base
              cleaning, exterior wipe down, mat vacuuming, and a pet-safe
              finishing scent. Service is limited to cleaning — we are not
              responsible for diagnosing or repairing mechanical or electrical
              issues with your unit.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Service Tiers
              </strong>
              <br />
              <em style={{ color: `${COLORS.cream}50` }}>
                Reset Clean ($150, required first visit):
              </em>{" "}
              Intensive on-site deep cleaning required for all new customers.
              Includes extended enzyme soak, multiple cleaning passes, and full
              base restoration.
              <br />
              <br />
              <em style={{ color: `${COLORS.cream}50` }}>
                Monthly Plan ($100/visit):
              </em>{" "}
              Full on-site deep cleaning every month, including globe, drawer,
              base, sensors, and gaskets. Cancel anytime with one week's notice.
              <br />
              <br />
              <em style={{ color: `${COLORS.cream}50` }}>
                Quarterly Plan ($125/visit):
              </em>{" "}
              On-site deep cleaning of your globe, drawer, and base using enzyme
              treatments and wet/dry extraction. Cancel anytime with one week's
              notice.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Scheduling & Access
              </strong>
              <br />
              We prefer that you are home during service, but it is not required
              as long as we have access to your home and the Litter-Robot. If we
              arrive at the scheduled time and are unable to access the unit,
              the visit will be charged in full.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Cancellation Policy
              </strong>
              <br />
              All recurring plans (Monthly and Quarterly) may be canceled
              anytime with at least one week's notice before your next scheduled
              visit. Cancellations with less than one week's notice may be
              charged in full. There are no cancellation fees.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Pricing & Payment
              </strong>
              <br />
              All prices are flat-rate with no hidden fees. Your quoted price
              covers the complete service including all cleaning products, a
              new carbon filter, and the pet-safe finishing scent. Payment is
              due at the time of service.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Products & Pet Safety
              </strong>
              <br />
              All cleaning products used by LitterLuxe are pet-safe, non-toxic,
              and free from harsh chemicals. Our finishing scent contains no
              essential oils, phthalates, parabens, or formaldehyde. While we
              take every precaution to use safe products, LitterLuxe is not
              liable for individual pet sensitivities or allergic reactions.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>Liability</strong>
              <br />
              LitterLuxe is not responsible for pre-existing damage, mechanical
              issues, or normal wear and tear to your Litter-Robot. Our service
              is performed with care, but by booking you acknowledge that minor
              cosmetic wear may be present on your unit prior to service.
            </p>

            <p
              style={{
                color: `${COLORS.cream}30`,
                fontSize: "12px",
                marginTop: "12px",
              }}
            >
              Last updated: April 2026 · By booking a service with LitterLuxe,
              you agree to these terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const StickyMobileCTA = () => {
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (roughly 500px) and hide at the very bottom (footer area)
      const scrolled = window.scrollY;
      const atBottom =
        window.innerHeight + scrolled >= document.body.offsetHeight - 400;
      setShow(scrolled > 500 && !atBottom);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (!isMobile) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: show ? 0 : -100,
        left: 0,
        right: 0,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
        background: "rgba(250,248,245,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${COLORS.charcoal}12`,
        zIndex: 999,
        transition: "bottom 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        boxShadow: show ? `0 -8px 32px ${COLORS.charcoal}10` : "none",
      }}
    >
      <button
        onClick={() =>
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          width: "100%",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: COLORS.cream,
          background: COLORS.charcoal,
          border: "none",
          padding: "16px",
          borderRadius: "100px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        Book Your Cleaning
        <span style={{ fontSize: "16px" }}>→</span>
      </button>
    </div>
  );
};

export default function LitterLuxe() {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        background: COLORS.cream,
        minHeight: "100vh",
        paddingBottom: isMobile ? "80px" : "0",
      }}
    >
      <Nav />
      <Hero />
      <Stats />
      {/* <BeforeAfter /> — hidden until matching before/after photos are ready */}
      <Services />
      <SocialProof />
      <Pricing />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <Terms />
      <StickyMobileCTA />
    </div>
  );
}
