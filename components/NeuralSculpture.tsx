"use client";

import { useEffect, useRef } from "react";

export default function NeuralSculpture() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((event.clientX - r.left) / r.width - .5) * 18;
      const y = ((event.clientY - r.top) / r.height - .5) * 18;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const leave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="alma-liquid-scene" aria-hidden="true">
      <div className="alma-liquid alma-liquid-a" />
      <div className="alma-liquid alma-liquid-b" />
      <div className="alma-liquid-grain" />
      <div className="alma-liquid-word alma-liquid-word-top">ALMA</div>
      <div className="alma-liquid-word alma-liquid-word-bottom"><span>FEEL</span><span>THE CITY</span></div>
    </div>
  );
}
