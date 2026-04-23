import { useScroll, motion } from 'framer-motion';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className={styles.bar}
      style={{ scaleX: scrollYProgress }}
    />
  );
}
