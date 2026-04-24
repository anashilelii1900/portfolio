import { useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import styles from './BentoGrid.module.css';

const PROJECTS = [
  {
    id: 'p1',
    size: 'large',
    tag: 'Next.js · 2026',
    title: 'Fintech Dashboard',
    desc: 'Comprehensive analytics suite with real-time data visualization and biometric auth.',
    link: '#',
  },
  {
    id: 'p2',
    size: 'medium',
    tag: 'React · WebGL',
    title: 'Immersive Architecture',
    desc: '3D interactive portfolio for a luxury architecture firm.',
    link: '#',
  },
  {
    id: 'p3',
    size: 'stat',
    stat: '10+',
    label: 'Projects Delivered',
  },
  {
    id: 'p4',
    size: 'medium',
    tag: 'TypeScript · Node',
    title: 'SaaS Platform',
    desc: 'Scalable backend supporting 50k+ daily active users.',
    link: '#',
  },
  {
    id: 'p5',
    size: 'stat',
    stat: '99%',
    label: 'Client Satisfaction',
    accent: true,
  },
];

function BentoCard({ project, index }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  const glow = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0,240,255,0.08), transparent 40%)`;

  const isStat = project.size === 'stat';

  return (
    <motion.div
      className={`${styles.card} ${styles[project.size]} ${project.accent ? styles.accentCard : ''}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { y: 0 },
        hover: { y: -6 }
      }}
    >
      {/* Glow overlay */}
      <motion.div className={styles.glowOverlay} style={{ background: glow }} />

      {isStat ? (
        <div className={styles.statContent}>
          <span className={styles.statNum}>{project.stat}</span>
          <span className={styles.statLabel}>{project.label}</span>
        </div>
      ) : (
        <>
          <motion.div 
            className={styles.imageGroup}
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.image && <img src={project.image} className={styles.cardImg} alt={project.title} />}
          </motion.div>
          <div className={styles.cardContent}>
            <span className={styles.tag}>{project.tag}</span>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardDesc}>{project.desc}</p>
          </div>
          <motion.a
            href={project.link}
            className={styles.viewBtn}
            initial={{ opacity: 0, scale: 0.6 }}
            variants={{ hover: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.3 }}
          >
            ↗
          </motion.a>
        </>
      )}
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section className={styles.section} id="work">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        Selected Works
      </motion.h2>
      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <BentoCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
