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

// ============ PLACEHOLDERS — Replace these later ============
const PLACEHOLDERS = {
  founderPhoto: "/images/founder.jpg",
  globeBefore: "/images/globe-before.jpg",
  globeAfter: "/images/globe-after.jpg",
  baseBefore: "/images/base-before.jpg",
  baseAfter: "/images/base-after.jpg",
  processPhoto: "https://placehold.co/800x600/C5D4BC/2A2A28?text=Process+Photo",
  phoneNumber: "(856) 437-0045",
  email: "hello@litterluxe.co",
  instagram: "@litterluxe",
  reviewCount: 0, // will pull in real Google review count later
};

const SERVICE_ZIPS = [
  // Philadelphia core
  "19102",
  "19103",
  "19104",
  "19106",
  "19107",
  "19111",
  "19114",
  "19115",
  "19116",
  "19118",
  "19119",
  "19120",
  "19121",
  "19122",
  "19123",
  "19124",
  "19125",
  "19126",
  "19127",
  "19128",
  "19129",
  "19130",
  "19131",
  "19132",
  "19133",
  "19134",
  "19135",
  "19136",
  "19137",
  "19138",
  "19139",
  "19140",
  "19141",
  "19142",
  "19143",
  "19144",
  "19145",
  "19146",
  "19147",
  "19148",
  "19149",
  "19150",
  "19151",
  "19152",
  "19153",
  "19154",
  // Main Line / Montgomery
  "19010",
  "19035",
  "19041",
  "19066",
  "19072",
  "19085",
  "19087",
  "19096",
  "19004",
  "19038",
  "19046",
  "19075",
  "19083",
  "19082",
  "19422",
  "19428",
  "19462",
  "19444",
  "19401",
  "19403",
  "19405",
  "19406",
  "19426",
  "19460",
  "19481",
  // Delaware County
  "19013",
  "19018",
  "19023",
  "19026",
  "19033",
  "19036",
  "19050",
  "19061",
  "19063",
  "19064",
  "19078",
  "19079",
  "19081",
  "19086",
  "19094",
  // Bucks (lower)
  "18966",
  "18974",
  "18976",
  "19006",
  "19020",
  "19030",
  "19040",
  "19047",
  "19053",
  "19054",
  "19055",
  "19056",
  "19067",
  // Chester (eastern)
  "19301",
  "19312",
  "19317",
  "19319",
  "19333",
  "19341",
  "19355",
  "19380",
  "19382",
  "19355",
];

// ============ HOOKS ============
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

// const useCountUp = (end, duration = 2000, startOnView = false) => {
//   const [count, setCount] = useState(0);
//   const [started, setStarted] = useState(!startOnView);
//   const start = useCallback(() => setStarted(true), []);
//   useEffect(() => {
//     if (!started) return;
//     let startTime = null;
//     const step = (ts) => {
//       if (!startTime) startTime = ts;
//       const p = Math.min((ts - startTime) / duration, 1);
//       setCount(Math.floor(p * end));
//       if (p < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [started, end, duration]);
//   return [count, start];
// };

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

// ============ DECORATIVE ============
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

// ============ NAV ============
const Nav = ({ onBookClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  const links = ["results", "services", "pricing", "about", "faq"];

  return (
    <>
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
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <a
            href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
            className="nav-phone"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: COLORS.charcoal,
              textDecoration: "none",
              opacity: 0.8,
            }}
          >
            {PLACEHOLDERS.phoneNumber}
          </a>
          <button
            className="nav-cta"
            onClick={onBookClick}
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
            Book Now
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <span
              style={{
                width: "22px",
                height: "2px",
                background: COLORS.charcoal,
                transition: "all 0.3s",
                transform: mobileOpen
                  ? "translateY(7px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              style={{
                width: "22px",
                height: "2px",
                background: COLORS.charcoal,
                transition: "all 0.3s",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: "22px",
                height: "2px",
                background: COLORS.charcoal,
                transition: "all 0.3s",
                transform: mobileOpen
                  ? "translateY(-7px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: COLORS.cream,
          zIndex: 999,
          paddingTop: "80px",
          paddingBottom: "32px",
          transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: mobileOpen ? "0 20px 40px rgba(0,0,0,0.08)" : "none",
          display: "none",
          flexDirection: "column",
        }}
        className="mobile-menu"
      >
        {links.map((l) => (
          <span
            key={l}
            onClick={() => scrollTo(l)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: COLORS.charcoal,
              padding: "18px 24px",
              borderBottom: `1px solid ${COLORS.charcoal}08`,
              cursor: "pointer",
            }}
          >
            {l}
          </span>
        ))}
        <a
          href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: COLORS.sage,
            padding: "18px 24px",
            textDecoration: "none",
          }}
        >
          📞 {PLACEHOLDERS.phoneNumber}
        </a>
      </div>
    </>
  );
};

// ============ HERO ============
const Hero = ({ onBookClick }) => {
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
            A cleaner throne for your majesty
            <span
              style={{ width: "40px", height: "1px", background: COLORS.sage }}
            />
          </div>
        </AnimatedText>
        <AnimatedText delay={0.3}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(44px, 7.5vw, 88px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              margin: "0 auto 32px",
            }}
          >
            Professional Litter-Robot cleaning,
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              at your home in Philly.
            </span>
          </h1>
        </AnimatedText>
        <AnimatedText delay={0.5}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "19px",
              color: COLORS.warmGray,
              lineHeight: 1.6,
              maxWidth: "560px",
              margin: "0 auto 32px",
              fontWeight: 400,
            }}
          >
            Enzyme-deep cleaning with wet-vac extraction — pet-safe and fast. So
            you never scrub another globe.
          </p>
        </AnimatedText>

        {/* Trust microbar */}
        <AnimatedText delay={0.6}>
          <div
            style={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "36px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: COLORS.charcoal,
              opacity: 0.75,
            }}
          >
            <span>✓ Cancel anytime</span>
            <span>✓ Pet-safe products</span>
            <span>✓ No prep required</span>
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
              onClick={onBookClick}
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
              Book Your First Clean
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
              See How It Works
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
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:${COLORS.cream}}
        ::selection{background:${COLORS.sageLight};color:${COLORS.charcoal}}
        @media(max-width:900px){
          nav{padding:14px 16px !important}
          .nav-links{display:none !important}
          .nav-phone{display:none !important}
          .nav-cta{padding:10px 18px !important;font-size:11px !important}
          .mobile-menu-btn{display:flex !important}
          .mobile-menu{display:flex !important}
          .why-grid{grid-template-columns:repeat(2, 1fr) !important}
        }
        @media(max-width:768px){
          section{padding-left:20px !important;padding-right:20px !important}
          .about-grid{grid-template-columns:1fr !important;gap:40px !important}
          .pricing-grid{grid-template-columns:1fr !important}
          .stats-grid{grid-template-columns:1fr !important}
          .steps-grid{grid-template-columns:1fr !important}
          .ba-grid{grid-template-columns:1fr !important}
          .footer-inner{flex-direction:column !important;text-align:center !important}
          .hero-subtitle{font-size:11px !important;flex-wrap:wrap !important}
          .hero-subtitle span:first-child,.hero-subtitle span:last-child{display:none !important}
          .sticky-cta{display:flex !important}
        }
        @media(max-width:520px){
          .why-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </section>
  );
};

// ============ WHO IT'S FOR ============
const WhoFor = () => {
  const personas = [
    {
      icon: "🤰",
      title: "Pregnant cat parents",
      desc: "Toxoplasmosis from cat waste is a real risk during pregnancy. Step away from the litter box — we'll handle it.",
    },
    {
      icon: "👵",
      title: "Older adults",
      desc: "Disassembling, hauling, and scrubbing a Litter-Robot isn't easy on the back, knees, or wrists. Let us do the heavy lifting.",
    },
    {
      icon: "💼",
      title: "Busy professionals",
      desc: "You bought a self-cleaning litter box to reclaim your weekends. Don't trade them back for a deep-cleaning chore.",
    },
    {
      icon: "🏠",
      title: "Apartment dwellers",
      desc: "No yard, no garage, no hose. Deep cleaning a Litter-Robot in a city apartment is a nightmare. We bring the gear.",
    },
    {
      icon: "🐈‍⬛",
      title: "Multi-cat households",
      desc: "More cats means faster buildup and more odor. Regular professional service keeps things sanitary for everyone.",
    },
    {
      icon: "♿",
      title: "Limited mobility",
      desc: "If bending, lifting, or scrubbing is painful or unsafe, this is exactly the kind of task to outsource.",
    },
  ];
  return (
    <section
      style={{
        padding: "120px 40px",
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
            Who It's For
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            You shouldn't have to{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              do this yourself
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
              maxWidth: "560px",
              margin: "0 auto 64px",
              lineHeight: 1.6,
            }}
          >
            LitterLuxe was built for the people who need this most.
          </p>
        </AnimatedText>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {personas.map((p, i) => (
            <AnimatedText key={i} delay={0.08 * i}>
              <div
                style={{
                  padding: "32px 28px",
                  borderRadius: "20px",
                  background: COLORS.cream,
                  border: `1px solid ${COLORS.charcoal}06`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  height: "100%",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 16px 48px ${COLORS.charcoal}08`;
                  e.currentTarget.style.borderColor = `${COLORS.sage}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = `${COLORS.charcoal}06`;
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                  {p.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: COLORS.charcoal,
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: COLORS.warmGray,
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            </AnimatedText>
          ))}
        </div>
        <AnimatedText delay={0.6}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              color: COLORS.warmGray,
              textAlign: "center",
              marginTop: "48px",
              fontStyle: "italic",
            }}
          >
            …or honestly, anyone who'd rather not scrub another globe.
          </p>
        </AnimatedText>
      </div>
    </section>
  );
};

// ============ SERVICES (no globe swap) ============
const Services = () => {
  const steps = [
    {
      num: "01",
      title: "We Arrive",
      desc: "Fully equipped. No prep on your end.",
      icon: "🚗",
    },
    {
      num: "02",
      title: "Disassemble & Treat",
      desc: "Pet-safe enzyme cleaner breaks down buildup on every surface.",
      icon: "🧪",
    },
    {
      num: "03",
      title: "Scrub & Wet-Vac",
      desc: "Commercial extraction pulls out every trace of dust and clumped litter.",
      icon: "🧼",
    },
    {
      num: "04",
      title: "Reassemble & Restore",
      desc: "Tested, finished with a signature scent, and good as new.",
      icon: "✨",
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
              marginBottom: "16px",
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
        <AnimatedText delay={0.2}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "17px",
              color: COLORS.warmGray,
              maxWidth: "600px",
              marginBottom: "64px",
              lineHeight: 1.6,
            }}
          >
            Every visit. Same proven process. Done while you go about your day.
          </p>
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

// ============ WHY IT MATTERS (HEALTH) ============
const WhyMatters = () => {
  const reasons = [
    {
      tag: "For your cat",
      icon: "🐾",
      title: "Bacteria & UTIs",
      body: "Biofilm in sensors, gaskets, and waste ports harbors bacteria linked to urinary tract infections.",
    },
    {
      tag: "For your home",
      icon: "🏠",
      title: "Ammonia & odor",
      body: "Trapped urine releases ammonia. Deep extraction removes it at the source — no perfume-masking.",
    },
    {
      tag: "For you",
      icon: "💪",
      title: "Toxoplasmosis risk",
      body: "Cat waste is the primary toxoplasma source. A real concern during pregnancy or compromised health.",
    },
    {
      tag: "For your equipment",
      icon: "⚙️",
      title: "Sensors & lifespan",
      body: "Litter dust wrecks weight sensors over time. Regular cleaning extends the life of your $700+ unit.",
    },
  ];
  return (
    <section
      style={{
        padding: "120px 40px",
        background: COLORS.cream,
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
            Why It Matters
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            A clean Litter-Robot isn't a luxury.
            <br />
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              It's a health thing.
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
              maxWidth: "620px",
              margin: "0 auto 64px",
              lineHeight: 1.6,
            }}
          >
            The "self-cleaning" part removes waste. It doesn't sanitize. Here's
            what builds up when nobody deep cleans:
          </p>
        </AnimatedText>
        <div
          className="why-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {reasons.map((r, i) => (
            <AnimatedText key={i} delay={0.1 * i}>
              <div
                style={{
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background: COLORS.white,
                  border: `1px solid ${COLORS.charcoal}06`,
                  transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  height: "100%",
                  position: "relative",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 16px 48px ${COLORS.charcoal}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${COLORS.sage}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
                >
                  {r.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: COLORS.sage,
                    marginBottom: "10px",
                  }}
                >
                  {r.tag}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: COLORS.charcoal,
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: COLORS.warmGray,
                    lineHeight: 1.6,
                  }}
                >
                  {r.body}
                </p>
              </div>
            </AnimatedText>
          ))}
        </div>
        <AnimatedText delay={0.6}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: COLORS.warmGray,
              textAlign: "center",
              marginTop: "40px",
              fontStyle: "italic",
              maxWidth: "560px",
              margin: "40px auto 0",
              lineHeight: 1.6,
            }}
          >
            Most cat parents have never seen what's actually inside their unit
            after six months. We have. It's the reason we exist.
          </p>
        </AnimatedText>
      </div>
    </section>
  );
};

// ============ BEFORE / AFTER SLIDER ============
const BeforeAfterSlider = ({ before, after, caption, startPos = 50 }) => {
  const [pos, setPos] = useState(startPos);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const updatePos = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPos(next);
      if (!hasInteracted) setHasInteracted(true);
    },
    [hasInteracted],
  );

  // Pointer handlers (work for mouse + touch + pen)
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updatePos(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    updatePos(e.clientX);
  };
  const onPointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  // Click anywhere on the image to jump
  const onContainerClick = (e) => {
    if (e.target.dataset.handle) return; // don't double-fire on handle
    updatePos(e.clientX);
  };

  return (
    <div>
      <div
        ref={containerRef}
        onClick={onContainerClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "20px",
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "ew-resize",
          userSelect: "none",
          background: COLORS.charcoal,
          touchAction: "none",
        }}
      >
        {/* AFTER image (full, underneath) */}
        <img
          src={after}
          alt="After cleaning"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* BEFORE image (clipped to left side) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pos}%`,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <img
            src={before}
            alt="Before cleaning"
            draggable={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${100 / (pos / 100)}%`,
              minWidth: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Labels */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: COLORS.charcoal,
            color: COLORS.cream,
            padding: "5px 14px",
            borderRadius: "100px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            pointerEvents: "none",
            opacity: pos > 15 ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          Before
        </div>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: COLORS.sage,
            color: COLORS.white,
            padding: "5px 14px",
            borderRadius: "100px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            pointerEvents: "none",
            opacity: pos < 85 ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          After
        </div>

        {/* Drag handle (vertical line + circle) */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          data-handle="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: "44px",
            transform: "translateX(-50%)",
            cursor: dragging ? "grabbing" : "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "none",
          }}
        >
          {/* Vertical divider line */}
          <div
            data-handle="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "3px",
              background: COLORS.white,
              boxShadow: "0 0 12px rgba(0,0,0,0.4)",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />
          {/* Round handle */}
          <div
            data-handle="true"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: COLORS.white,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              transition: dragging ? "none" : "transform 0.2s",
              transform: dragging ? "scale(1.1)" : "scale(1)",
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: COLORS.charcoal,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ‹
            </span>
            <span
              style={{
                fontSize: "14px",
                color: COLORS.charcoal,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ›
            </span>
          </div>
        </div>

        {/* "Drag to reveal" hint - fades on first interaction */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(42,42,40,0.75)",
            color: COLORS.cream,
            padding: "6px 14px",
            borderRadius: "100px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.05em",
            opacity: hasInteracted ? 0 : 1,
            transition: "opacity 0.5s",
            pointerEvents: "none",
            backdropFilter: "blur(4px)",
          }}
        >
          ← Drag to reveal →
        </div>
      </div>

      <p
        style={{
          marginTop: "16px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: COLORS.warmGray,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {caption}
      </p>
    </div>
  );
};

const Results = () => {
  const pairs = [
    {
      before: PLACEHOLDERS.globeBefore,
      after: PLACEHOLDERS.globeAfter,
      caption: "The globe — what you see every day",
    },
    {
      before: PLACEHOLDERS.baseBefore,
      after: PLACEHOLDERS.baseAfter,
      caption: "The base — what's hiding underneath",
    },
  ];
  return (
    <section
      id="results"
      style={{
        padding: "120px 40px",
        background: COLORS.white,
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
              textAlign: "center",
            }}
          >
            Real Results
          </div>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 500,
              color: COLORS.charcoal,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
              textAlign: "center",
            }}
          >
            Drag to see the{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              difference
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
              maxWidth: "560px",
              margin: "0 auto 64px",
              lineHeight: 1.6,
            }}
          >
            What a real LitterLuxe deep clean looks like — inside and out.
          </p>
        </AnimatedText>
        <div
          className="ba-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
          }}
        >
          {pairs.map((p, i) => (
            <AnimatedText key={i} delay={0.15 * i}>
              <BeforeAfterSlider
                before={p.before}
                after={p.after}
                caption={p.caption}
                startPos={i === 0 ? 55 : 50}
              />
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ ZIP CHECK ============
const ZipCheck = ({ onBookClick }) => {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState(null);
  const check = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) {
      setResult({ ok: false, msg: "Please enter a valid 5-digit zip code." });
      return;
    }
    if (SERVICE_ZIPS.includes(cleaned)) {
      setResult({
        ok: true,
        msg: `Yes — we serve ${cleaned}. Let's get you booked.`,
      });
    } else {
      setResult({
        ok: false,
        msg: `We don't currently serve ${cleaned}, but reach out — we're expanding.`,
      });
    }
  };
  return (
    <section
      style={{
        padding: "80px 40px",
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
          background: `radial-gradient(circle, ${COLORS.sage}15, transparent 70%)`,
          top: "-30%",
          left: "-10%",
          pointerEvents: "none",
        }}
      />
      <GrainOverlay opacity={0.15} />
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <AnimatedText>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 3.5vw, 38px)",
              fontWeight: 500,
              color: COLORS.cream,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Before you book —{" "}
            <span style={{ fontStyle: "italic", color: COLORS.sage }}>
              do we serve you?
            </span>
          </h2>
        </AnimatedText>
        <AnimatedText delay={0.1}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              color: `${COLORS.cream}65`,
              marginBottom: "32px",
            }}
          >
            Philadelphia, the Main Line, Montgomery, Delaware, lower Bucks, and
            eastern Chester counties.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.2}>
          <form
            onSubmit={check}
            style={{
              display: "flex",
              gap: "12px",
              maxWidth: "440px",
              margin: "0 auto",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="Enter your zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              style={{
                flex: 1,
                minWidth: "180px",
                padding: "16px 20px",
                borderRadius: "100px",
                border: `1px solid ${COLORS.cream}25`,
                background: `${COLORS.cream}08`,
                color: COLORS.cream,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                outline: "none",
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "16px 32px",
                borderRadius: "100px",
                border: "none",
                background: COLORS.sage,
                color: COLORS.white,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = COLORS.sageDark)
              }
              onMouseLeave={(e) => (e.target.style.background = COLORS.sage)}
            >
              Check Zip
            </button>
          </form>
        </AnimatedText>
        {result && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px 24px",
              borderRadius: "16px",
              background: result.ok ? `${COLORS.sage}20` : `${COLORS.gold}15`,
              color: result.ok ? COLORS.sageLight : COLORS.gold,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              display: "inline-block",
            }}
          >
            {result.ok ? "✓ " : ""}
            {result.msg}
            {result.ok && (
              <button
                onClick={onBookClick}
                style={{
                  marginLeft: "12px",
                  padding: "6px 16px",
                  borderRadius: "100px",
                  border: "none",
                  background: COLORS.sage,
                  color: COLORS.white,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Book →
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// ============ PRICING (no globe swap) ============
const Pricing = ({ onBookClick }) => {
  const [hp, setHp] = useState(null);
  const plans = [
    {
      id: "reset",
      name: "Reset Clean",
      price: "150",
      interval: "one-time",
      desc: "Required first visit. Intensive on-site restoration to get your unit back to baseline.",
      features: [
        "Intensive globe & drawer cleaning",
        "Extended enzyme soak & multiple passes",
        "Wet-vac extraction",
        "Deep base cleaning",
        "New carbon filter included",
        "Sensor & gasket detailing",
        "Exterior wipe down & mat vacuuming",
      ],
      badge: "Start Here",
      step: "Step 1",
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: "125",
      interval: "/ visit",
      desc: "Deep clean every 3 months. The right rhythm for most cat parents.",
      features: [
        "Full on-site deep clean every 3 months",
        "Enzyme treatment with dwell time",
        "Wet-vac extraction",
        "New carbon filter included",
        "Exterior wipe down & mat vacuuming",
        "Cancel anytime",
      ],
      highlight: true,
      badge: "Most Popular",
      step: "Step 2 — Pick One",
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "100",
      interval: "/ visit",
      desc: "For multi-cat households or anyone who wants their unit consistently spotless.",
      features: [
        "Full on-site deep clean every month",
        "Enzyme treatment with dwell time",
        "Wet-vac extraction",
        "New carbon filter included",
        "Exterior wipe down & mat vacuuming",
        "Freshness kit (waste liners + charcoal bag)",
        "Priority scheduling",
        "Locked-in rate guarantee",
      ],
      step: "Step 2 — Pick One",
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
              maxWidth: "560px",
              margin: "0 auto 16px",
            }}
          >
            Every new customer starts with a Reset Clean, then picks a
            maintenance plan.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.3}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: COLORS.sage,
              textAlign: "center",
              marginBottom: "64px",
              fontWeight: 500,
            }}
          >
            Cancel anytime · Transparent flat-rate pricing · Pay as you go
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
                {plan.step && (
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: plan.highlight
                        ? COLORS.sageLight
                        : COLORS.warmGray,
                      marginBottom: "12px",
                      opacity: 0.8,
                    }}
                  >
                    {plan.step}
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
                  onClick={onBookClick}
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
                  Book This Plan
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

// ============ ABOUT (with founder photo placeholder) ============
const About = () => (
  <section
    id="about"
    style={{ padding: "120px 40px", background: COLORS.cream }}
  >
    <div
      className="about-grid"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        alignItems: "center",
      }}
    >
      <AnimatedText>
        <div
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            aspectRatio: "5 / 6",
            background: COLORS.sageLight,
            position: "relative",
          }}
        >
          <img
            src={PLACEHOLDERS.founderPhoto}
            alt="LitterLuxe founder"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </AnimatedText>
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
              marginBottom: "24px",
            }}
          >
            I own multiple Litter-Robots. I love the technology — but the deep
            cleaning was where I drew the line. LitterLuxe was born from that
            frustration: a deeper clean than you can do at home, pet-safe and
            effortless on your end.
          </p>
        </AnimatedText>
        <AnimatedText delay={0.3}>
          <div style={{ display: "none" }} />
        </AnimatedText>
        <AnimatedText delay={0.4}>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              paddingTop: "16px",
              borderTop: `1px solid ${COLORS.charcoal}10`,
            }}
          >
            {[
              { label: "Pet-safe products", icon: "🐾" },
              { label: "Cancel anytime", icon: "✓" },
              { label: "$5/clean to ACCT Philly", icon: "💚" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: COLORS.charcoal,
                }}
              >
                <span style={{ fontSize: "16px" }}>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </AnimatedText>
      </div>
    </div>
  </section>
);

// ============ FAQ (reordered) ============
const FAQ = () => {
  const [oi, setOi] = useState(null);
  const faqs = [
    {
      q: "What areas do you serve?",
      a: "Philadelphia and surrounding suburbs — Main Line, Montgomery, Delaware, lower Bucks, and eastern Chester counties. Use the zip checker above to confirm.",
    },
    {
      q: "Do I need to be home during the cleaning?",
      a: "Preferred, but not required as long as we have access. If we arrive and can't get in, the visit is charged in full.",
    },
    {
      q: "How do I know my home and cat are safe?",
      a: "We treat your home like our own. All products are pet-safe with no harsh chemicals, and we work carefully and quietly to avoid stressing your cat. References available on request.",
    },
    {
      q: "Do I need to do anything to prepare?",
      a: "Nothing. We bring all the equipment, products, and supplies. Just point us to the Litter-Robot — we'll handle the rest.",
    },
    {
      q: "Are all your products safe for cats?",
      a: "Yes. Enzyme-based cleaners, no harsh chemicals, no essential oils, parabens, or phthalates.",
    },
    {
      q: "Which Litter-Robot models do you service?",
      a: "Litter-Robot 3 and 4. More models coming — reach out if you have a different one.",
    },
    {
      q: "How does the first visit work?",
      a: "Every new customer starts with a Reset Clean ($150). After that, choose Monthly ($100/visit) or Quarterly ($125/visit) to maintain it.",
    },
    {
      q: "I have multiple Litter-Robots. Do you offer a discount?",
      a: "Yes — each additional unit at the same address is $25 off. We're already there, so it's a no-brainer.",
    },
    {
      q: "Can I cancel or pause my recurring service?",
      a: "Anytime. No cancellation fees. One week's notice before your next visit, please.",
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

// ============ BOOKING MODAL ============
const BookingModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    zip: "",
    phone: "",
    address: "",
    model: "",
    plan: "",
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const reset = () => {
    setStep(1);
    setSubmitted(false);
    setError(null);
    setData({
      name: "",
      email: "",
      zip: "",
      phone: "",
      address: "",
      model: "",
      plan: "",
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    try {
      const res = await fetch("https://formspree.io/f/xlgoojwn", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(
          "Something went wrong on our end. Please try again, or call us directly.",
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Looks like there's a connection issue. Please try again, or give us a call.",
      );
    }
    setSubmitting(false);
  };

  if (!open) return null;

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: `1px solid ${COLORS.charcoal}15`,
    background: COLORS.cream,
    color: COLORS.charcoal,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s",
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,42,40,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          animation: "slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            fontSize: "24px",
            color: COLORS.warmGray,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div
              style={{
                fontSize: "36px",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: `${COLORS.sage}20`,
                color: COLORS.sage,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "30px",
                fontWeight: 500,
                color: COLORS.charcoal,
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              Got it, {data.name?.split(" ")[0] || "there"}!
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: COLORS.warmGray,
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              Your booking request is in. Here's exactly what happens next:
            </p>

            {/* Numbered next steps */}
            <div
              style={{
                textAlign: "left",
                background: COLORS.cream,
                borderRadius: "16px",
                padding: "20px 24px",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {[
                {
                  n: "1",
                  title: "We text or call you within 24 hours",
                  body: `From ${PLACEHOLDERS.phoneNumber} — to confirm and pick a time that works.`,
                },
                {
                  n: "2",
                  title: "You pick a time",
                  body: "Most visits scheduled within 3–5 days of booking.",
                },
                {
                  n: "3",
                  title: "We come and clean",
                  body: "We bring everything. No prep on your end.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: COLORS.sage,
                      color: COLORS.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginTop: "1px",
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: COLORS.charcoal,
                        marginBottom: "2px",
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: COLORS.warmGray,
                        lineHeight: 1.5,
                      }}
                    >
                      {s.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: COLORS.warmGray,
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              Don't hear from us? Reach out directly at{" "}
              <a
                href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
                style={{
                  color: COLORS.sage,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {PLACEHOLDERS.phoneNumber}
              </a>{" "}
              or{" "}
              <a
                href={`mailto:${PLACEHOLDERS.email}`}
                style={{
                  color: COLORS.sage,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {PLACEHOLDERS.email}
              </a>
              .
            </p>

            <button
              onClick={handleClose}
              style={{
                padding: "14px 32px",
                borderRadius: "100px",
                border: "none",
                background: COLORS.charcoal,
                color: COLORS.cream,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = COLORS.sage)}
              onMouseLeave={(e) =>
                (e.target.style.background = COLORS.charcoal)
              }
            >
              Got it
            </button>
          </div>
        ) : (
          <>
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
              Step {step} of 2
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "28px",
                fontWeight: 500,
                color: COLORS.charcoal,
                marginBottom: "8px",
                lineHeight: 1.2,
              }}
            >
              {step === 1 ? "Let's get started" : "Almost done"}
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: COLORS.warmGray,
                marginBottom: "28px",
              }}
            >
              {step === 1
                ? "Just three quick fields — we'll handle the rest."
                : "A few more details so we can prepare for your visit."}
            </p>

            {/* Progress bar */}
            <div
              style={{
                height: "3px",
                background: `${COLORS.charcoal}10`,
                borderRadius: "100px",
                marginBottom: "28px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: step === 1 ? "50%" : "100%",
                  background: COLORS.sage,
                  borderRadius: "100px",
                  transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </div>

            {step === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = `${COLORS.charcoal}15`)
                  }
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = `${COLORS.charcoal}15`)
                  }
                />
                <input
                  name="zip"
                  type="text"
                  required
                  placeholder="Your zip code"
                  inputMode="numeric"
                  maxLength={5}
                  value={data.zip}
                  onChange={(e) => setData({ ...data, zip: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.sage)}
                  onBlur={(e) =>
                    (e.target.style.borderColor = `${COLORS.charcoal}15`)
                  }
                />
                <button
                  type="submit"
                  style={{
                    marginTop: "8px",
                    padding: "16px",
                    borderRadius: "100px",
                    border: "none",
                    background: COLORS.charcoal,
                    color: COLORS.cream,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = COLORS.sage)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = COLORS.charcoal)
                  }
                >
                  Continue →
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  style={inputStyle}
                />
                <input
                  name="address"
                  type="text"
                  placeholder="Full address (optional)"
                  value={data.address}
                  onChange={(e) =>
                    setData({ ...data, address: e.target.value })
                  }
                  style={inputStyle}
                />
                <select
                  name="model"
                  required
                  value={data.model}
                  onChange={(e) => setData({ ...data, model: e.target.value })}
                  style={{
                    ...inputStyle,
                    WebkitAppearance: "menulist",
                    appearance: "menulist",
                  }}
                >
                  <option value="">Litter-Robot model</option>
                  <option value="Litter-Robot 3">Litter-Robot 3</option>
                  <option value="Litter-Robot 4">Litter-Robot 4</option>
                  <option value="Other / Not sure">Other / Not sure</option>
                </select>
                <select
                  name="plan"
                  required
                  value={data.plan}
                  onChange={(e) => setData({ ...data, plan: e.target.value })}
                  style={{
                    ...inputStyle,
                    WebkitAppearance: "menulist",
                    appearance: "menulist",
                  }}
                >
                  <option value="">Choose a plan</option>
                  <option value="Reset Clean — $150">
                    Reset Clean — $150 (first visit)
                  </option>
                  <option value="Quarterly — $125/visit">
                    Quarterly — $125/visit (most popular)
                  </option>
                  <option value="Monthly — $100/visit">
                    Monthly — $100/visit
                  </option>
                  <option value="Not sure yet">
                    Not sure yet — help me decide
                  </option>
                </select>
                {error && (
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: `${COLORS.gold}15`,
                      border: `1px solid ${COLORS.gold}40`,
                      color: COLORS.charcoal,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      marginTop: "4px",
                    }}
                  >
                    {error}{" "}
                    <a
                      href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
                      style={{
                        color: COLORS.sage,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {PLACEHOLDERS.phoneNumber}
                    </a>
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: "0 0 auto",
                      padding: "16px 24px",
                      borderRadius: "100px",
                      border: `1.5px solid ${COLORS.charcoal}15`,
                      background: "transparent",
                      color: COLORS.charcoal,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: "16px",
                      borderRadius: "100px",
                      border: "none",
                      background: submitting ? COLORS.warmGray : COLORS.sage,
                      color: COLORS.white,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      cursor: submitting ? "wait" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting)
                        e.target.style.background = COLORS.sageDark;
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) e.target.style.background = COLORS.sage;
                    }}
                  >
                    {submitting ? "Booking..." : "Book My Clean"}
                  </button>
                </div>
              </form>
            )}

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: COLORS.warmGray,
                textAlign: "center",
                marginTop: "20px",
                lineHeight: 1.5,
              }}
            >
              We'll text or call within 24 hours to schedule. Your info stays
              with us — no spam, ever.
            </p>
          </>
        )}

        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        `}</style>
      </div>
    </div>
  );
};

// ============ FINAL CTA ============
const FinalCTA = ({ onBookClick }) => (
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
        maxWidth: "640px",
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
            fontSize: "clamp(36px, 5vw, 56px)",
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
            marginBottom: "40px",
          }}
        >
          Book your Reset Clean now. We'll be in touch within 24 hours to
          confirm a time.
        </p>
      </AnimatedText>
      <AnimatedText delay={0.3}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onBookClick}
            style={{
              padding: "18px 44px",
              borderRadius: "100px",
              border: "none",
              background: COLORS.sage,
              color: COLORS.white,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = COLORS.sageDark;
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 12px 40px ${COLORS.sage}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = COLORS.sage;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Book Now
          </button>
          <a
            href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
            style={{
              padding: "18px 44px",
              borderRadius: "100px",
              border: `1.5px solid ${COLORS.cream}25`,
              background: "transparent",
              color: COLORS.cream,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s",
            }}
          >
            📞 Call {PLACEHOLDERS.phoneNumber}
          </a>
        </div>
      </AnimatedText>
    </div>
  </section>
);

// ============ STICKY MOBILE CTA ============
const StickyMobileCTA = ({ onBookClick }) => (
  <div
    className="sticky-cta"
    style={{
      display: "none",
      position: "fixed",
      bottom: "16px",
      left: "16px",
      right: "16px",
      zIndex: 900,
      padding: "12px",
      borderRadius: "100px",
      background: COLORS.charcoal,
      boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
      gap: "8px",
      backdropFilter: "blur(10px)",
    }}
  >
    <button
      onClick={onBookClick}
      style={{
        flex: 1,
        padding: "14px",
        borderRadius: "100px",
        border: "none",
        background: COLORS.sage,
        color: COLORS.white,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Book Now
    </button>
    <a
      href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
      style={{
        padding: "14px 20px",
        borderRadius: "100px",
        background: `${COLORS.cream}15`,
        color: COLORS.cream,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      📞
    </a>
  </div>
);

// ============ FOOTER ============
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
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          color: `${COLORS.cream}45`,
        }}
      >
        <a
          href={`tel:${PLACEHOLDERS.phoneNumber.replace(/\D/g, "")}`}
          style={{ color: `${COLORS.cream}60`, textDecoration: "none" }}
        >
          {PLACEHOLDERS.phoneNumber}
        </a>
        <a
          href={`mailto:${PLACEHOLDERS.email}`}
          style={{ color: `${COLORS.cream}60`, textDecoration: "none" }}
        >
          {PLACEHOLDERS.email}
        </a>
        <span>© 2026 LitterLuxe · Philadelphia, PA</span>
      </div>
    </div>
  </footer>
);

// ============ MAIN ============
export default function LitterLuxe() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh" }}>
      <Nav onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <WhyMatters />
      <Results />
      <Services />
      <WhoFor />
      <About />
      <Pricing onBookClick={openBooking} />
      <ZipCheck onBookClick={openBooking} />
      <FAQ />
      <FinalCTA onBookClick={openBooking} />
      <Footer />
      <BookingModal open={bookingOpen} onClose={closeBooking} />
      <StickyMobileCTA onBookClick={openBooking} />
    </div>
  );
}
