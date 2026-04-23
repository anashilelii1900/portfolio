import { motion } from 'framer-motion';
import styles from './About.module.css';
import avatarImg from '../assets/avatar.png';

const SKILLS = [
  { label: 'React / Next.js', pct: 95 },
  { label: 'Node.js / Express', pct: 88 },
  { label: 'TypeScript', pct: 85 },
  { label: 'UI / UX Design', pct: 80 },
  { label: 'Database (SQL/NoSQL)', pct: 78 },
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        About Me
      </motion.h2>

      <div className={styles.grid}>
        {/* Bio */}
        <motion.div
          className={styles.bio}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className={styles.avatar}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img src={avatarImg} alt="Anas Hileli" />
          </motion.div>
          <h3 className={styles.name}>Anas Hileli</h3>
          <p className={styles.role}>Full-Stack Web Developer</p>
          <p className={styles.desc}>
            I&apos;m a passionate developer who loves turning complex problems into 
            elegant, pixel-perfect digital experiences. With a strong foundation 
            in both front-end and back-end technologies, I craft solutions that 
            are fast, scalable, and visually stunning.
          </p>
          <p className={styles.desc}>
            When I&apos;m not coding, you&apos;ll find me exploring new design trends, 
            contributing to open-source, or drinking way too much coffee ☕
          </p>
          <div className={styles.badges}>
            <span>🌍 Available Worldwide</span>
            <span>⚡ Fast Delivery</span>
            <span>💬 Clear Communication</span>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          className={styles.skills}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className={styles.skillsTitle}>Core Skills</h3>
          {SKILLS.map((s, i) => (
            <div key={s.label} className={styles.skill}>
              <div className={styles.skillTop}>
                <span>{s.label}</span>
                <span className={styles.pct}>{s.pct}%</span>
              </div>
              <div className={styles.track}>
                <motion.div
                  className={styles.skillBar}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
