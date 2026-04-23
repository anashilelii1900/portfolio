import { motion } from 'framer-motion';
import styles from './Services.module.css';

const SERVICES = [
  {
    id: 's1', icon: '🖥️', size: 'large',
    title: 'Web Development',
    desc: 'High-performance, SEO-optimized web applications built with React, Next.js and Node.js. From MVPs to enterprise-grade platforms.',
  },
  {
    id: 's2', icon: '🎨', size: 'medium',
    title: 'UI/UX Design',
    desc: 'Pixel-perfect interfaces with a premium feel. Figma prototyping and design systems.',
  },
  {
    id: 's3', icon: '⚡', size: 'small',
    title: 'Performance',
    desc: 'Audits & optimization',
  },
  {
    id: 's4', icon: '📱', size: 'medium',
    title: 'Mobile-First',
    desc: 'Fully responsive layouts that feel native on every device.',
  },
  {
    id: 's5', icon: '🔌', size: 'small',
    title: 'API / Backend',
    desc: 'REST & GraphQL',
  },
];

export default function Services() {
  return (
    <section className={styles.section} id="services">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        What I Do
      </motion.h2>

      <div className={styles.grid}>
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.id}
            className={`${styles.card} ${styles[s.size]}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, borderColor: 'var(--border-hover)' }}
          >
            <div className={styles.icon}>{s.icon}</div>
            <h3 className={styles.title}>{s.title}</h3>
            <p className={styles.desc}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
