import { useRef, useEffect } from 'react';

const TAGS = ['FAG', 'ACAT', '涂鸦', 'CY', 'SPRAY', '福瑞', 'GRAFFITI', '吖猫'];
const COLORS = ['#008dff', '#e91e8c', '#fff', '#00ff88', '#ff6b00'];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function GraffitiCanvas({ variant = 'hero' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let mouse = { x: 0.5, y: 0.5 };

    const particles = [];
    const drips = [];
    const splats = [];
    const floatTags = [];

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const init = () => {
      particles.length = 0;
      drips.length = 0;
      splats.length = 0;
      floatTags.length = 0;

      const count = variant === 'overlay' ? 40 : 70;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.3, 0.3),
          vy: rand(-0.2, 0.2),
          r: rand(1, 3),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: rand(0.15, 0.5),
        });
      }

      for (let i = 0; i < 12; i++) {
        drips.push({
          x: rand(0, w),
          y: rand(-h * 0.2, h * 0.3),
          speed: rand(0.4, 1.2),
          len: rand(20, 80),
          width: rand(1.5, 4),
          color: COLORS[Math.floor(Math.random() * 3)],
        });
      }

      for (let i = 0; i < 8; i++) {
        splats.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(15, 45),
          dots: Array.from({ length: rand(5, 12) }, () => ({
            dx: rand(-20, 20),
            dy: rand(-20, 20),
            r: rand(2, 6),
          })),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: rand(0.08, 0.2),
        });
      }

      TAGS.forEach((text, i) => {
        floatTags.push({
          text,
          x: rand(0.05, 0.9) * w,
          y: rand(0.05, 0.9) * h,
          rot: rand(-25, 25),
          scale: rand(0.6, 1.4),
          speed: rand(0.15, 0.4),
          dir: Math.random() > 0.5 ? 1 : -1,
          color: COLORS[i % COLORS.length],
          alpha: rand(0.06, 0.14),
        });
      });
    };

    const onMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h);

      // spray mist grid
      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let x = 0; x < w; x += 30) {
        for (let y = 0; y < h; y += 30) {
          if (Math.sin(x * 0.02 + time * 0.001 + y * 0.01) > 0.7) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }

      splats.forEach((s) => {
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        s.dots.forEach((d) => {
          ctx.beginPath();
          ctx.arc(s.x + d.dx, s.y + d.dy, d.r, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.globalAlpha = 1;

      drips.forEach((d) => {
        if (!reduced) d.y += d.speed;
        if (d.y > h + d.len) {
          d.y = rand(-100, -20);
          d.x = rand(0, w);
        }
        const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
        grad.addColorStop(0, d.color);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + Math.sin(d.y * 0.05) * 3, d.y + d.len);
        ctx.stroke();
      });

      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx + (mouse.x - 0.5) * 0.15;
          p.y += p.vy + (mouse.y - 0.5) * 0.1;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      floatTags.forEach((tag) => {
        if (!reduced) {
          tag.x += tag.speed * tag.dir;
          tag.y += Math.sin(time * 0.001 + tag.x) * 0.15;
          if (tag.x < -100) tag.x = w + 50;
          if (tag.x > w + 100) tag.x = -50;
        }
        ctx.save();
        ctx.translate(tag.x, tag.y);
        ctx.rotate((tag.rot * Math.PI) / 180);
        ctx.scale(tag.scale, tag.scale);
        ctx.globalAlpha = tag.alpha;
        ctx.font = `900 ${variant === 'overlay' ? 28 : 36}px Inter, sans-serif`;
        ctx.fillStyle = tag.color;
        ctx.fillText(tag.text, 0, 0);
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    init();
    animRef.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas.parentElement);
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`graffiti-canvas graffiti-canvas--${variant}`}
      aria-hidden="true"
    />
  );
}
