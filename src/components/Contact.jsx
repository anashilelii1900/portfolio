import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './Contact.module.css';

export default function Contact({ onOpenModal }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const springY = useSpring(y, { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const range = 180;
    if (dist < range) {
      const power = 1 - dist / range;
      x.set(dx * power * 0.5);
      y.set(dy * power * 0.5);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <section className={styles.contact} id="contact">
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Let&apos;s build something <br />
        <span className={styles.accent}>extraordinary.</span>
      </motion.h2>

      <motion.p
        className={styles.sub}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Available for freelance projects & collaborations.
      </motion.p>

      <div
        className={styles.magneticArea}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.button
          ref={ref}
          className={styles.btn}
          style={{ x: springX, y: springY }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenModal}
        >
          <span>Let&apos;s Talk</span>
          <div className={styles.btnGlow} />
        </motion.button>
      </div>
    </section>
  );
}
