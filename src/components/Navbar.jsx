import styles from './Navbar.module.css';

export default function Navbar({ darkMode, toggleTheme }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>AH.</div>
      <nav className={styles.links}>
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>

        {/* Dark / Light toggle */}
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <a href="#contact" className={styles.cta}>Hire Me</a>
      </nav>
    </header>
  );
}
