import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import './index.css';
import './App.css';

import Loader          from './components/Loader';
import CustomCursor    from './components/CustomCursor';
import ScrollProgress  from './components/ScrollProgress';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import TechMarquee     from './components/TechMarquee';
import About           from './components/About';
import BentoGrid       from './components/BentoGrid';
import Services        from './components/Services';
import Timeline        from './components/Timeline';
import Testimonials    from './components/Testimonials';
import Contact         from './components/Contact';
import ContactModal    from './components/ContactModal';
import Footer          from './components/Footer';

export default function App() {
  const [loading, setLoading]       = useState(true);
  const [darkMode, setDarkMode]     = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);

  // ── Lenis smooth scroll ──
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smooth: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // ── Theme class on root ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <CustomCursor />
      <ScrollProgress />

      <div className="noise" aria-hidden="true" />
      <div className="gradient-blob blob-1" aria-hidden="true" />
      <div className="gradient-blob blob-2" aria-hidden="true" />

      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(d => !d)} />

      <main>
        <Hero />
        <TechMarquee />
        <About />
        <BentoGrid />
        <Services />
        <Timeline />
        <Testimonials />
        <Contact onOpenModal={() => setModalOpen(true)} />
      </main>

      <Footer />

      {/* Gmail-style compose modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
