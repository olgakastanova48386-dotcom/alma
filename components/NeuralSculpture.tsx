"use client";

import { useEffect, useRef } from "react";

const vertexShader = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * .5 + .5;
  gl_Position = vec4(a_position, 0., 1.);
}`;

// The original reference supplies the intricate glass material. Its petals
// move independently through a fragment displacement field. The dark page
// and editorial text in the supplied screenshot are keyed out.
const fragmentShader = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_reference;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

float petal(vec2 p, vec2 center, vec2 radius) {
  float d = length((p - center) / radius);
  return 1. - smoothstep(.72, 1.13, d);
}

void main() {
  vec2 screen = vec2(v_uv.x, 1. - v_uv.y) * u_resolution;
  float displayHeight = u_resolution.x * 2048. / 1152.;
  float offsetY = (u_resolution.y - displayHeight) * .20;
  vec2 source = (screen - vec2(0., offsetY)) * 1152. / u_resolution.x;

  float top = petal(source, vec2(570., 495.), vec2(255., 288.));
  float left = petal(source, vec2(315., 600.), vec2(292., 283.));
  float right = petal(source, vec2(842., 622.), vec2(298., 278.));
  float lowerLeft = petal(source, vec2(410., 910.), vec2(292., 270.));
  float lowerRight = petal(source, vec2(787., 914.), vec2(308., 278.));
  float bloom = max(max(top, left), max(right, max(lowerLeft, lowerRight)));
  float heart = petal(source, vec2(565., 719.), vec2(205., 190.));
  float stem = petal(source, vec2(560., 1260.), vec2(95., 560.));
  float leafLeft = petal(source, vec2(312., 1250.), vec2(245., 175.));
  float leafRight = petal(source, vec2(805., 1230.), vec2(255., 175.));
  float specimen = max(max(bloom, heart), max(stem, max(leafLeft, leafRight)));

  // Fix the center and let the outer surfaces unfurl by a few pixels.
  float tip = smoothstep(115., 390., distance(source, vec2(560., 735.)));
  float t = u_time;
  source = vec2(560., 735.) + (source - vec2(560., 735.)) *
    (1. - .015 * sin(t * .7));
  vec2 displacement = vec2(0.);
  displacement += top * vec2(sin(t * .83) * 34., cos(t * .72) * 31.);
  displacement += left * vec2(sin(t * .68 + 1.5) * 43., cos(t * .8 + 1.5) * 26.);
  displacement += right * vec2(sin(t * .7 + 3.2) * 41., cos(t * .76 + 3.2) * 28.);
  displacement += lowerLeft * vec2(sin(t * .74 + 2.3) * 32., cos(t * .64 + 2.3) * 28.);
  displacement += lowerRight * vec2(sin(t * .79 + 4.2) * 32., cos(t * .71 + 4.2) * 25.);
  displacement *= tip * .78;
  displacement += u_pointer * (12. + 24. * tip);
  displacement.x += sin(source.y * .045 + t * 1.2 + source.x * .008) * bloom * tip * 4.;
  source -= displacement;

  vec2 uv = vec2(source.x / 1152., 1. - source.y / 2048.);
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) discard;
  vec3 color = texture(u_reference, uv).rgb;
  float brightness = max(color.r, max(color.g, color.b));
  float alpha = smoothstep(.07, .265, brightness) * specimen;
  // Moving light travels across the real cyan and lilac filaments.
  float shimmer = .5 + .5 * sin(source.x * .026 - source.y * .014 + t * 1.15);
  color += vec3(.032, .12, .14) * shimmer * bloom * brightness;
  color += vec3(.09, .023, .11) * (1. - shimmer) * bloom * brightness;
  outColor = vec4(color * 1.04, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function NeuralSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const geometry = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geometry);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.uniform1i(gl.getUniformLocation(program, "u_reference"), 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const pointerUniform = gl.getUniformLocation(program, "u_pointer");
    const clock = gl.getUniformLocation(program, "u_time");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();
    let loaded = false, visible = true, disposed = false, frame = 0;
    let aimX = 0, aimY = 0, pointerX = 0, pointerY = 0;
    const start = performance.now();
    const render = (now: number) => {
      if (disposed || !loaded) return;
      pointerX += (aimX - pointerX) * .065;
      pointerY += (aimY - pointerY) * .065;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointerUniform, pointerX, pointerY);
      gl.uniform1f(clock, motion.matches ? 0 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!motion.matches && visible) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      loaded = true;
      resize();
    };
    image.src = "/images/alma-holographic-flower-reference.png";

    const onMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      aimX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      aimY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    };
    const onLeave = () => { aimX = 0; aimY = 0; };
    const watchMotion = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(render);
    });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    motion.addEventListener("change", watchMotion);
    return () => {
      disposed = true;
      image.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      motion.removeEventListener("change", watchMotion);
      gl.deleteTexture(texture);
      gl.deleteBuffer(geometry);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="alma-neural-canvas alma-reference-flower-canvas" aria-hidden="true" />;
}
