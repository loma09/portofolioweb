import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_4xno1ig";
const EMAILJS_TEMPLATE_ID = "template_soff31y";
const EMAILJS_PUBLIC_KEY = "lMOX0_atzJYRfoyFp";

function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useReveal();
  const transforms = {
    up: "translateY(40px)", down: "translateY(-40px)",
    left: "translateX(-40px)", right: "translateX(40px)", none: "scale(0.95)",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: "opacity, transform",
    }}>
      {children}
    </div>
  );
}

// ── CountUp ───────────────────────────────────────────────────────────
function CountUp({ value, duration = 1400 }) {
  const [ref, visible] = useReveal();
  const [display, setDisplay] = useState("0");
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const str = String(value);
    const m = str.match(/^([\d.]+)(\+?)$/);
    if (!m) { setDisplay(value); return; }
    const end = parseFloat(m[1]);
    const suffix = m[2] || "";
    const dec = m[1].includes(".") ? m[1].split(".")[1].length : 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(parseFloat((end * ease).toFixed(dec)) + suffix);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [visible]);
  return <span ref={ref}>{display}</span>;
}

const NAV_LINKS = ["Home", "Skills", "Projects", "Game", "Contact"];

const SKILLS = [
  { name: "Laravel", accent: "#FF6B6B", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
  { name: "React.js", accent: "#61DAFB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", accent: "#e5e5e5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Python", accent: "#4B8BBE", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "SQL", accent: "#F29111", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Tailwind CSS", accent: "#38BDF8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
];

const PROJECTS = [
  {
    title: "Flutter Ludo Fun",
    description: "Cross-platform classic Ludo board game built with Flutter & Dart. Runs on Android with smooth animations and engaging multiplayer gameplay.",
    tags: ["Flutter", "Dart"],
    mockupBg: "#0a2e1a", accentBar: "#A8FF78",
    lang: "Dart / Flutter", langColor: "#61DAFB",
    link: "https://github.com/loma09/Flutter-Ludo-Fun",
  },
  {
    title: "Laundry App",
    description: "Full-stack laundry management system built with Laravel & Tailwind CSS. Handles customer transactions, order tracking, and operational workflows with a clean Blade-powered UI.",
    tags: ["Laravel", "Tailwind CSS", "SQL"],
    mockupBg: "#1a0a2e", accentBar: "#FF6B6B",
    lang: "PHP / Blade", langColor: "#FF6B6B",
    link: "https://github.com/loma09/laundry-app",
  },
  {
    title: "Credit Risk Prediction",
    description: "ML pipeline on 466K+ LendingClub records. Trained Logistic Regression & Random Forest models — Random Forest achieved 91.2% ROC-AUC and 85.4% accuracy for predicting loan default risk.",
    tags: ["Python", "SQL"],
    mockupBg: "#0a1a2e", accentBar: "#4B8BBE",
    lang: "Python / Jupyter", langColor: "#F4DF4E",
    link: "https://github.com/loma09/credit-risk-prediction",
  },
  {
    title: "Promptlab",
    description: "A prompt engineering lab built with JavaScript for experimenting and testing AI prompts efficiently.",
    tags: ["JavaScript"],
    mockupBg: "#1a1a0a", accentBar: "#F4DF4E",
    lang: "JavaScript", langColor: "#F4DF4E",
    link: "https://github.com/loma09/promptlab",
  },
  {
    title: "Microquest",
    description: "A web development learning platform where users complete coding challenges and get instant feedback from AI as the judge. Built to help beginners practice HTML, CSS, and JavaScript through guided micro-tasks.",
    tags: ["JavaScript"],
    mockupBg: "#0a0a2e", accentBar: "#61DAFB",
    lang: "JavaScript", langColor: "#61DAFB",
    link: "https://github.com/loma09/microquest",
  },
  {
    title: "PanganTrace AI",
    description: "Intelligent food supply chain monitoring & fraud detection platform powered by Azure AI. Detects subsidy leakage and price manipulation across Indonesia's national food distribution network.",
    tags: ["Next.js", "Python", "Laravel"],
    mockupBg: "#0a1a0a", accentBar: "#A8FF78",
    lang: "Next.js / FastAPI", langColor: "#38BDF8",
    link: "https://github.com/loma09/pangantrace-ai",
  },
];

const TAG_COLORS = {
  Laravel: "#FF6B6B", React: "#61DAFB", "Next.js": "#e5e5e5",
  Python: "#4B8BBE", SQL: "#F29111", "Tailwind CSS": "#38BDF8",
  Flutter: "#54C5F8", Dart: "#00B4AB",
};

const THEMES = {
  light: {
    body: "#F4DF4E", card: "#ffffff", border: "#000000", text: "#000000",
    textMuted: "#444444", navBg: "#F4DF4E", skillsBg: "#000000",
    skillsText: "#ffffff", projectsBg: "#F4DF4E", contactBg: "#FF6B6B",
    gameBg: "#000000",
    footerBg: "#000000", footerText: "#F4DF4E",
    shadow: "rgba(0,0,0,1)", shadowHero: "rgba(255,107,107,1)",
    shadowYellow: "rgba(244,223,78,1)", inputBg: "#F4DF4E",
    toggleBg: "#000000", toggleText: "#F4DF4E",
  },
  dark: {
    body: "#111111", card: "#1e1a14", border: "#c9a84c", text: "#e8dfc0",
    textMuted: "#a89878", navBg: "#111111", skillsBg: "#0a0a08",
    skillsText: "#e8dfc0", projectsBg: "#161410", contactBg: "#1a1208",
    gameBg: "#0a0a08",
    footerBg: "#0a0a08", footerText: "#e8dfc0",
    shadow: "rgba(201,168,76,0.7)", shadowHero: "rgba(201,168,76,0.5)",
    shadowYellow: "rgba(201,168,76,0.6)", inputBg: "#2a2418",
    toggleBg: "#c9a84c", toggleText: "#000000",
  },
};

// ── Snake Game ────────────────────────────────────────────────────────
const INIT_SNAKE = [{ x: 10, y: 10 }];
const INIT_DIR = { x: 1, y: 0 };

function getGameDimensions() {
  const mobile = window.innerWidth < 640;
  return {
    CELL: mobile ? 14 : 24,
    COLS: mobile ? 22 : 28,
    ROWS: mobile ? 22 : 24,
  };
}

function randomFood(snake, COLS, ROWS) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function SnakeGame({ t }) {
  const [dims, setDims] = useState(getGameDimensions);
  const { CELL, COLS, ROWS } = dims;

  useEffect(() => {
    const handleResize = () => setDims(getGameDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bonusActive, setBonusActive] = useState(false);
  const snake = useRef(INIT_SNAKE);
  const dir = useRef(INIT_DIR);
  const nextDir = useRef(INIT_DIR);
  const food = useRef({ x: 15, y: 10 });
  const gameLoop = useRef(null);
  const bonusFood = useRef(null);
  const bonusTimer = useRef(null);
  const scoreRef = useRef(0);

  const playSound = useCallback((type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "eat") {
        osc.type = "square";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "die") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "move") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      }
      osc.onended = () => ctx.close();
    } catch (e) { }
  }, []);

  const spawnBonus = useCallback(() => {
    if (bonusFood.current) return;
    bonusFood.current = randomFood([...snake.current, food.current], COLS, ROWS);
    setBonusActive(true);
    bonusTimer.current = setTimeout(() => {
      bonusFood.current = null;
      setBonusActive(false);
    }, 5000);
  }, [COLS, ROWS]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, ROWS * CELL); ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(COLS * CELL, j * CELL); ctx.stroke();
    }
    ctx.fillStyle = "#FF6B6B";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillRect(food.current.x * CELL + 2, food.current.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.strokeRect(food.current.x * CELL + 2, food.current.y * CELL + 2, CELL - 4, CELL - 4);
    if (bonusFood.current) {
      ctx.fillStyle = "#FFD700";
      ctx.strokeStyle = "#FF6B6B";
      ctx.lineWidth = 3;
      ctx.fillRect(bonusFood.current.x * CELL, bonusFood.current.y * CELL, CELL, CELL);
      ctx.strokeRect(bonusFood.current.x * CELL, bonusFood.current.y * CELL, CELL, CELL);
      ctx.fillStyle = "#000";
      ctx.font = `bold ${CELL - 6}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", bonusFood.current.x * CELL + CELL / 2, bonusFood.current.y * CELL + CELL / 2);
    }
    snake.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#F4DF4E" : "#A8FF78";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.strokeRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [CELL, COLS, ROWS]);

  const tick = useCallback(() => {
    dir.current = nextDir.current;
    const head = {
      x: (snake.current[0].x + dir.current.x + COLS) % COLS,
      y: (snake.current[0].y + dir.current.y + ROWS) % ROWS,
    };
    if (snake.current.some(s => s.x === head.x && s.y === head.y)) {
      setStatus("dead");
      setHighScore(prev => Math.max(prev, scoreRef.current));
      clearInterval(gameLoop.current);
      playSound("die");
      return;
    }
    const ate = head.x === food.current.x && head.y === food.current.y;
    const ateBonus = bonusFood.current && head.x === bonusFood.current.x && head.y === bonusFood.current.y;
    const newSnake = [head, ...snake.current];
    if (!ate && !ateBonus) {
      newSnake.pop();
      playSound("move");
    } else {
      if (ate) {
        food.current = randomFood(newSnake, COLS, ROWS);
        scoreRef.current += 10;
        setScore(scoreRef.current);
        if (scoreRef.current % 30 === 0) spawnBonus();
        playSound("eat");
      }
      if (ateBonus) {
        bonusFood.current = null;
        setBonusActive(false);
        clearTimeout(bonusTimer.current);
        scoreRef.current += 50;
        setScore(scoreRef.current);
        playSound("eat");
      }
    }
    snake.current = newSnake;
    draw();
  }, [draw, spawnBonus, playSound, COLS, ROWS]);

  const startGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    food.current = randomFood(snake.current, COLS, ROWS);
    bonusFood.current = null;
    setBonusActive(false);
    clearTimeout(bonusTimer.current);
    scoreRef.current = 0;
    setScore(0);
    setStatus("playing");
    clearInterval(gameLoop.current);
    gameLoop.current = setInterval(tick, 120);
    draw();
  }, [tick, draw, COLS, ROWS]);

  const togglePause = useCallback(() => {
    if (status === "playing") {
      clearInterval(gameLoop.current);
      setStatus("paused");
    } else if (status === "paused") {
      gameLoop.current = setInterval(tick, 120);
      setStatus("playing");
    }
  }, [status, tick]);

  useEffect(() => {
    draw();
    return () => clearInterval(gameLoop.current);
  }, [draw]);

  useEffect(() => {
    if (status !== "playing") return;
    clearInterval(gameLoop.current);
    gameLoop.current = setInterval(tick, 120);
    return () => clearInterval(gameLoop.current);
  }, [tick, status]);

  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
      }
      if (status !== "playing") return;
      const map = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d && !(d.x === -dir.current.x && d.y === -dir.current.y)) {
        nextDir.current = d;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status]);

  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0]; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current || status !== "playing") return;
    const dx = e.changedTouches[0].clientX - touchStart.current.clientX;
    const dy = e.changedTouches[0].clientY - touchStart.current.clientY;
    if (Math.abs(dx) > Math.abs(dy)) {
      const d = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      if (!(d.x === -dir.current.x)) nextDir.current = d;
    } else {
      const d = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      if (!(d.y === -dir.current.y)) nextDir.current = d;
    }
  };

  return (
    <section id="game" style={{ background: t.gameBg, transition: "background 0.4s ease" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal direction="left">
          <div className="mb-12">
            <div style={{ background: "#F4DF4E", border: "4px solid #F4DF4E", color: "#000" }} className="inline-block px-4 py-2 font-black text-sm uppercase tracking-widest mb-4">
              Take A Break
            </div>
            <h2 className="font-black text-5xl md:text-7xl uppercase tracking-tighter" style={{ color: "#F4DF4E" }}>
              SNAKE<br /><span style={{ color: "#FF6B6B" }} className="glitch-text">GAME_</span>
            </h2>
          </div>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Canvas */}
            <div style={{ border: "4px solid #F4DF4E", boxShadow: "8px 8px 0 0 rgba(244,223,78,0.5)", position: "relative", flexShrink: 0 }}>
              <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ display: "block", maxWidth: "100%" }}
              />
              {status !== "playing" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  {status === "dead" && (
                    <>
                      <p className="font-black text-2xl uppercase tracking-widest" style={{ color: "#FF6B6B" }}>GAME OVER</p>
                      <p className="font-black text-lg" style={{ color: "#F4DF4E" }}>Score: {score}</p>
                      <p className="font-bold text-sm" style={{ color: "#aaa" }}>Best: {highScore}</p>
                    </>
                  )}
                  {status === "idle" && (
                    <p className="font-black text-xl uppercase tracking-widest" style={{ color: "#F4DF4E" }}>Press START</p>
                  )}
                  {status === "paused" && (
                    <p className="font-black text-xl uppercase tracking-widest" style={{ color: "#F4DF4E" }}>PAUSED</p>
                  )}
                  <button
                    onClick={startGame}
                    style={{ background: "#F4DF4E", color: "#000", border: "4px solid #F4DF4E", boxShadow: "6px 6px 0 0 #FF6B6B" }}
                    className="font-black uppercase tracking-widest text-sm px-8 py-3 cursor-pointer"
                  >
                    {status === "dead" ? "RETRY →" : "START →"}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 w-full lg:w-auto" style={{ minWidth: "200px" }}>
              <div style={{ background: "#1e1e1e", border: "4px solid #F4DF4E", boxShadow: "6px 6px 0 0 rgba(244,223,78,0.5)", padding: "20px" }}>
                <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: "#aaa" }}>Score</p>
                <p className="font-black text-4xl" style={{ color: "#F4DF4E" }}>{score}</p>
              </div>
              <div style={{ background: "#1e1e1e", border: "4px solid #FF6B6B", boxShadow: "6px 6px 0 0 rgba(255,107,107,0.4)", padding: "20px" }}>
                <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: "#aaa" }}>Best</p>
                <p className="font-black text-4xl" style={{ color: "#FF6B6B" }}>{highScore}</p>
              </div>
              {bonusActive && (
                <div style={{ background: "#FFD700", border: "4px solid #000", boxShadow: "4px 4px 0 0 #FF6B6B", padding: "12px" }} className="text-center">
                  <p className="font-black text-xs uppercase tracking-widest" style={{ color: "#000" }}>★ BONUS +50</p>
                  <p className="font-black text-xs" style={{ color: "#000" }}>Grab it fast!</p>
                </div>
              )}
              {status === "playing" && (
                <button onClick={togglePause} style={{ background: "#F4DF4E", color: "#000", border: "4px solid #F4DF4E", boxShadow: "4px 4px 0 0 rgba(244,223,78,0.5)" }} className="font-black uppercase tracking-widest text-sm px-6 py-3 cursor-pointer">
                  ⏸ PAUSE
                </button>
              )}
              {status === "paused" && (
                <button onClick={togglePause} style={{ background: "#A8FF78", color: "#000", border: "4px solid #A8FF78", boxShadow: "4px 4px 0 0 rgba(168,255,120,0.5)" }} className="font-black uppercase tracking-widest text-sm px-6 py-3 cursor-pointer">
                  ▶ RESUME
                </button>
              )}
              <div style={{ border: "4px solid rgba(244,223,78,0.3)", padding: "16px" }}>
                <p className="font-black text-xs uppercase tracking-widest mb-3" style={{ color: "#F4DF4E" }}>Controls</p>
                {[
                  { key: "↑ W", label: "Up" },
                  { key: "↓ S", label: "Down" },
                  { key: "← A", label: "Left" },
                  { key: "→ D", label: "Right" },
                ].map(k => (
                  <div key={k.key} className="flex justify-between mb-1">
                    <span className="font-black text-xs" style={{ color: "#F4DF4E" }}>{k.key}</span>
                    <span className="font-bold text-xs" style={{ color: "#aaa" }}>{k.label}</span>
                  </div>
                ))}
                <p className="font-bold text-xs mt-2" style={{ color: "#aaa" }}>★ Bonus tiap 30 poin</p>
                <p className="font-bold text-xs mt-1" style={{ color: "#555" }}>Swipe on mobile</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Loading Screen ────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const sequence = [
    "> INITIALIZING PORTFOLIO.EXE...",
    "> LOADING SKILLS MODULE........OK",
    "> LOADING PROJECTS MODULE......OK",
    "> LOADING SNAKE GAME...........OK",
    "> ESTABLISHING CONNECTION......OK",
    "> ALL SYSTEMS READY.",
    "> WELCOME, VISITOR.",
  ];

  useEffect(() => {
    setLines([]);
    setProgress(0);
    setFadeOut(false);
    let lineIndex = 0;
    let done = false;
    const interval = setInterval(() => {
      if (done) return;
      if (lineIndex < sequence.length) {
        lineIndex++;
        setLines(sequence.slice(0, lineIndex));
        setProgress(Math.round((lineIndex / sequence.length) * 100));
      } else {
        done = true;
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => onDone(), 600);
        }, 400);
      }
    }, 300);
    return () => { done = true; clearInterval(interval); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000", zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', Courier, monospace",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.6s ease",
      pointerEvents: fadeOut ? "none" : "all",
    }}>
      <div style={{ width: "min(600px, 90vw)" }}>
        <div style={{ borderBottom: "2px solid #F4DF4E", paddingBottom: "12px", marginBottom: "24px" }}>
          <p style={{ color: "#F4DF4E", fontWeight: "900", fontSize: "20px", letterSpacing: "4px" }}>PORTFOLIO.EXE</p>
          <p style={{ color: "#555", fontSize: "12px", marginTop: "4px" }}>Ahmad Ikdinal — Personal Portfolio System v1.0</p>
        </div>
        <div style={{ minHeight: "200px", marginBottom: "24px" }}>
          {lines.map((line, i) => (
            <p key={i} style={{
              color: (line && line.includes("OK")) ? "#A8FF78" : (line && line.includes("WELCOME")) ? "#F4DF4E" : "#e8dfc0",
              fontSize: "13px", marginBottom: "6px", letterSpacing: "1px",
            }}>
              {line || ""}
              {i === lines.length - 1 && !fadeOut && (
                <span style={{ color: "#F4DF4E", animation: "blink 1s infinite" }}>█</span>
              )}
            </p>
          ))}
        </div>
        <div style={{ border: "2px solid #333", height: "24px", position: "relative", marginBottom: "8px" }}>
          <div style={{ background: "#F4DF4E", height: "100%", width: `${progress}%`, transition: "width 0.3s ease" }} />
          <span style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            color: progress > 50 ? "#000" : "#F4DF4E", fontWeight: "900", fontSize: "12px", letterSpacing: "2px",
          }}>{progress}%</span>
        </div>
        <p style={{ color: "#555", fontSize: "11px", letterSpacing: "2px" }}>
          [{Array(Math.floor(progress / 5)).fill("█").join("")}{Array(20 - Math.floor(progress / 5)).fill("░").join("")}]
        </p>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────
function Navbar({ active, dark, toggleDark, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const btnShadow = (isActive) => isActive ? "none" : `4px 4px 0 0 ${t.shadow}`;
  const btnTransform = (isActive) => isActive ? "translate(2px,2px)" : "none";

  return (
    <nav style={{ background: t.navBg, borderBottom: `4px solid ${t.border}`, boxShadow: scrolled ? `0 4px 0 0 ${t.shadow}` : "none", transition: "all 0.4s ease" }} className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <div style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="font-black text-xl tracking-tighter font-mono px-3 py-1">
          PORTFOLIO.EXE
        </div>
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.toLowerCase();
            return (
              <button key={link} onClick={() => scrollTo(link)}
                style={{ background: isActive ? t.text : t.card, color: isActive ? t.body : t.text, border: `4px solid ${t.border}`, boxShadow: btnShadow(isActive), transform: btnTransform(isActive), transition: "all 0.15s ease" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; } }}
                className="font-black uppercase tracking-widest text-sm px-4 py-2 cursor-pointer">
                {link}
              </button>
            );
          })}
          <button onClick={toggleDark}
            style={{ background: t.toggleBg, color: t.toggleText, border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }}
            className="font-black text-sm px-4 py-2 cursor-pointer uppercase tracking-widest ml-2">
            {dark ? "☀ LIGHT" : "☾ DARK"}
          </button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleDark} style={{ background: t.toggleBg, color: t.toggleText, border: `4px solid ${t.border}`, boxShadow: `3px 3px 0 0 ${t.shadow}` }} className="font-black text-xs px-3 py-2 cursor-pointer">{dark ? "☀" : "☾"}</button>
          <button style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadow}` }} className="p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            <div style={{ background: t.text }} className="w-6 h-0.5 mb-1.5"></div>
            <div style={{ background: t.text }} className="w-6 h-0.5 mb-1.5"></div>
            <div style={{ background: t.text }} className="w-6 h-0.5"></div>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ borderTop: `4px solid ${t.border}`, background: t.navBg }} className="md:hidden flex flex-col">
          {NAV_LINKS.map((link) => (
            <button key={link} onClick={() => scrollTo(link)} style={{ color: t.text, borderBottom: `4px solid ${t.border}` }} className="font-black uppercase tracking-widest text-sm px-6 py-4 text-left cursor-pointer">{link}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function HeroSection({ t }) {
  const [typedGreeting, setTypedGreeting] = useState("");
  const [typed, setTyped] = useState("");
  const greetingText = "HI, I'M";
  const fullText = "Web Developer & Data Analyst";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= greetingText.length) { setTypedGreeting(greetingText.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (typedGreeting.length < greetingText.length) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= fullText.length) { setTyped(fullText.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, [typedGreeting]);

  return (
    <section id="home" style={{ background: t.body, transition: "background 0.4s ease" }} className="min-h-screen pt-16 flex items-center">
      <div className="max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal direction="left" delay={0}>
              <div style={{ background: "#FF6B6B", border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadow}`, color: "#000" }} className="inline-block px-4 py-2 font-black text-sm uppercase tracking-widest mb-6">
                Available for Hire
              </div>
            </Reveal>
            <Reveal direction="left" delay={100}>
              <h1 style={{ color: t.text, transition: "color 0.4s ease" }} className="font-black text-4xl md:text-5xl leading-none tracking-tighter mb-2 uppercase font-mono">
                {typedGreeting}
                <span style={{ opacity: typedGreeting.length < greetingText.length ? 1 : 0 }} className="animate-pulse">|</span>
              </h1>
            </Reveal>
            <Reveal direction="left" delay={150}>
              <p style={{ color: t.text, transition: "color 0.4s ease" }} className="font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-4 font-mono">
                AHMAD IKDINAL
              </p>
            </Reveal>
            <Reveal direction="left" delay={200}>
              <div style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadowHero}`, transition: "all 0.4s ease" }} className="px-4 py-2 inline-block mb-6">
                <span className="font-black text-xl md:text-2xl uppercase tracking-tight font-mono">
                  {typed}<span className="animate-pulse">|</span>
                </span>
              </div>
            </Reveal>
            <Reveal direction="left" delay={300}>
              <div style={{
                background: t.card,
                border: `4px solid ${t.border}`,
                boxShadow: `10px 10px 0 0 ${t.shadow}`,
                borderLeft: `4px solid #000000`,
                transition: "all 0.4s ease"
              }} className="max-w-lg mb-8 p-5">
                <p style={{ color: t.textMuted }} className="text-lg font-bold">
                  Information Technology student at Brawijaya University with a passion for Data Science, AI, and IoT. Experienced in building high-performance web applications and data-driven solutions — from Laravel backends and React/Next.js frontends to Python pipelines — with a strong drive to grow and contribute professionally.
                </p>
              </div>
            </Reveal>
            <Reveal direction="up" delay={400}>
              <div className="flex flex-wrap gap-4 items-start">
                <button
                  onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
                  style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadowHero}`, transition: "all 0.4s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadowHero}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${t.shadowHero}`; }}
                  className="font-black uppercase tracking-widest text-base px-8 py-4 cursor-pointer whitespace-nowrap">
                  Hire Me →
                </button>
                <div className="flex flex-wrap gap-4 items-start">
                  <a href="/CV_Ahmad_Ikdinal.pdf" download="CV_Ahmad_Ikdinal.pdf"
                    style={{ background: "#A8FF78", color: "#000", border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${t.shadow}`; }}
                    className="font-black uppercase tracking-widest text-base px-8 py-4 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                    ↓ Download CV
                  </a>
                  <a href="https://github.com/loma09" target="_blank" rel="noopener noreferrer"
                    style={{ background: t.body, color: t.text, border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${t.shadow}`; }}
                    className="font-black uppercase tracking-widest text-base px-8 py-4 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-5 h-5" />
                    GitHub
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={200}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96 float-anim">
                <div style={{ background: "#FF6B6B", border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}` }} className="absolute inset-0 translate-x-4 translate-y-4"></div>
                <div style={{ background: "#61DAFB", border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}` }} className="absolute inset-0 translate-x-2 translate-y-2"></div>
                <div style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="relative w-full h-full overflow-hidden">
                  <img src="/foto.jpg" alt="Ahmad Ikdinal" className="w-full h-full object-cover" />
                </div>
                <div style={{ background: t.body, border: `4px solid ${t.border}`, color: t.text, boxShadow: `6px 6px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="absolute -bottom-4 -right-4 px-4 py-3">
                  <p className="font-black text-sm uppercase tracking-widest">@loma09</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "9+", label: "Repositories" },
            { num: "6", label: "Core Skills" },
            { num: "3.89", label: "GPA" },
            { num: "Open", label: "To Hire" },
          ].map((s, i) => (
            <Reveal key={s.label} direction="up" delay={i * 80}>
              <div style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `6px 6px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="p-4 text-center">
                <p style={{ color: t.text }} className="font-black text-3xl"><CountUp value={s.num} /></p>
                <p style={{ color: t.textMuted }} className="font-bold text-sm uppercase tracking-widest">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ t, dark }) {
  return (
    <section id="skills" style={{ background: t.skillsBg, transition: "background 0.4s ease" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal direction="left">
          <div className="mb-12">
            <div style={{ background: "#F4DF4E", border: `4px solid #F4DF4E`, boxShadow: `4px 4px 0 0 rgba(255,255,255,0.2)`, color: "#000" }} className="inline-block px-4 py-2 font-black text-sm uppercase tracking-widest mb-4">
              What I Work With
            </div>
            <h2 style={{ color: t.skillsText }} className="font-black text-5xl md:text-7xl uppercase tracking-tighter">
              CORE<br /><span style={{ color: "#F4DF4E" }} className="glitch-text">SKILLS_</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SKILLS.map((skill, i) => (
            <Reveal key={skill.name} direction="up" delay={i * 80}>
              <div
                style={{ background: skill.accent, border: `4px solid ${dark ? "#F4DF4E" : "#000"}`, boxShadow: `8px 8px 0 0 ${dark ? "rgba(244,223,78,0.5)" : "rgba(244,223,78,0.8)"}`, transition: "all 0.15s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${dark ? "rgba(244,223,78,0.5)" : "rgba(244,223,78,0.8)"}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${dark ? "rgba(244,223,78,0.5)" : "rgba(244,223,78,0.8)"}`; }}
                className="p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div style={{ background: "#fff", border: `4px solid #000`, boxShadow: `4px 4px 0 0 #000` }} className="skill-icon-box w-14 h-14 flex items-center justify-center shrink-0">
                    <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-black text-4xl text-black opacity-20 font-mono">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight text-black">{skill.name}</h3>
                <div className="mt-3 h-1 bg-black w-0 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ t }) {
  return (
    <section id="projects" style={{ background: t.projectsBg, transition: "background 0.4s ease" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal direction="left">
          <div className="mb-4">
            <div style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 #FF6B6B`, transition: "all 0.4s ease" }} className="inline-block px-4 py-2 font-black text-sm uppercase tracking-widest mb-4">
              Real GitHub Projects
            </div>
            <h2 style={{ color: t.text, transition: "color 0.4s ease" }} className="font-black text-5xl md:text-7xl uppercase tracking-tighter">
              SELECTED<br />
              <span style={{ background: t.text, color: t.body, transition: "all 0.4s ease" }} className="glitch-text px-2 inline-block">PROJECTS</span>
            </h2>
          </div>
        </Reveal>
        <Reveal direction="left" delay={80}>
          <a href="https://github.com/loma09" target="_blank" rel="noopener noreferrer"
            style={{ color: t.textMuted, borderBottom: `2px solid ${t.border}`, transition: "color 0.4s" }}
            className="inline-block font-bold font-mono text-sm mb-10 hover:opacity-70">
            github.com/loma09
          </a>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} direction="up" delay={i * 120}>
              <div
                style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadow}`, transition: "all 0.15s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${t.shadow}`; }}
                className="project-card flex flex-col h-full">
                <div style={{ background: project.mockupBg, borderBottom: `4px solid ${t.border}` }} className="h-44 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#2a2a2a] flex items-center px-3 gap-2" style={{ borderBottom: "2px solid #000" }}>
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black"></div>
                    <div className="ml-2 flex-1 h-4 bg-[#444] rounded-sm border border-gray-600 flex items-center px-2">
                      <span className="text-gray-400 text-xs font-mono truncate">github.com/loma09/{project.title.toLowerCase().replace(/\s+/g, "-")}</span>
                    </div>
                  </div>
                  <div className="absolute top-10 left-0 right-0 bottom-0 p-3 flex flex-col gap-2">
                    <div style={{ background: project.accentBar, border: "2px solid rgba(255,255,255,0.2)" }} className="mockup-bar h-6 w-3/4"></div>
                    <div className="mockup-bar h-3 bg-gray-600 w-full opacity-50 rounded-sm"></div>
                    <div className="mockup-bar h-3 bg-gray-600 w-4/5 opacity-40 rounded-sm"></div>
                    <div className="mockup-bar h-3 bg-gray-600 w-2/3 opacity-30 rounded-sm"></div>
                    <div className="flex gap-2 mt-1">
                      <div style={{ background: project.accentBar, border: "2px solid rgba(255,255,255,0.2)" }} className="mockup-bar h-7 w-20"></div>
                      <div className="h-7 w-16 bg-gray-700 border-2 border-gray-500"></div>
                    </div>
                  </div>
                  <div style={{ background: project.langColor, border: "2px solid #000", color: "#000" }} className="absolute bottom-2 right-2 px-2 py-1 font-black text-xs uppercase tracking-widest">
                    {project.lang}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} style={{ background: TAG_COLORS[tag] || "#eee", border: `2px solid ${t.border}`, color: "#000" }} className="font-black text-xs uppercase tracking-widest px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ color: t.text }} className="font-black text-xl uppercase tracking-tight mb-2">{project.title}</h3>
                  <p style={{ color: t.textMuted }} className="text-sm font-medium flex-1 mb-4">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadowYellow}`, transition: "all 0.15s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = `2px 2px 0 0 ${t.shadowYellow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadowYellow}`; }}
                    className="flex items-center justify-center gap-2 text-center font-black uppercase tracking-widest text-sm px-4 py-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-4 h-4" style={{ filter: "invert(1)" }} />
                    View on GitHub →
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ t }) {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };
  const inputStyle = {
    background: t.inputBg, border: `4px solid ${t.border}`, color: t.text,
    boxShadow: `4px 4px 0 0 ${t.shadow}`, outline: "none", width: "100%",
    padding: "12px 16px", fontWeight: "700", fontSize: "16px", transition: "all 0.15s ease", fontFamily: "inherit",
  };

  return (
    <section id="contact" style={{ background: t.contactBg, transition: "background 0.4s ease" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal direction="left">
          <div className="mb-12">
            <div style={{ background: "#F4DF4E", border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 ${t.shadow}`, color: "#000" }} className="inline-block px-4 py-2 font-black text-sm uppercase tracking-widest mb-4">
              Get In Touch
            </div>
            <h2 style={{ color: t.text, transition: "color 0.4s ease" }} className="font-black text-5xl md:text-7xl uppercase tracking-tighter">
              LET'S<br /><span style={{ borderBottom: `8px solid ${t.border}` }} className="glitch-text">WORK.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal direction="left" delay={100}>
            <div style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="p-8">
              {status === "success" && (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div style={{ background: "#A8FF78", border: `4px solid ${t.border}`, boxShadow: `6px 6px 0 0 ${t.shadow}` }} className="p-6 mb-4">
                    <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/2705.svg" alt="Success" className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 style={{ color: t.text }} className="font-black text-2xl uppercase tracking-tight">Message Sent!</h3>
                  <p style={{ color: t.textMuted }} className="font-bold mt-2">I'll get back to you within 24 hours.</p>
                </div>
              )}
              {status === "error" && (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div style={{ background: "#FF6B6B", border: `4px solid ${t.border}`, boxShadow: `6px 6px 0 0 ${t.shadow}` }} className="p-6 mb-4">
                    <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/274c.svg" alt="Error" className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 style={{ color: t.text }} className="font-black text-2xl uppercase tracking-tight">Send Failed!</h3>
                  <p style={{ color: t.textMuted }} className="font-bold mt-2">Please try again or email directly.</p>
                </div>
              )}
              {(status === "idle" || status === "sending") && (
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {[
                    { label: "Your Name", name: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{ color: t.text }} className="font-black text-xs uppercase tracking-widest block mb-2">{field.label} *</label>
                      <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} required placeholder={field.placeholder} style={inputStyle}
                        onFocus={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
                        onBlur={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: t.text }} className="font-black text-xs uppercase tracking-widest block mb-2">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: "none" }}
                      onFocus={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
                      onBlur={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadow}`; }} />
                  </div>
                  <button type="submit" disabled={status === "sending"}
                    style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `8px 8px 0 0 ${t.shadowHero}`, transition: "all 0.15s ease", opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "wait" : "pointer" }}
                    onMouseEnter={e => { if (status !== "sending") { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = `4px 4px 0 0 ${t.shadowHero}`; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `8px 8px 0 0 ${t.shadowHero}`; }}
                    className="font-black uppercase tracking-widest text-base px-8 py-4">
                    {status === "sending" ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            <Reveal direction="right" delay={150}>
              <div style={{ background: t.text, color: t.body, border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="p-8">
                <h3 className="font-black text-2xl uppercase tracking-tight mb-4">Direct Contact</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/2709.svg", label: "ahmadikdinal@gmail.com", alt: "Email" },
                    { icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f4cd.svg", label: "Bekasi, Indonesia", alt: "Location" },
                  ].map((item) => (
                    <div key={item.label} style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }} className="flex items-center gap-3 pb-3 last:border-0 last:pb-0">
                      <div style={{ border: "2px solid currentColor" }} className="w-10 h-10 flex items-center justify-center shrink-0">
                        <img src={item.icon} alt={item.alt} className="w-5 h-5" />
                      </div>
                      <span className="font-bold font-mono text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={250}>
              <div style={{ background: t.card, border: `4px solid ${t.border}`, boxShadow: `12px 12px 0 0 ${t.shadow}`, transition: "all 0.4s ease" }} className="p-8">
                <h3 style={{ color: t.text }} className="font-black text-xl uppercase tracking-tight mb-5">Find Me Online</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "GitHub", sub: "@loma09", bg: "#24292e", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", href: "https://github.com/loma09" },
                    { label: "LinkedIn", sub: "Ahmad Ikdinal", bg: "#0077B5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", href: "https://www.linkedin.com/in/ahmad-ikdinal-5aa688263/" },
                  ].map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                      style={{ background: social.bg, border: `4px solid ${t.border}`, boxShadow: `6px 6px 0 0 ${t.shadow}`, transition: "all 0.15s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = `3px 3px 0 0 ${t.shadow}`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `6px 6px 0 0 ${t.shadow}`; }}
                      className="flex items-center gap-4 p-4 text-white group">
                      <div className="w-10 h-10 bg-white border-2 border-white flex items-center justify-center shrink-0">
                        <img src={social.icon} alt={social.label} className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-widest text-sm">{social.label}</p>
                        <p className="font-mono text-xs text-gray-300">{social.sub}</p>
                      </div>
                      <div className="ml-auto font-black text-[#F4DF4E] group-hover:translate-x-1 transition-transform">→</div>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer style={{ background: t.footerBg, borderTop: `4px solid ${t.border}`, transition: "all 0.4s ease" }} className="py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div style={{ color: t.footerText }} className="font-black font-mono text-lg tracking-tighter">PORTFOLIO.EXE</div>
        <p style={{ color: t.footerText }} className="font-bold text-sm text-center opacity-70">
          © {new Date().getFullYear()} Ahmad Ikdinal · Built with React & Tailwind
        </p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ background: "#F4DF4E", color: "#000", border: `4px solid ${t.border}`, boxShadow: `4px 4px 0 0 #FF6B6B`, transition: "all 0.15s ease" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 0 #FF6B6B"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 0 #FF6B6B"; }}
          className="font-black text-sm px-4 py-2 uppercase tracking-widest cursor-pointer">
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
}

// ── Portfolio Root ────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("portfolio-dark") === "true"; } catch (e) { return false; }
  });
  const [showLoading, setShowLoading] = useState(() => {
    try { return !sessionStorage.getItem("portfolio-loaded"); } catch (e) { return true; }
  });
  const [showContent, setShowContent] = useState(() => {
    try { return !!sessionStorage.getItem("portfolio-loaded"); } catch (e) { return false; }
  });
  const [activeSection, setActiveSection] = useState("home");
  const t = dark ? THEMES.dark : THEMES.light;

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("portfolio-dark", String(next)); } catch (e) { }
      return next;
    });
  }, []);

  const handleLoadingDone = useCallback(() => {
    try { sessionStorage.setItem("portfolio-loaded", "1"); } catch (e) { }
    setShowContent(true);
    setShowLoading(false);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    const sections = ["home", "skills", "projects", "game", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [showContent]);

  return (
    <>
      {showLoading && <LoadingScreen onDone={handleLoadingDone} />}
      <div style={{
        background: t.body,
        fontFamily: "'Courier New', Courier, monospace",
        transition: "background 0.4s ease",
        visibility: showContent ? "visible" : "hidden",
      }}>
        <Navbar active={activeSection} dark={dark} toggleDark={toggleDark} t={t} />
        <HeroSection t={t} />
        <SkillsSection t={t} dark={dark} />
        <ProjectsSection t={t} />
        <SnakeGame t={t} />
        <ContactSection t={t} />
        <Footer t={t} />
      </div>
    </>
  );
}