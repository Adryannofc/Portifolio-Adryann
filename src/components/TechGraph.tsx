import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { SectionHead } from './Header';
import { NODES, EDGES, CAT_COLOR, type GraphNode } from '../data/tech-graph';

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function TechGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const ref = useReveal<HTMLElement>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const tip = tipRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: SimNode[] = NODES.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }));
    const byId = new Map<string, SimNode>(nodes.map((n) => [n.id, n]));
    const adj = new Map<string, Set<string>>(nodes.map((n) => [n.id, new Set<string>()]));
    EDGES.forEach(([a, b]) => {
      if (adj.has(a) && adj.has(b)) {
        adj.get(a)!.add(b);
        adj.get(b)!.add(a);
      }
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const seed = () => {
      const large = nodes.filter((n) => n.r >= 40);
      const medium = nodes.filter((n) => n.r >= 28 && n.r < 40);
      const small = nodes.filter((n) => n.r < 28);

      const anchors: [number, number][] = [
        [0.22, 0.35],
        [0.78, 0.32],
        [0.26, 0.72],
        [0.74, 0.7],
      ];
      large.forEach((n, i) => {
        const [ax, ay] = anchors[i % anchors.length];
        n.x = W * ax;
        n.y = H * ay;
      });

      const medAnchors: [number, number][] = [
        [0.5, 0.22],
        [0.5, 0.78],
        [0.12, 0.5],
        [0.88, 0.5],
        [0.38, 0.5],
        [0.62, 0.5],
      ];
      medium.forEach((n, i) => {
        const [ax, ay] = medAnchors[i % medAnchors.length];
        n.x = W * ax + (Math.random() - 0.5) * 60;
        n.y = H * ay + (Math.random() - 0.5) * 60;
      });

      const cols = 6;
      const rows = 3;
      const padX = 80;
      const padY = 60;
      const cellW = (W - padX * 2) / (cols - 1);
      const cellH = (H - padY * 2) / (rows - 1);
      small.forEach((n, i) => {
        const c = i % cols;
        const row = Math.floor(i / cols) % rows;
        n.x = padX + c * cellW + (Math.random() - 0.5) * 40;
        n.y = padY + row * cellH + (Math.random() - 0.5) * 40;
      });

      nodes.forEach((n) => {
        n.vx = (Math.random() - 0.5) * 0.3;
        n.vy = (Math.random() - 0.5) * 0.3;
      });
    };
    seed();

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener('resize', onResize);

    let mx = -999;
    let my = -999;
    let hoverId: string | null = null;
    let dragging: SimNode | null = null;
    let dragOffX = 0;
    let dragOffY = 0;

    const pick = (px: number, py: number): SimNode | null => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const dx = px - n.x;
        const dy = py - n.y;
        if (dx * dx + dy * dy < (n.r + 6) * (n.r + 6)) return n;
      }
      return null;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (dragging) {
        dragging.x = mx + dragOffX;
        dragging.y = my + dragOffY;
        dragging.vx = 0;
        dragging.vy = 0;
      }
      const hit = dragging ?? pick(mx, my);
      hoverId = hit ? hit.id : null;
      if (hit && tip) {
        tip.style.display = 'block';
        const tx = Math.min(hit.x + 20, W - 140);
        const ty = Math.max(hit.y - 40, 8);
        tip.style.left = `${tx}px`;
        tip.style.top = `${ty}px`;
        tip.innerHTML = `<strong>${hit.label}</strong><span>${hit.yrs} YR${
          hit.yrs > 1 ? 'S' : ''
        } · ${hit.freq}</span>`;
      } else if (tip) {
        tip.style.display = 'none';
      }
      canvas.style.cursor = dragging ? 'grabbing' : hit ? 'grab' : 'default';
    };

    const onLeave = () => {
      mx = my = -999;
      if (!dragging) {
        hoverId = null;
        if (tip) tip.style.display = 'none';
      }
    };

    const onDown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const hit = pick(px, py);
      if (hit) {
        dragging = hit;
        dragOffX = hit.x - px;
        dragOffY = hit.y - py;
        canvas.style.cursor = 'grabbing';
      }
    };

    const onUp = () => {
      if (dragging) {
        dragging.vx = 0;
        dragging.vy = 0;
        dragging = null;
      }
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const REPEL = 1800;
    const LINK_K = 0.01;
    const LINK_REST = 130;
    const CENTER_K = 0.0012;
    const DAMP = 0.88;
    const DRIFT = 0.012;

    let raf = 0;
    let running = true;
    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const step = () => {
      const cx = W / 2;
      const cy = H / 2;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a === dragging) continue;
        a.vx += (cx - a.x) * CENTER_K;
        a.vy += (cy - a.y) * CENTER_K;
        if (!reduced) {
          a.vx += (Math.random() - 0.5) * DRIFT;
          a.vy += (Math.random() - 0.5) * DRIFT;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy + 0.01;
          const d = Math.sqrt(d2);
          const minD = a.r + b.r + 14;
          const f = REPEL / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          if (a !== dragging) {
            a.vx += fx;
            a.vy += fy;
          }
          if (b !== dragging) {
            b.vx -= fx;
            b.vy -= fy;
          }
          if (d < minD) {
            const push = (minD - d) * 0.5;
            if (a !== dragging) {
              a.x += (dx / d) * push;
              a.y += (dy / d) * push;
            }
            if (b !== dragging) {
              b.x -= (dx / d) * push;
              b.y -= (dy / d) * push;
            }
          }
        }
      }
      for (const [aId, bId] of EDGES) {
        const a = byId.get(aId);
        const b = byId.get(bId);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const diff = d - LINK_REST;
        const fx = (dx / d) * diff * LINK_K;
        const fy = (dy / d) * diff * LINK_K;
        if (a !== dragging) {
          a.vx += fx;
          a.vy += fy;
        }
        if (b !== dragging) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      const pad = 24;
      for (const n of nodes) {
        if (n === dragging) continue;
        n.vx *= DAMP;
        n.vy *= DAMP;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < n.r + pad) {
          n.x = n.r + pad;
          n.vx = Math.abs(n.vx) * 0.3;
        }
        if (n.x > W - n.r - pad) {
          n.x = W - n.r - pad;
          n.vx = -Math.abs(n.vx) * 0.3;
        }
        if (n.y < n.r + pad) {
          n.y = n.r + pad;
          n.vy = Math.abs(n.vy) * 0.3;
        }
        if (n.y > H - n.r - pad) {
          n.y = H - n.r - pad;
          n.vy = -Math.abs(n.vy) * 0.3;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const neighbors = hoverId ? adj.get(hoverId) ?? null : null;
      const isDimmed = (id: string) => !!hoverId && id !== hoverId && !neighbors?.has(id);

      for (const [aId, bId] of EDGES) {
        const a = byId.get(aId);
        const b = byId.get(bId);
        if (!a || !b) continue;
        const connectedHover = !!hoverId && (aId === hoverId || bId === hoverId);
        const dimmed = !!hoverId && !connectedHover;
        ctx.lineWidth = connectedHover ? 1 : 0.5;
        ctx.strokeStyle = connectedHover
          ? 'rgba(242,135,5,0.60)'
          : dimmed
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const n of nodes) {
        const c = CAT_COLOR[n.cat];
        const dimmed = isDimmed(n.id);
        const isHover = n.id === hoverId;
        const alpha = dimmed ? 0.22 : 1;

        if (isHover) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 14, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(n.x, n.y, n.r, n.x, n.y, n.r + 22);
          g.addColorStop(
            0,
            c.stroke.startsWith('#')
              ? `${c.stroke}66`
              : c.stroke.replace(/,\s*[\d.]+\)/, ',0.45)'),
          );
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = c.fill;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.lineWidth = isHover ? 1.5 : 1;
        ctx.strokeStyle = c.stroke;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = dimmed ? 0.35 : 1;
        ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (n.r >= 28) {
          ctx.fillStyle = c.label;
          ctx.fillText(n.label, n.x, n.y);
        } else {
          const ly = n.y + n.r + 10;
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(11,11,13,0.85)';
          ctx.strokeText(n.label, n.x, ly);
          ctx.fillStyle = c.label;
          ctx.fillText(n.label, n.x, ly);
        }
        ctx.globalAlpha = 1;
      }
    };

    const loop = () => {
      if (running) step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <section id="stack" className="stack" ref={ref} data-screen-label="05 Stack">
      <SectionHead
        index="05 /"
        eyebrow="STACK · TECH GRAPH"
        title={
          <>
            <span>Tools I </span>
            <em className="stack-em">reach for.</em>
          </>
        }
      />
      <p className="mono stack-sub">Hover a node to explore connections.</p>

      <div className="graph-wrap" ref={containerRef}>
        <canvas ref={canvasRef} className="graph-canvas" />
        <div ref={tipRef} className="graph-tip mono" />
        <div className="graph-vignette" aria-hidden />
      </div>

      <p className="graph-hint mono">drag · hover · explore</p>

      <div className="stack-legend mono">
        <span>
          <i className="lg lg-lang" /> LANGUAGES
        </span>
        <span>
          <i className="lg lg-fw" /> FRAMEWORKS
        </span>
        <span>
          <i className="lg lg-be" /> BACKEND
        </span>
        <span>
          <i className="lg lg-data" /> DATA
        </span>
        <span>
          <i className="lg lg-infra" /> INFRA
        </span>
        <span>
          <i className="lg lg-tool" /> TOOLS
        </span>
      </div>
    </section>
  );
}
