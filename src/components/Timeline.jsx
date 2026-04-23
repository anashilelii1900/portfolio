import { motion } from 'framer-motion';
import styles from './Timeline.module.css';

const EVENTS = [
  {
    id: 'e1', year: '2026', side: 'right',
    title: 'Senior Full-Stack Developer',
    company: 'TechFlow Inc.',
    desc: 'Leading a team of 5 engineers building a SaaS fintech platform serving 100k+ users.',
  },
  {
    id: 'e2', year: '2024', side: 'left',
    title: 'Frontend Engineer',
    company: 'Creative Studio',
    desc: 'Built immersive 3D web experiences and design systems for luxury brands.',
  },
  {
    id: 'e3', year: '2023', side: 'right',
    title: 'Full-Stack Developer',
    company: 'Freelance',
    desc: 'Delivered 10+ projects across e-commerce, SaaS, and portfolio clients globally.',
  },
  {
    id: 'e4', year: '2022', side: 'left',
    title: 'Computer Science Degree',
    company: 'University',
    desc: 'Graduated with honors, specializing in software engineering and human-computer interaction.',
  },
];

export default function Timeline() {
  return (
    <section className={styles.section} id="experience">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Experience
      </motion.h2>

      <div className={styles.timeline}>
        <div className={styles.line} />
        {EVENTS.map((ev, i) => (
          <motion.div
            key={ev.id}
            className={`${styles.item} ${styles[ev.side]}`}
            initial={{ opacity: 0, x: ev.side === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.card}>
              <span className={styles.year}>{ev.year}</span>
              <h3 className={styles.title}>{ev.title}</h3>
              <span className={styles.company}>{ev.company}</span>
              <p className={styles.desc}>{ev.desc}</p>
            </div>
            <div className={styles.dot} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
