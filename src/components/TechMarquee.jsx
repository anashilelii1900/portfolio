import styles from './TechMarquee.module.css';

const TOOLS = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'Figma',
  'Framer Motion', 'Tailwind', 'GraphQL', 'Docker', 'Vite',
];

export default function TechMarquee() {
  const items = [...TOOLS, ...TOOLS]; // duplicate for seamless loop
  return (
    <section className={styles.wrapper}>
      <div className={styles.track}>
        {items.map((t, i) => (
          <span key={i} className={styles.item}>
            {t}
            <span className={styles.dot} aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
