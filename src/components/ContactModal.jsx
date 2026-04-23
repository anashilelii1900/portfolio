import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactModal.module.css';

// Formspree API Endpoint
const FORMSPREE_URL = 'https://formspree.io/f/mgorrngq';

export default function ContactModal({ isOpen, onClose }) {
  // formRef no longer needed for FormSubmit AJAX — kept for potential future use

  const [fields, setFields] = useState({ from_name: '', reply_to: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [minimized, setMinimized] = useState(false);

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name:       fields.from_name,
          email:      fields.reply_to,
          subject:    fields.subject,
          message:    fields.message,
        }),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setMinimized(false);
    setFields({ from_name: '', reply_to: '', subject: '', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Compose window */}
          <motion.div
            className={`${styles.compose} ${minimized ? styles.minimized : ''}`}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header bar */}
            <div className={styles.header} onClick={() => setMinimized(m => !m)}>
              <span className={styles.headerTitle}>
                {minimized ? '✉️ New Message' : 'New Message'}
              </span>
              <div className={styles.headerActions} onClick={e => e.stopPropagation()}>
                <button className={styles.iconBtn} onClick={() => setMinimized(m => !m)} title={minimized ? 'Expand' : 'Minimize'}>
                  {minimized ? '▲' : '▼'}
                </button>
                <button className={styles.iconBtn} onClick={handleClose} title="Close">✕</button>
              </div>
            </div>

            {/* Body (hidden when minimized) */}
            <AnimatePresence>
              {!minimized && (
                <motion.div
                  className={styles.body}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {status === 'success' ? (
                    <div className={styles.successState}>
                      <div className={styles.successIcon}>✓</div>
                      <p>Message sent! I'll get back to you soon.</p>
                      <button className={styles.newMsgBtn} onClick={handleClose}>Done</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                      {/* To field — static */}
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>To</label>
                        <span className={styles.toChip}>anas.hileli.2@gmail.com</span>
                      </div>

                      <div className={styles.divider} />

                      {/* From field */}
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>From</label>
                        <input
                          className={styles.fieldInput}
                          type="text"
                          name="from_name"
                          placeholder="Your Name"
                          value={fields.from_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className={styles.divider} />

                      {/* Reply-to email */}
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Email</label>
                        <input
                          className={styles.fieldInput}
                          type="email"
                          name="reply_to"
                          placeholder="your@email.com"
                          value={fields.reply_to}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className={styles.divider} />

                      {/* Subject */}
                      <div className={styles.field}>
                        <input
                          className={`${styles.fieldInput} ${styles.subject}`}
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          value={fields.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className={styles.divider} />

                      {/* Message body */}
                      <textarea
                        className={styles.message}
                        name="message"
                        placeholder="Write your message..."
                        value={fields.message}
                        onChange={handleChange}
                        required
                      />

                      {/* Error notice */}
                      {status === 'error' && (
                        <p className={styles.errorNote}>
                          ⚠️ Could not send. Check your internet connection or{' '}
                          <a
                            href={`https://mail.google.com/mail/?view=cm&to=anas.hileli.2@gmail.com&su=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(fields.message)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            open Gmail directly
                          </a>
                          .
                        </p>
                      )}

                      {/* Footer toolbar */}
                      <div className={styles.toolbar}>
                        <button
                          type="submit"
                          className={styles.sendBtn}
                          disabled={status === 'sending'}
                        >
                          {status === 'sending' ? 'Sending…' : 'Send ✈'}
                        </button>
                        <div className={styles.toolbarRight}>
                          <button type="button" className={styles.trashBtn} onClick={handleClose} title="Discard">🗑</button>
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
