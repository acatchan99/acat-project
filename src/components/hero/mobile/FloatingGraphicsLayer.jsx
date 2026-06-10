const PARTICLES = [
  { top: '11%', left: '22%', color: '#0088ff', size: 3, opacity: 0.72 },
  { top: '18%', left: '78%', color: '#00ffa6', size: 2, opacity: 0.55 },
  { top: '26%', left: '12%', color: '#ff0082', size: 4, opacity: 0.48 },
  { top: '31%', left: '64%', color: '#ffb347', size: 3, opacity: 0.62 },
  { top: '42%', left: '88%', color: '#0088ff', size: 2, opacity: 0.45 },
  { top: '48%', left: '8%', color: '#00ffa6', size: 3, opacity: 0.58 },
  { top: '54%', left: '46%', color: '#ffffff', size: 2, opacity: 0.35 },
  { top: '58%', left: '72%', color: '#ff0082', size: 3, opacity: 0.5 },
  { top: '66%', left: '18%', color: '#0088ff', size: 2, opacity: 0.68 },
  { top: '70%', left: '56%', color: '#ffb347', size: 3, opacity: 0.42 },
  { top: '74%', left: '34%', color: '#00ffa6', size: 2, opacity: 0.55 },
  { top: '78%', left: '84%', color: '#ffffff', size: 3, opacity: 0.38 },
  { top: '22%', left: '38%', color: '#0088ff', size: 2, opacity: 0.5 },
  { top: '36%', left: '28%', color: '#ff0082', size: 3, opacity: 0.44 },
  { top: '52%', left: '92%', color: '#00ffa6', size: 2, opacity: 0.6 },
  { top: '62%', left: '4%', color: '#ffb347', size: 3, opacity: 0.46 },
];

const NEON_LINES = [
  { top: '16%', left: '6%', height: 28, color: '#0088ff', opacity: 0.55 },
  { top: '24%', left: '92%', height: 36, color: '#ff0082', opacity: 0.5 },
  { top: '38%', left: '4%', height: 22, color: '#ffffff', opacity: 0.35 },
  { top: '44%', left: '94%', height: 40, color: '#00ffa6', opacity: 0.48 },
  { top: '56%', left: '7%', height: 18, color: '#0088ff', opacity: 0.42 },
  { top: '68%', left: '90%', height: 32, color: '#ff0082', opacity: 0.45 },
];

export default function FloatingGraphicsLayer() {
  return (
    <div className="m-hero-gfx" aria-hidden="true">
      <span className="m-hero-gfx__tag m-hero-gfx__tag--fag">FAG</span>
      <span className="m-hero-gfx__tag m-hero-gfx__tag--cy">CY</span>
      <span className="m-hero-gfx__tag m-hero-gfx__tag--acat">ACAT</span>
      <span className="m-hero-gfx__tag m-hero-gfx__tag--graffiti">GRAFFITI</span>
      <span className="m-hero-gfx__tag m-hero-gfx__tag--spray">SPRAY</span>

      <div className="m-hero-gfx__arc">
        <svg viewBox="0 0 320 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 8 92 Q 160 8 312 72"
            fill="none"
            stroke="#0088ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {PARTICLES.map((p, i) => (
        <span
          key={`p-${i}`}
          className="m-hero-gfx__particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}

      {NEON_LINES.map((line, i) => (
        <span
          key={`n-${i}`}
          className="m-hero-gfx__neon"
          style={{
            top: line.top,
            left: line.left,
            height: line.height,
            backgroundColor: line.color,
            opacity: line.opacity,
          }}
        />
      ))}

      <span className="m-hero-gfx__star m-hero-gfx__star--1">✦</span>
      <span className="m-hero-gfx__star m-hero-gfx__star--2">✦</span>
      <span className="m-hero-gfx__badge">FAG</span>
    </div>
  );
}
