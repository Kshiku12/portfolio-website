import React, { useEffect, useRef } from 'react';

export interface PointerState {
  x: number;
  y: number;
  last: number;
}

interface NeuralCanvasHeroProps {
  pointerRef: React.MutableRefObject<PointerState>;
  counterRef: React.RefObject<HTMLSpanElement | null>;
}

interface SynapticPulse {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  progress: number;
  speed: number;
  accent: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  strength: number;
}

interface Polyhedron3D {
  nx: number;
  ny: number;
  size: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
}

export function getActiveCursor(
  pointer: PointerState,
  width: number,
  height: number,
  now: number
): { x: number; y: number; auto: boolean } {
  if (now - pointer.last < 2800 && pointer.x > -9000) {
    return { x: pointer.x, y: pointer.y, auto: false };
  }
  const t = now / 1000;
  return {
    x: width * (0.52 + 0.34 * Math.cos(0.38 * t)),
    y: height * (0.46 + 0.26 * Math.sin(0.54 * t)),
    auto: true,
  };
}

export const NeuralCanvasHero: React.FC<NeuralCanvasHeroProps> = ({
  pointerRef,
  counterRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let cols = 22;
    let rows = 13;
    let rafId = 0;
    let isVisible = true;
    let lastTime = performance.now();
    let focusX = -9999;
    let focusY = -9999;
    let tensorOps = 12480;

    const pulses: SynapticPulse[] = [];
    const shockwaves: Shockwave[] = [];

    const polyhedra: Polyhedron3D[] = [
      { nx: 0.82, ny: 0.24, size: 46, rx: 0.4, ry: 0.8, rz: 0.1, vrx: 0.45, vry: 0.62 },
      { nx: 0.16, ny: 0.3, size: 34, rx: 1.1, ry: 0.2, rz: 0.5, vrx: -0.38, vry: 0.51 },
      { nx: 0.68, ny: 0.66, size: 38, rx: 0.2, ry: 1.4, rz: 0.3, vrx: 0.52, vry: -0.44 },
    ];

    const spawnPulse = (forceAccent = false) => {
      if (pulses.length > 55) return;
      const r1 = Math.floor(Math.random() * rows);
      const c1 = Math.floor(Math.random() * cols);
      const dir = Math.random() < 0.55 ? [0, 1] : [1, 0];
      const r2 = Math.min(rows - 1, r1 + dir[0]);
      const c2 = Math.min(cols - 1, c1 + dir[1]);
      if (r1 === r2 && c1 === c2) return;
      pulses.push({
        r1,
        c1,
        r2,
        c2,
        progress: 0,
        speed: 0.9 + Math.random() * 1.4,
        accent: forceAccent || Math.random() < 0.35,
      });
    };

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(14, Math.min(26, Math.round(width / 64)));
      rows = Math.max(9, Math.min(16, Math.round(height / 58)));

      pulses.length = 0;
      for (let i = 0; i < 36; i++) {
        spawnPulse();
        if (pulses[i]) pulses[i].progress = Math.random();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      shockwaves.push({ x: cx, y: cy, radius: 10, strength: 1 });
      for (let i = 0; i < 10; i++) spawnPulse(true);
      tensorOps += 240;
    };

    const parentEl = canvas.parentElement;
    parentEl?.addEventListener('click', handleClick);

    // Project a 3D octahedron at (cx, cy)
    const drawOctahedron = (
      cx: number,
      cy: number,
      radius: number,
      rx: number,
      ry: number,
      alpha: number
    ) => {
      const verts = [
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
      ];
      const edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2],
      ];

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const projected = verts.map(([vx, vy, vz]) => {
        const y1 = vy * cosX - vz * sinX;
        const z1 = vy * sinX + vz * cosX;
        const x2 = vx * cosY + z1 * sinY;
        const z2 = -vx * sinY + z1 * cosY;
        const scale = 220 / (220 + z2 * 45);
        return [cx + x2 * radius * scale, cy + y1 * radius * scale];
      });

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#E8FF3B';
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
      }
      ctx.stroke();
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now / 1000;

      const target = getActiveCursor(pointerRef.current, width, height, now);
      if (focusX < -9000) {
        focusX = target.x;
        focusY = target.y;
      }
      focusX += (target.x - focusX) * Math.min(1, 8.5 * dt);
      focusY += (target.y - focusY) * Math.min(1, 8.5 * dt);

      ctx.clearRect(0, 0, width, height);

      // Warm radial solar spotlight following the cursor
      const radialGlow = ctx.createRadialGradient(
        focusX,
        focusY,
        12,
        focusX,
        focusY,
        Math.max(width, height) * 0.48
      );
      radialGlow.addColorStop(0, 'rgba(255, 232, 140, 0.24)');
      radialGlow.addColorStop(0.42, 'rgba(255, 138, 60, 0.12)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Compute 3D perspective wave lattice vertices
      const tiltX = ((focusX / Math.max(1, width)) - 0.5) * 18;
      const tiltY = ((focusY / Math.max(1, height)) - 0.5) * 14;

      const gridPts: { x: number; y: number; lift: number }[][] = [];
      const padX = width * 0.04;
      const padY = height * 0.06;
      const spanX = width + padX * 2;
      const spanY = height + padY * 2;

      for (let r = 0; r < rows; r++) {
        const rowArr: { x: number; y: number; lift: number }[] = [];
        const vNorm = r / Math.max(1, rows - 1);
        for (let c = 0; c < cols; c++) {
          const uNorm = c / Math.max(1, cols - 1);
          const baseX = -padX + uNorm * spanX + (vNorm - 0.5) * tiltX;
          const baseY = -padY + vNorm * spanY + (uNorm - 0.5) * tiltY;

          // Multi-harmonic wave + cursor magnetic elevation
          const waveZ =
            Math.sin(c * 0.48 + t * 1.65) * Math.cos(r * 0.52 + t * 1.25) * 11;

          const dx = baseX - focusX;
          const dy = baseY - focusY;
          const dist = Math.hypot(dx, dy);
          const cursorInfluence = Math.max(0, 1 - dist / 250);
          const magneticLift =
            cursorInfluence * cursorInfluence * 34 * Math.cos(dist * 0.022 - t * 3.2);

          // Shockwave contribution
          let shockLift = 0;
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const sd = Math.hypot(baseX - sw.x, baseY - sw.y);
            const ringDelta = Math.abs(sd - sw.radius);
            if (ringDelta < 65) {
              shockLift += (1 - ringDelta / 65) * 28 * sw.strength;
            }
          }

          const totalZ = waveZ + magneticLift + shockLift;
          const pushFactor = cursorInfluence * 0.14;

          rowArr.push({
            x: baseX + dx * pushFactor,
            y: baseY - totalZ + dy * pushFactor * 0.5,
            lift: cursorInfluence + Math.min(1, Math.abs(shockLift) / 25),
          });
        }
        gridPts.push(rowArr);
      }

      // Draw horizontal & vertical 3D topological mesh lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 253, 249, 0.16)';
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = gridPts[r][c];
          if (c === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
      }
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const pt = gridPts[r][c];
          if (r === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();

      // Draw elevated vertices & radial filaments to cursor
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = gridPts[r][c];
          const isHot = pt.lift > 0.25;

          if (pt.lift > 0.42) {
            ctx.strokeStyle = `rgba(232, 255, 59, ${(pt.lift * 0.35).toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(focusX, focusY);
            ctx.stroke();
          }

          ctx.fillStyle = isHot ? '#E8FF3B' : 'rgba(255, 253, 249, 0.45)';
          const rad = isHot ? 2.2 + pt.lift * 1.8 : 1.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update & draw synaptic pulses racing along mesh edges
      if (Math.random() < 0.45) spawnPulse();
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed * dt;
        if (p.progress >= 1) {
          tensorOps += 3;
          pulses.splice(i, 1);
          spawnPulse();
          continue;
        }
        const pA = gridPts[p.r1]?.[p.c1];
        const pB = gridPts[p.r2]?.[p.c2];
        if (!pA || !pB) continue;

        const px = pA.x + (pB.x - pA.x) * p.progress;
        const py = pA.y + (pB.y - pA.y) * p.progress;
        const tailProg = Math.max(0, p.progress - 0.28);
        const tx = pA.x + (pB.x - pA.x) * tailProg;
        const ty = pA.y + (pB.y - pA.y) * tailProg;

        ctx.strokeStyle = p.accent ? '#E8FF3B' : '#FFFDF9';
        ctx.lineWidth = p.accent ? 2.4 : 1.7;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = p.accent ? '#E8FF3B' : '#FFFDF9';
        ctx.beginPath();
        ctx.arc(px, py, p.accent ? 2.8 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw tumbling 3D wireframe octahedra
      for (const poly of polyhedra) {
        const px = poly.nx * width;
        const py = poly.ny * height;
        const distToCursor = Math.hypot(px - focusX, py - focusY);
        const boost = distToCursor < 220 ? 2.8 : 1;
        poly.rx += poly.vrx * dt * boost;
        poly.ry += poly.vry * dt * boost;
        drawOctahedron(px, py, poly.size, poly.rx, poly.ry, distToCursor < 220 ? 0.85 : 0.42);
      }

      // Update & draw click shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 360 * dt;
        sw.strength -= 1.15 * dt;
        if (sw.strength <= 0) {
          shockwaves.splice(s, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = sw.strength * 0.75;
        ctx.strokeStyle = '#E8FF3B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw 3D Gyroscope Cursor Reticle
      ctx.save();
      ctx.translate(focusX, focusY);
      ctx.rotate(t * 0.55);
      ctx.strokeStyle = 'rgba(255, 253, 249, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 56, 34, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-t * 1.1);
      ctx.strokeStyle = 'rgba(232, 255, 59, 0.75)';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 52, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#E8FF3B';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      tensorOps += 2;
      if (counterRef.current) {
        counterRef.current.textContent = tensorOps.toLocaleString('en-US');
      }

      if (isVisible && !reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    setupCanvas();
    if (reducedMotion) {
      render(performance.now());
    } else {
      rafId = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
      if (reducedMotion) render(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting && !document.hidden;
      if (isVisible && !wasVisible && !reducedMotion) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    });
    intersectionObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parentEl?.removeEventListener('click', handleClick);
    };
  }, [pointerRef, counterRef]);

  return <canvas ref={canvasRef} className="hero-tensor-canvas" aria-hidden="true" />;
};

const NAME_LINES = ['KUMAR', 'KSHITIJ'];

interface HeroDisplayNameProps {
  pointerRef: React.MutableRefObject<PointerState>;
  boxRef: React.RefObject<HTMLElement | null>;
}

export const HeroDisplayName: React.FC<HeroDisplayNameProps> = ({
  pointerRef,
  boxRef,
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const box = boxRef.current;
    if (!heading || !box) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = Array.from(heading.querySelectorAll<HTMLSpanElement>('[data-char]'));
    const state = chars.map(() => ({ tx: 0, ty: 0, scale: 1 }));

    let rafId = 0;
    let lastTime = performance.now();

    const updateChars = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const boxRect = box.getBoundingClientRect();
      const cursor = getActiveCursor(
        pointerRef.current,
        boxRect.width,
        boxRect.height,
        now
      );

      chars.forEach((ch, idx) => {
        const r = ch.getBoundingClientRect();
        const cx = r.left + r.width / 2 - boxRect.left;
        const cy = r.top + r.height / 2 - boxRect.top;
        const dx = cx - cursor.x;
        const dy = cy - cursor.y;
        const dist = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - dist / 260);

        const targetTx = proximity > 0 ? (dx / (dist || 1)) * proximity * 6 : 0;
        const targetTy = proximity > 0 ? -proximity * 12 : 0;
        const targetScale = 1 + proximity * 0.065;

        const st = state[idx];
        st.tx += (targetTx - st.tx) * Math.min(1, 9 * dt);
        st.ty += (targetTy - st.ty) * Math.min(1, 9 * dt);
        st.scale += (targetScale - st.scale) * Math.min(1, 9 * dt);

        ch.style.transform = `translate3d(${st.tx.toFixed(1)}px, ${st.ty.toFixed(1)}px, 0) scale(${st.scale.toFixed(3)})`;
        if (proximity > 0.25) {
          ch.style.color = '#E8FF3B';
          ch.style.textShadow = `0 ${Math.round(proximity * 14)}px 28px rgba(13, 15, 20, 0.35)`;
        } else {
          ch.style.color = '#FFFDF9';
          ch.style.textShadow = '0 8px 24px rgba(150, 22, 0, 0.28)';
        }
      });

      rafId = requestAnimationFrame(updateChars);
    };

    rafId = requestAnimationFrame(updateChars);
    return () => cancelAnimationFrame(rafId);
  }, [pointerRef, boxRef]);

  let delayIdx = 0;

  return (
    <h1 ref={headingRef} className="hero-name" aria-label="Kumar Kshitij">
      {NAME_LINES.map((line) => (
        <span key={line} className="hero-line" aria-hidden="true">
          {line.split('').map((ch, idx) => (
            <span
              key={idx}
              data-char
              className="hero-letter"
              style={{ animationDelay: `${90 + delayIdx++ * 48}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
};
