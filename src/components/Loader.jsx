import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Loader.module.css';

/* ─── WebGL particle + ring engine ─────────────────────────────────────── */
function initGL(canvas, mouseRef) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
  if (!gl) return null;

  /* ── vertex shader ── */
  const vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vert, `
    attribute vec3 aPos;
    attribute float aSize;
    attribute float aAlpha;
    uniform mat4 uMVP;
    uniform float uTime;
    varying float vAlpha;
    void main(){
      vec3 p = aPos;
      p.x += sin(uTime * 0.8 + aPos.y * 1.4) * 0.04;
      p.y += cos(uTime * 0.6 + aPos.x * 1.2) * 0.04;
      gl_Position = uMVP * vec4(p, 1.0);
      gl_PointSize = aSize * (1.0 + 0.3 * sin(uTime * 2.0 + aAlpha * 6.28));
      vAlpha = aAlpha;
    }
  `);
  gl.compileShader(vert);

  /* ── fragment shader ── */
  const frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frag, `
    precision mediump float;
    varying float vAlpha;
    uniform vec3 uColor;
    void main(){
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float a = 1.0 - smoothstep(0.6, 1.0, d);
      gl_FragColor = vec4(uColor, a * vAlpha);
    }
  `);
  gl.compileShader(frag);

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  /* ── particle geometry ── */
  const N = 420;
  const pos   = new Float32Array(N * 3);
  const sizes = new Float32Array(N);
  const alphas= new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 0.55 + Math.random() * 0.9;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
    sizes[i]   = 2.5 + Math.random() * 4;
    alphas[i]  = 0.15 + Math.random() * 0.7;
  }

  const bufPos  = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufPos);
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

  const bufSz = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSz);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  const aSz = gl.getAttribLocation(prog, 'aSize');
  gl.enableVertexAttribArray(aSz);
  gl.vertexAttribPointer(aSz, 1, gl.FLOAT, false, 0, 0);

  const bufAl = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufAl);
  gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.STATIC_DRAW);
  const aAl = gl.getAttribLocation(prog, 'aAlpha');
  gl.enableVertexAttribArray(aAl);
  gl.vertexAttribPointer(aAl, 1, gl.FLOAT, false, 0, 0);

  /* ── ring geometry (lines) ── */
  const RING_SEG = 120;
  const rings = [0.72, 0.95, 1.18].map((rad, ri) => {
    const verts = [];
    const tilt  = ri * 0.52;
    for (let j = 0; j <= RING_SEG; j++) {
      const a = (j / RING_SEG) * Math.PI * 2;
      verts.push(
        rad * Math.cos(a),
        rad * Math.sin(a) * Math.cos(tilt),
        rad * Math.sin(a) * Math.sin(tilt)
      );
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    return { buf, count: RING_SEG + 1 };
  });

  /* ── uniforms ── */
  const uMVP   = gl.getUniformLocation(prog, 'uMVP');
  const uTime  = gl.getUniformLocation(prog, 'uTime');
  const uColor = gl.getUniformLocation(prog, 'uColor');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  /* ── mat4 helpers ── */
  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    return [
      f/aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far+near)/(near-far), -1,
      0, 0, (2*far*near)/(near-far), 0
    ];
  }
  function rotY(a) {
    const c=Math.cos(a),s=Math.sin(a);
    return [c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1];
  }
  function rotX(a) {
    const c=Math.cos(a),s=Math.sin(a);
    return [1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1];
  }
  function translate(m, tx, ty, tz) {
    const r=[...m];
    r[12]=m[0]*tx+m[4]*ty+m[8]*tz+m[12];
    r[13]=m[1]*tx+m[5]*ty+m[9]*tz+m[13];
    r[14]=m[2]*tx+m[6]*ty+m[10]*tz+m[14];
    r[15]=m[3]*tx+m[7]*ty+m[11]*tz+m[15];
    return r;
  }
  function multiply(a, b) {
    const r = new Array(16).fill(0);
    for (let i=0;i<4;i++) for(let j=0;j<4;j++) for(let k=0;k<4;k++)
      r[i*4+j] += a[i*4+k]*b[k*4+j];
    return r;
  }

  let raf;
  let startT = performance.now();

  function draw() {
    const t = (performance.now() - startT) / 1000;
    const W = canvas.width, H = canvas.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* mouse tilt */
    const mx = mouseRef.current.x; // -1 … 1
    const my = mouseRef.current.y;

    const proj = perspective(1.0, W/H, 0.1, 100);
    const view = translate([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1], 0, 0, -3.2);
    const rx = rotX(t * 0.18 + my * 0.4);
    const ry = rotY(t * 0.26 + mx * 0.4);
    const rot = multiply(rx, ry);
    const mvp = multiply(multiply(proj, view), rot);

    gl.uniformMatrix4fv(uMVP, false, mvp);
    gl.uniform1f(uTime, t);

    /* draw particles */
    gl.uniform3f(uColor, 0.0, 0.94, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufSz);
    gl.vertexAttribPointer(aSz, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufAl);
    gl.vertexAttribPointer(aAl, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, N);

    /* draw rings */
    rings.forEach(({ buf, count }, ri) => {
      const ringRot = multiply(rx, rotY(t * (0.3 + ri * 0.15) + mx * 0.4));
      const ringMVP = multiply(multiply(proj, view), ringRot);
      gl.uniformMatrix4fv(uMVP, false, ringMVP);
      gl.uniform3f(uColor, 0.0, 0.85 - ri * 0.12, 1.0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.uniform1f(uTime, t + ri);
      gl.drawArrays(gl.LINE_STRIP, 0, count);
    });

    raf = requestAnimationFrame(draw);
  }

  draw();
  return () => cancelAnimationFrame(raf);
}

/* ─── Loader component ──────────────────────────────────────────────────── */
export default function Loader({ onDone }) {
  const [count,    setCount]    = useState(0);
  const [phase,    setPhase]    = useState('entering'); // entering | loading | exiting
  const [glitch,   setGlitch]   = useState(false);
  const canvasRef  = useRef(null);
  const mouseRef   = useRef({ x: 0, y: 0 });
  const glCleanup  = useRef(null);

  /* ── mouse tracking ── */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── WebGL canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    glCleanup.current = initGL(canvas, mouseRef);
    return () => {
      glCleanup.current?.();
      observer.disconnect();
    };
  }, []);

  /* ── glitch bursts ── */
  useEffect(() => {
    const ids = [];
    const burst = () => {
      setGlitch(true);
      ids.push(setTimeout(() => setGlitch(false), 120 + Math.random() * 80));
    };
    ids.push(setInterval(burst, 1400 + Math.random() * 800));
    return () => ids.forEach(clearInterval);
  }, []);

  /* ── progress counter ── */
  const doneRef = useRef(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(iv);
          if (!doneRef.current) {
            doneRef.current = true;
            setTimeout(() => {
              setPhase('exiting');
              setTimeout(onDone, 900);
            }, 500);
          }
          return 100;
        }
        const jump = Math.floor(Math.random() * 10 + 3);
        return Math.min(prev + jump, 100);
      });
    }, 55);
    return () => clearInterval(iv);
  }, [onDone]);

  /* ── phase transitions ── */
  useEffect(() => {
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('loading'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const pct = Math.min(count, 100);
  const isExiting = phase === 'exiting';

  /* ── text lines that type-write in ── */
  const INIT_LINES = [
    'Initializing renderer…',
    'Loading assets…',
    'Compiling shaders…',
    'Mounting components…',
    'Ready.',
  ];
  const lineIndex = Math.floor((pct / 100) * INIT_LINES.length);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className={styles.loader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── WebGL canvas (full screen) ── */}
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* ── scan-line overlay ── */}
          <div className={styles.scanlines} aria-hidden="true" />

          {/* ── vignette ── */}
          <div className={styles.vignette} aria-hidden="true" />

          {/* ── center HUD ── */}
          <div className={`${styles.hud} ${glitch ? styles.glitch : ''}`}>

            {/* logo ring */}
            <motion.div
              className={styles.logoRing}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.dot}
                  style={{ '--i': i, '--n': 12 }}
                />
              ))}
            </motion.div>

            {/* logo text */}
            <motion.div
              className={styles.logo}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              AH<span className={styles.dot2}>.</span>
            </motion.div>

            {/* percent */}
            <motion.div
              className={styles.percent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {String(pct).padStart(3, '0')}
              <span className={styles.pctSign}>%</span>
            </motion.div>

            {/* progress bar */}
            <div className={styles.barWrap}>
              <div className={styles.barTrack}>
                <motion.div
                  className={styles.barFill}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.08 }}
                />
                <motion.div
                  className={styles.barGlow}
                  animate={{ left: `${pct}%` }}
                  transition={{ duration: 0.08 }}
                />
              </div>
              <div className={styles.barTicks}>
                {[0,25,50,75,100].map(v => (
                  <span key={v} className={`${styles.tick} ${pct >= v ? styles.tickActive : ''}`} />
                ))}
              </div>
            </div>

            {/* init lines */}
            <div className={styles.initLog}>
              {INIT_LINES.slice(0, lineIndex + 1).map((line, i) => (
                <motion.div
                  key={i}
                  className={styles.logLine}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i === lineIndex ? 1 : 0.35, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={styles.logPrefix}>&gt; </span>
                  {line}
                  {i === lineIndex && <span className={styles.blink} />}
                </motion.div>
              ))}
            </div>

          </div>

          {/* ── corner decorations ── */}
          {['tl','tr','bl','br'].map(c => (
            <motion.div
              key={c}
              className={`${styles.corner} ${styles[c]}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          ))}

          {/* ── side labels ── */}
          <div className={styles.sideLabel} data-pos="left">
            PORTFOLIO — ANAS HILELI
          </div>
          <div className={styles.sideLabel} data-pos="right">
            v2.0 — FULL STACK
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
