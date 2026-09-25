"use client";

import { useEffect, useRef } from "react";

// The supplied reference itself is the specimen. We only crop it in CSS
// and move its layer gently; no substitute rendering or generated asset.
export default function NeuralSculpture() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const onMove = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      frame.style.setProperty("--flower-x", `${x * 11}px`);
      frame.style.setProperty("--flower-y", `${y * 8}px`);
    };
    const onLeave = () => {
      frame.style.setProperty("--flower-x", "0px");
      frame.style.setProperty("--flower-y", "0px");
    };
    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={frameRef} className="alma-neural-canvas alma-reference-flower">
      <img
        src="/images/alma-holographic-flower-reference.png"
        alt=""
        className="alma-reference-flower-image"
        draggable={false}
      />
      <span className="alma-reference-flower-light" aria-hidden="true" />
    </div>
  );
}
