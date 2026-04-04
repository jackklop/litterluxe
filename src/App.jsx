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

const AnimatedText = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(40px)",
        transition: `all 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
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
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
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
        <button
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
      </div>
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
              margin: "0 auto 32px",
            }}
          >
            A cleaner throne
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              for your majesty
            </span>
          </h1>
        </AnimatedText>
        <AnimatedText delay={0.5}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "18px",
              color: COLORS.warmGray,
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 20px",
              fontWeight: 400,
            }}
          >
            Professional deep cleaning for your Litter-Robot. We swap, sanitize,
            and restore — so you never have to scrub again.
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
      `}</style>
    </section>
  );
};

const Stats = () => {
  const [ref, vis] = useInView(0.2);
  const [c1, s1] = useCountUp(4, 1500, true);
  const [c2, s2] = useCountUp(100, 2000, true);
  useEffect(() => {
    if (vis) {
      s1();
      s2();
    }
  }, [vis, s1, s2]);
  const stats = [
    {
      value: `${c1}+ hrs`,
      label: "Studio restoration per globe",
      icon: "🧼",
      desc: "Every globe goes through a meticulous multi-hour deep clean",
    },
    {
      value: `${c2}%`,
      label: "Pet-safe products",
      icon: "🌿",
      desc: "Enzyme cleaners, no harsh chemicals, ever",
    },
    {
      value: "Philly+",
      label: "Service area",
      icon: "📍",
      desc: "Philadelphia & surrounding suburbs",
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

const Services = () => {
  const steps = [
    {
      num: "01",
      title: "We Arrive",
      desc: "We come to you with a fresh, sanitized globe and waste drawer — ready to swap. Minimal disruption, maximum clean.",
      icon: "🚗",
    },
    {
      num: "02",
      title: "We Swap & Clean",
      desc: "Dirty globe and drawer come out, freshly sanitized ones that meet our quality standards go in. We then deep clean the base, sensors, and surrounding area on-site.",
      icon: "🔄",
    },
    {
      num: "03",
      title: "We Restore",
      desc: "Your Litter-Robot is reassembled, tested, and finished with a pet-safe signature scent. Like it just came out of the box.",
      icon: "✨",
    },
    {
      num: "04",
      title: "We Refresh",
      desc: "Back at our studio, your old globe and drawer go through a 3–4 hour restoration — enzyme soaking, deep scrubbing, steam cleaning, and thorough drying before they're cleared for the next visit.",
      icon: "🧼",
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
                  background: COLORS.white,
                  border: `1px solid ${COLORS.charcoal}06`,
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
                    color: `${COLORS.sage}12`,
                    position: "absolute",
                    top: "12px",
                    right: "20px",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
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
                    color: COLORS.charcoal,
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: COLORS.warmGray,
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
  const [ref, vis] = useInView(0.2);
  const [count, startCount] = useCountUp(23, 2000, true);
  useEffect(() => {
    if (vis) startCount();
  }, [vis, startCount]);
  return (
    <section
      ref={ref}
      style={{
        padding: "80px 40px",
        background: COLORS.charcoal,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.sage}12, transparent 70%)`,
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      <GrainOverlay opacity={0.15} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatedText>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(56px, 8vw, 88px)",
              fontWeight: 500,
              color: COLORS.cream,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "12px",
            }}
          >
            {count}+
          </div>
        </AnimatedText>
        <AnimatedText delay={0.15}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: COLORS.sage,
              marginBottom: "12px",
            }}
          >
            Philly cat parents on the waitlist
          </div>
        </AnimatedText>
        <AnimatedText delay={0.25}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: `${COLORS.cream}50`,
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            Join them. Be first when we launch in May 2026.
          </p>
        </AnimatedText>
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
      desc: "Best value. Your Litter-Robot stays pristine year-round.",
      features: [
        "Full globe & drawer swap",
        "Deep base cleaning",
        "New carbon filter included",
        "Exterior wipe down",
        "Mat vacuuming",
        "Freshness kit (waste liners + charcoal bag)",
        "Priority scheduling",
        "Locked-in rate guarantee",
      ],
      highlight: true,
      badge: "Best Value",
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: "125",
      interval: "/ visit",
      desc: "Every 3 months. Great maintenance rhythm.",
      features: [
        "Full globe & drawer swap",
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
      desc: "First visit or haven't cleaned in 3+ months.",
      features: [
        "Full globe & drawer swap",
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
            No hidden fees. No contracts. Just a sparkling clean Litter-Robot.
          </p>
        </AnimatedText>
        <div
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
                    marginBottom: "32px",
                  }}
                >
                  {plan.desc}
                </p>
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
            I own a Litter-Robot. I love the technology. But the deep cleaning?
            Taking the whole thing apart, scrubbing dried litter out of every
            corner, dealing with the waste port buildup — that's where I drew
            the line.
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
            a globe-swap system designed for minimal disruption. Your cat never
            skips a beat.
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
      q: "Do I need to be home during the cleaning?",
      a: "We prefer that you're home, but it's not required as long as we have access to your home. If we arrive and can't get in, the visit will still be charged in full.",
    },
    {
      q: "Are all your products safe for cats?",
      a: "Absolutely. We use enzyme-based cleaners with no harsh chemicals, eco-friendly Swedish dishcloths, and our finishing scent is a pet-safe, non-toxic formula free from essential oils, phthalates, and parabens.",
    },
    {
      q: "What if I haven't cleaned my Litter-Robot in over 6 months?",
      a: "No judgment — that's exactly why we exist. Heavily soiled units are booked as a Reset Clean ($150). We've seen it all and we'll have it looking brand new.",
    },
    {
      q: "What areas do you serve?",
      a: "We serve Philadelphia and the surrounding suburbs including the Main Line, Montgomery County, Delaware County, and parts of Bucks and Chester counties.",
    },
    {
      q: "How does the globe swap work?",
      a: "We arrive with a pre-cleaned, sanitized globe and waste drawer. We swap your dirty ones with the clean set, then take the dirty ones back to our studio for a thorough deep clean. Your unit is never without a globe.",
    },
    {
      q: "What about the quality of the swap globe?",
      a: "Every globe we deliver is professionally cleaned and inspected for quality. If your globe shows significant wear, we'll replace it from our maintained inventory at no extra charge. You'll always receive a globe in great condition.",
    },
    {
      q: "I have multiple Litter-Robots. Do you offer a discount?",
      a: "Yes! Additional units at the same address are discounted since we're already there. Reach out and we'll set up a custom plan for your multi-robot household.",
    },
    {
      q: "Are there any hidden fees or extra charges?",
      a: "Never. Your price covers everything — the globe swap, deep cleaning, all products, the finishing scent, and the studio cleaning of your old globe. One flat price, no surprises.",
    },
    {
      q: "Can I cancel or pause my recurring service?",
      a: "Yes, anytime. No contracts, no cancellation fees. We just ask for at least one week's notice before your next scheduled visit. Cancellations with less than a week's notice may be charged in full.",
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
                    maxHeight: oi === i ? "200px" : "0",
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
            Reset Clean — $150
          </option>
          <option
            value="Monthly — $100/visit"
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Monthly — $100/visit
          </option>
          <option
            value="Quarterly — $125/visit"
            style={{ background: COLORS.charcoal, color: COLORS.cream }}
          >
            Quarterly — $125/visit
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
            maxHeight: expanded ? "2000px" : "0",
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
              base cleaning, globe and waste drawer swapping, exterior wipe
              down, mat vacuuming, and a pet-safe finishing scent. Service is
              limited to cleaning — we are not responsible for diagnosing or
              repairing mechanical or electrical issues with your unit.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Globe Swap & Quality
              </strong>
              <br />
              All swap globes and waste drawers are LitterLuxe maintained
              inventory. Each globe is professionally cleaned, inspected, and
              must meet our quality standards before being delivered. We
              guarantee globe quality for 48 hours after service. If you
              experience any issues within this window, contact us and we'll
              make it right at no charge. Beyond 48 hours, normal wear and tear
              from regular use is the responsibility of the customer.
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
              You may cancel or pause your recurring service at any time. We ask
              for at least one week's notice before your next scheduled visit.
              Cancellations with less than one week's notice may be charged in
              full.
            </p>

            <p>
              <strong style={{ color: `${COLORS.cream}60` }}>
                Pricing & Payment
              </strong>
              <br />
              All prices are flat-rate with no hidden fees. Your quoted price
              covers the complete service including all cleaning products, globe
              swap, and studio restoration. Payment is due at the time of
              service.
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

export default function LitterLuxe() {
  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <SocialProof />
      <Pricing />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <Terms />
    </div>
  );
}
