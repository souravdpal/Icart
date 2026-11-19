import Link from "next/link";

export const metadata = {
  title: "404 – Page not found",
};

export default function NotFound() {
  return (
    <main className="nf-root">
      <style>{css}</style>

      <div className="nf-orb nf-orb-a" />
      <div className="nf-orb nf-orb-b" />
      <div className="nf-grid" />

      <section className="nf-card">
        <div className="nf-badge">
          <span className="nf-dot" /> Error 404
        </div>

        <h1 className="nf-code" aria-label="404">
          <span>4</span>
          <span className="nf-zero">0</span>
          <span>4</span>
        </h1>

        <h2 className="nf-title">Lost in space</h2>
        <p className="nf-text">
          The page you&apos;re looking for doesn&apos;t exist, was moved ,or
          never made it out of the lab. Let&apos;s get you back on track.
        </p>

        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn-primary">
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

const css = `
.nf-root {
  --bg: #0a0a12;
  --fg: #f4f4fb;
  --muted: #9a9ab5;
  --card: rgba(255, 255, 255, 0.04);
  --border: rgba(255, 255, 255, 0.1);
  --a: #7c5cff;
  --b: #22d3ee;
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 24px;
  background: var(--bg);
  color: var(--fg);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: light) {
  .nf-root {
    --bg: #f6f6fb;
    --fg: #14141f;
    --muted: #666682;
    --card: rgba(255, 255, 255, 0.7);
    --border: rgba(20, 20, 40, 0.1);
  }
}
.nf-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
  animation: nf-drift 14s ease-in-out infinite alternate;
}
.nf-orb-a { width: 420px; height: 420px; background: var(--a); top: -120px; left: -100px; }
.nf-orb-b { width: 380px; height: 380px; background: var(--b); bottom: -140px; right: -100px; animation-delay: -6s; }
.nf-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 70%);
  opacity: 0.5;
}
.nf-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  text-align: center;
  padding: 48px 32px;
  border-radius: 28px;
  background: var(--card);
  border: 1px solid var(--border);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.5);
  animation: nf-rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.nf-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 999px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); border: 1px solid var(--border);
}
.nf-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #ff5d73; box-shadow: 0 0 10px #ff5d73;
  animation: nf-pulse 1.6s ease-in-out infinite;
}
.nf-code {
  margin: 20px 0 4px;
  display: flex; justify-content: center; gap: 6px;
  font-size: clamp(88px, 22vw, 150px);
  font-weight: 900; line-height: 1; letter-spacing: -0.04em;
}
.nf-code span {
  background: linear-gradient(135deg, var(--a), var(--b));
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 28px rgba(124, 92, 255, 0.45));
}
.nf-zero { display: inline-block; animation: nf-float 3.2s ease-in-out infinite; }
.nf-title { margin: 0 0 10px; font-size: 26px; font-weight: 700; }
.nf-text { margin: 0 auto 28px; max-width: 380px; color: var(--muted); font-size: 15px; line-height: 1.65; }
.nf-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.nf-btn {
  display: inline-block; padding: 13px 26px; border-radius: 14px;
  font-size: 15px; font-weight: 600; text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nf-btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--a), var(--b));
  box-shadow: 0 10px 30px -8px rgba(124, 92, 255, 0.7);
}
.nf-btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 16px 40px -8px rgba(124, 92, 255, 0.85); }
.nf-btn-primary:active { transform: translateY(0) scale(0.98); }

@keyframes nf-float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
@keyframes nf-drift { to { transform: translate(60px, 40px) scale(1.15); } }
@keyframes nf-rise { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes nf-pulse { 50% { opacity: 0.35; transform: scale(0.8); } }
@media (prefers-reduced-motion: reduce) {
  .nf-root *, .nf-root *::before { animation: none !important; transition: none !important; }
}
`;