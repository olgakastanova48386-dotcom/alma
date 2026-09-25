"use client";

import { useEffect, useRef } from "react";

export default function NeuralSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let aimX = 0;
    let aimY = 0;
    const start = performance.now();
    const palette = [
      ["#f6a57c", "#e66f75", "#a95073"],
      ["#b8d7ce", "#72bdb8", "#547b9b"],
      ["#f4d098", "#ef9c72", "#bb6582"],
      ["#d5b8e5", "#a593d6", "#737eb7"],
      ["#c7e0ae", "#8bc49f", "#6b9d9f"],
    ];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (motion.matches) draw(start);
    };

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      aimX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      aimY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    };
    const reset = () => { aimX = 0; aimY = 0; };

    function draw(now: number) {
      if (!context || !width || !height) return;
      const time = motion.matches ? 0 : (now - start) / 1000;
      pointerX += (aimX - pointerX) * .065;
      pointerY += (aimY - pointerY) * .065;
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width / 510, height / 460);
      const centerX = width * .51 + pointerX * 17;
      const centerY = height * .51 + pointerY * 10;
      context.save();
      context.translate(centerX, centerY);
      context.scale(scale, scale);

      const glow = context.createRadialGradient(0, -8, 10, 0, -8, 190);
      glow.addColorStop(0, "#eec6d481");
      glow.addColorStop(.55, "#c3d9df4c");
      glow.addColorStop(1, "#e9eaec00");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(0, -8, 190, 0, Math.PI * 2);
      context.fill();

      // Five lit ribbons twist around each other. Their outlines and highlights
      // give the sculpture depth without an image or a video download.
      for (let layer = 0; layer < palette.length; layer++) {
        const phase = layer * 1.18;
        const depth = .72 + layer * .12;
        const points: { x: number; y: number; size: number }[] = [];
        for (let step = 0; step <= 44; step++) {
          const y = -165 + step * 7.5;
          const wave = Math.sin(y * .017 + phase + time * .43) * (59 + layer * 4);
          const curl = Math.cos(y * .031 - phase * .7 + time * .27) * 21;
          const x = wave + curl + (layer - 2) * 13 + pointerX * (layer - 2) * 11;
          const size = 11 + 18 * (1 + Math.sin(y * .022 - phase + time * .31)) / 2;
          points.push({ x, y, size: size * depth });
        }
        context.beginPath();
        points.forEach((p, index) => index ? context.lineTo(p.x - p.size, p.y) : context.moveTo(p.x - p.size, p.y));
        for (let index = points.length - 1; index >= 0; index--) {
          const p = points[index];
          context.lineTo(p.x + p.size, p.y);
        }
        context.closePath();
        const gradient = context.createLinearGradient(-140, -170, 130, 175);
        gradient.addColorStop(0, palette[layer][0]);
        gradient.addColorStop(.51, palette[layer][1]);
        gradient.addColorStop(1, palette[layer][2]);
        context.globalAlpha = .83;
        context.shadowColor = palette[layer][1] + "88";
        context.shadowBlur = 20;
        context.shadowOffsetY = 12;
        context.fillStyle = gradient;
        context.fill();
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;
        context.globalAlpha = .72;
        context.strokeStyle = "#ffffffaa";
        context.lineWidth = 2.2;
        context.beginPath();
        points.forEach((p, index) => index ? context.lineTo(p.x - p.size * .62, p.y) : context.moveTo(p.x - p.size * .62, p.y));
        context.stroke();
        context.globalAlpha = 1;
      }

      const nodes = Array.from({ length: 34 }, (_, index) => {
        const y = -145 + index * 9;
        const x = Math.sin(y * .026 + index * 1.7 + time * .3) * 95 + pointerX * 15;
        return { x, y, radius: index % 7 === 0 ? 4 : 2 };
      });
      context.lineWidth = 1;
      nodes.forEach((point, index) => {
        for (const other of nodes.slice(index + 1, index + 4)) {
          if (Math.hypot(point.x - other.x, point.y - other.y) > 112) continue;
          context.strokeStyle = "#ffffff72";
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
        context.fillStyle = index % 7 === 0 ? "#fffdf0" : "#ffffffb8";
        context.shadowColor = "#ffffff";
        context.shadowBlur = index % 7 === 0 ? 13 : 4;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      context.restore();
      if (!motion.matches && visible) frame = requestAnimationFrame(draw);
    }

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
