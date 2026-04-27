import { useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import styles from './BentoGrid.module.css';
import vehicleImg from '../assets/vehicle_rental.png';
import devDuelImg from '../assets/dev_duel.png';
import medscriptImg from '../assets/medscript.png';
import fluxifyImg from '../assets/fluxify.png';

const PROJECTS = [
  {
    id: 'p1',
    size: 'large',
    tag: 'PHP · MVC · MySQL',
    title: 'VELOX Rental System',
    desc: 'Premium vehicle rental platform with a burgundy glassmorphic UI and robust MVC architecture.',
    image: vehicleImg,
    link: '#',
  },
  {
    id: 'p2',
    size: 'medium',
    tag: 'React · Socket.io · Framer',
    title: 'Dev-Duel',
    desc: 'Cyber-premium competitive coding arena with real-time match simulations and global leaderboards.',
    image: devDuelImg,
    link: '#',
  },
  {
    id: 'p3',
    size: 'stat',
    stat: '100%',
    label: 'Code Coverage',
    accent: true,
  },
  {
    id: 'p4',
    size: 'medium',
    tag: 'JavaScript · Parser',
    title: 'Medscript Parser',
    desc: 'Custom syntax parser for medical records, implementing "creer_patient" clinical data processing.',
    image: medscriptImg,
    link: '#',
  },
  {
    id: 'p5',
    size: 'stat',
    stat: '99.9%',
    label: 'Uptime achieved',
  },
  {
    id: 'p6',
    size: 'large',
    tag: 'JS · Meta-Programming',
    title: 'Fluxify Template Engine',
    desc: 'A high-performance JS-based component system with dynamic scope injection and automatic class tagging.',
    image: fluxifyImg,
    link: '#',
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
