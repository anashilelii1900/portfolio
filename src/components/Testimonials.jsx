import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    id: 't1',
    quote: "Anas delivered an absolutely stunning website that exceeded every expectation. His attention to detail and communication throughout the project was exceptional.",
    name: 'Sarah K.',
    role: 'CEO, TechFlow',
    avatar: 'SK',
  },
  {
    id: 't2',
    quote: "Working with Anas was a game-changer for our startup. He turned our rough ideas into a polished, high-converting platform in record time.",
    name: 'Marcus R.',
    role: 'Founder, LaunchPad',
    avatar: 'MR',
  },
  {
    id: 't3',
    quote: "The performance improvements alone were worth it — our load times dropped by 60%. The new design is getting constant compliments from our users.",
    name: 'Lena B.',
    role: 'Product Manager, Nexus',
    avatar: 'LB',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Kind Words
      </motion.h2>

      <div className={styles.grid}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, borderColor: 'var(--border-hover)' }}
          >
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={styles.author}>
              <div className={styles.avatar}>{t.avatar}</div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
