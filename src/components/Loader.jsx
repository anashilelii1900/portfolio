import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Loader.module.css';

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onDone, 700);
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12 + 4);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.loader}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className={styles.inner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.logo}>AH.</div>
            <div className={styles.bar}>
              <motion.div
                className={styles.fill}
                animate={{ width: `${Math.min(count, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className={styles.percent}>{Math.min(count, 100)}%</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
