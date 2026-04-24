import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const LINES = [
  { type: 'comment', text: '// anas_hileli.js — loading...' },
  { type: 'prompt', label: '~', text: 'const developer = {' },
  { type: 'key',    text: '  name:       "Anas Hileli",' },
  { type: 'key',    text: '  role:       "Full-Stack Dev",' },
  { type: 'key',    text: '  passion:    "Digital Craft",' },
  { type: 'key',    text: '  available:  true,' },
  { type: 'prompt', label: '~', text: '};' },
  { type: 'comment', text: '' },
  { type: 'comment', text: '// Running build...' },
  { type: 'success', text: '✓ Build complete — ready to ship.' },
];

export default function Hero() {
  const terminalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    let t;
    function printNext() {
      if (!terminalRef.current) return;
      const i = indexRef.current;
      if (i >= LINES.length) return;

      const el = document.createElement('div');
      el.className = styles.termLine;
      const line = LINES[i];
      if (line.type === 'comment') el.style.color = '#6a9955';
      if (line.type === 'success') el.style.color = '#00ff9d';
      if (line.type === 'prompt')  el.innerHTML = `<span style="color:var(--accent)">${line.label} $</span> ${line.text}`;
      else el.textContent = line.text;

      terminalRef.current.appendChild(el);
      indexRef.current++;
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      t = setTimeout(printNext, 130 + Math.random() * 80);
    }

    t = setTimeout(printNext, 800);
    return () => clearTimeout(t);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: i => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <motion.p
          className={styles.greeting}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Hi, I&apos;m
        </motion.p>

        {['Anas', 'Hileli.'].map((word, i) => (
          <motion.h1
            key={word}
            className={styles.name}
            custom={i}
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {i === 1 ? <span className={styles.accent}>{word}</span> : word}
          </motion.h1>
        ))}

        <motion.h2
          className={styles.tagline}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          I build digital experiences.
        </motion.h2>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <span className={styles.scrollLabel}>scroll to explore</span>
          <div className={styles.scrollLine} />
        </motion.div>
      </div>

      <motion.div
        className={styles.right}
        initial={{ opacity: 0, scale: 0.95, x: 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.terminal}>
          <div className={styles.termHead}>
            <div className={styles.dots}>
              <span className={styles.red} />
              <span className={styles.yellow} />
              <span className={styles.green} />
            </div>
            <span className={styles.termTitle}>anas_hileli@dev: ~</span>
          </div>
          <div className={styles.termBody} ref={terminalRef}>
            <span className={styles.cursor} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
