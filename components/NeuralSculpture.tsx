"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

export default function NeuralSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let width = 0, height = 0, frame = 0, visible = true;
    let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0;

    function stroke(points: Point[], color: string, lineWidth = 1) {
      if (!ctx || !points.length) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    function draw(now: number) {
      if (!ctx || !width || !height) return;
      const time = motion.matches ? 0 : (now - start) / 1000;
      pointerX += (aimX - pointerX) * .055;
      pointerY += (aimY - pointerY) * .055;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width * .51 + pointerX * 10, height * .48 + pointerY * 7);
      const scale = Math.min(width / 470, height / 420);
      ctx.scale(scale, scale);

      // Delicate geometry sits behind the flower like an instrument display.
      ctx.strokeStyle = "#a9b6df1b";
      ctx.lineWidth = .7;
      for (const radius of [112, 167, 212]) {
        ctx.beginPath();
        ctx.arc(0, -10, radius, -Math.PI * .91, Math.PI * .61);
        ctx.stroke();
      }
      for (let n = -2; n <= 2; n++) {
        stroke([{ x: n * 84, y: -208 }, { x: n * 84, y: 196 }], "#a9b6df0d");
        stroke([{ x: -230, y: n * 82 }, { x: 230, y: n * 82 }], "#a9b6df0d");
      }

      // Stem and a pair of translucent leaves.
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-13, 64, -10, 128, 12, 217);
      ctx.strokeStyle = "#a9e1f078";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#7dd9f5";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ecedffab";
      ctx.stroke();
      for (const side of [-1, 1]) {
        const tip = { x: side * 129, y: 125 + side * 22 };
        ctx.beginPath();
        ctx.moveTo(side * 2, 133);
        ctx.bezierCurveTo(side * 45, 92, side * 97, 86 + side * 14, tip.x, tip.y);
        ctx.bezierCurveTo(side * 111, 158 + side * 18, side * 65, 185, side * 2, 133);
        const fill = ctx.createLinearGradient(0, 120, tip.x, 160);
        fill.addColorStop(0, "#867bb234");
        fill.addColorStop(.62, side < 0 ? "#36e6f940" : "#c792f440");
        fill.addColorStop(1, "#80cdea18");
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = "#b7dafa78";
        ctx.stroke();
        for (let v = 1; v < 10; v++) {
          const t = v / 10, x = side * (8 + t * 113);
          const y = 135 - 23 * Math.sin(t * Math.PI) + side * t * 16;
          stroke([{ x: side * 6, y: 136 }, { x, y }], "#b8e9ff2b", .7);
          stroke([{ x: side * 6, y: 136 }, { x, y: y + 18 * Math.sin(t * Math.PI) }], "#b8e9ff25", .7);
        }
      }

      // Five broad petals are drawn as deforming, translucent wire meshes.
      const petals = [
        { angle: -Math.PI / 2, length: 170, breadth: 88, phase: 0 },
        { angle: -2.62, length: 170, breadth: 90, phase: 1.8 },
        { angle: -.53, length: 170, breadth: 90, phase: 3.4 },
        { angle: 2.37, length: 157, breadth: 82, phase: 2.6 },
        { angle: .77, length: 157, breadth: 82, phase: 4.8 },
      ];
      petals.forEach((petal, index) => {
        const breathe = 1 + Math.sin(time * .7 + petal.phase) * .025;
        const angle = petal.angle + Math.sin(time * .46 + petal.phase) * .025 + pointerX * .035;
        const axis = { x: Math.cos(angle), y: Math.sin(angle) };
        const across = { x: -axis.y, y: axis.x };
        const point = (u: number, v: number): Point => {
          const spread = Math.pow(Math.sin(Math.PI * u), .56) * petal.breadth;
          const ripple = Math.sin(u * 16 + v * 4 + time * .85 + petal.phase) * (3 + 4 * u);
          const radius = u * petal.length * breathe + ripple * Math.abs(v);
          const widthAt = spread * v * (1 + .09 * Math.sin(u * 11 + time * .6 + petal.phase));
          return {
            x: axis.x * radius + across.x * widthAt + pointerX * u * 3,
            y: axis.y * radius + across.y * widthAt + Math.sin(u * Math.PI) * v * v * 9,
          };
        };
        const edge: Point[] = [];
        for (let i = 0; i <= 48; i++) edge.push(point(i / 48, -1));
        for (let i = 48; i >= 0; i--) edge.push(point(i / 48, 1));
        ctx.beginPath();
        ctx.moveTo(edge[0].x, edge[0].y);
        edge.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, 0, axis.x * petal.length, axis.y * petal.length);
        fill.addColorStop(0, "#b9a3da4d");
        fill.addColorStop(.32, index % 2 ? "#b478d45d" : "#63bff066");
        fill.addColorStop(.68, index % 2 ? "#56e9f586" : "#d6a4f292");
        fill.addColorStop(1, "#74dffd40");
        ctx.fillStyle = fill;
        ctx.shadowColor = index % 2 ? "#a380ed88" : "#64def488";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#b8dfffab";
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.globalCompositeOperation = "screen";
        for (let i = 1; i < 20; i++) {
          const row: Point[] = [];
          for (let j = 0; j <= 22; j++) row.push(point(i / 20, j / 11 - 1));
          stroke(row, i % 4 === 0 ? "#c9ddff5b" : "#c0d5fc36", .65);
        }
        for (let j = -10; j <= 10; j++) {
          const strand: Point[] = [];
          for (let i = 0; i <= 28; i++) strand.push(point(i / 28, j / 10));
          stroke(strand, j % 5 === 0 ? "#d7e6ff70" : "#b8d9ff3f", .65);
        }
        for (let band = 0; band < 3; band++) {
          const u = .57 + band * .115 + .018 * Math.sin(time * .6 + petal.phase);
          const stripe: Point[] = [];
          for (let j = -14; j <= 14; j++) stripe.push(point(u + .034 * Math.sin(j * .2 + band), j / 17));
          ctx.shadowColor = band === 1 ? "#fc8edb" : "#56f7ff";
          ctx.shadowBlur = 14;
          stroke(stripe, band === 1 ? "#f59bd68a" : "#77f7ffad", band === 0 ? 6 : 3.5);
          ctx.shadowBlur = 0;
        }
        ctx.globalCompositeOperation = "source-over";
      });

      // Fine glowing stamens make the center unmistakably botanical.
      const heart = ctx.createRadialGradient(0, 0, 0, 0, 0, 42);
      heart.addColorStop(0, "#ffffffd9");
      heart.addColorStop(.38, "#e6b1ef91");
      heart.addColorStop(1, "#ebceff00");
      ctx.fillStyle = heart;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 17; i++) {
        const angle = -Math.PI + i / 16 * Math.PI * 1.95;
        const distance = 32 + (i * 19) % 31;
        const x = Math.cos(angle) * distance, y = Math.sin(angle) * distance * .76 - 6;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.quadraticCurveTo(x * .45, y * .15 - 14, x, y);
        ctx.strokeStyle = "#e4f6ffb5";
        ctx.lineWidth = i % 3 === 0 ? 1.6 : .95;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y, 2.8, 5, angle, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? "#a6faff" : "#f3dcff";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 9;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
      if (!motion.matches && visible) frame = requestAnimationFrame(draw);
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (motion.matches) draw(start);
    };
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      aimX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      aimY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    };
    const reset = () => { aimX = 0; aimY = 0; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    const watchMotion = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerleave", reset);
    motion.addEventListener("change", watchMotion);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", watchMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="alma-neural-canvas" aria-hidden="true" />;
}
