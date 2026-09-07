import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'motion/react'
import { Reveal, EASE } from '../components/Reveal'
import { useReduced } from '../components/motionPrefs'
import { JOIN_URL } from '../content/deck'

/* The close. The photograph is the sheet, and it breathes — a slow push-in over
   the time the slide is up. The statement wipes on line by line, the rule draws
   itself, and the QR scans itself in and then keeps a quiet pulse on its corners,
   so the one thing the audience is meant to do is the one thing that keeps
   moving. Down on the map the rover has reached the last station, and every stop
   lights in a wave (see RoverTrack). */

const LINES = ['Come and break', 'things with us.']
const QR = 220
const PAD = 14

export function S14Close() {
  const reduced = useReduced()
  const rise = [0.2, 0.7, 0.25, 1] as const

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* The whole picture, uncropped — its own marks sit in the top corners, so the
          slow push-in is anchored to the top-right and that corner never moves. */}
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: '100% 0%' }}
        initial={{ scale: 1 }}
        animate={{ scale: reduced ? 1 : 1.045 }}
        transition={{ duration: 28, ease: 'easeOut' }}
      >
        <motion.img
          src="./img/final.jpg"
          alt="An astronaut on stage, arms wide, in front of a full auditorium"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 1.1, ease: rise }}
        />
      </motion.div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(24,12,9,0.9) 0%, rgba(24,12,9,0.8) 26%, rgba(24,12,9,0.42) 46%, rgba(24,12,9,0) 62%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(24,12,9,0.7) 0%, rgba(24,12,9,0) 30%)' }} />
      {/* a lighter wash on the right, under the QR and its label */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(24,12,9,0.62) 0%, rgba(24,12,9,0.28) 22%, rgba(24,12,9,0) 40%)' }} />

      {/* the statement, one line at a time, then the rule under it */}
      <div className="abs" style={{ left: 96, top: 196, width: 900 }}>
        {LINES.map((line, i) => (
          <motion.span
            key={line}
            className="statement"
            style={{ display: 'block', fontSize: 92, lineHeight: 0.98, color: 'var(--paper)' }}
            initial={{ clipPath: reduced ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', y: reduced ? 0 : 12 }}
            animate={{ clipPath: 'inset(0 0 0 0)', y: 0 }}
            transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : 0.3 + i * 0.24, ease: EASE }}
          >
            {line}
          </motion.span>
        ))}
        <motion.div
          className="rule"
          style={{ transformOrigin: 'left center' }}
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.85, ease: EASE }}
        />
        <Reveal delay={1.0}>
          <p className="lead" style={{ marginTop: 28, color: 'rgba(255,251,247,0.84)', maxWidth: 560 }}>
            Join the journey of future exploration. Build your dream and solve problems with us, 
            and be part of the next generation of space robotics.
          </p>
        </Reveal>
      </div>

      {/* the QR: it scans itself in, then its corners keep a slow pulse */}
      <Reveal delay={1.25} className="abs" style={{ right: 96, top: 596, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 32, textAlign: 'right' }}>
        <a
          href={JOIN_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open the Mongol-Tori join page"
          style={{ position: 'relative', display: 'block', padding: PAD, background: '#fff', borderRadius: 20, border: '3px solid rgba(255,255,255,0.45)', lineHeight: 0 }}
        >
          <QRCodeSVG value={JOIN_URL} size={QR} bgColor="#ffffff" fgColor="#3b1c14" level="M" />
          {!reduced && (
            <>
              <motion.span
                aria-hidden="true"
                style={{ position: 'absolute', left: PAD, right: PAD, height: 3, borderRadius: 2, background: 'var(--red)', boxShadow: '0 0 14px rgba(232, 39, 39, 0.6)' }}
                initial={{ top: PAD, opacity: 0 }}
                animate={{ top: [PAD, PAD + QR, PAD + QR], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 1.7, ease: 'easeInOut' }}
              />
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                style={{ position: 'absolute', inset: -12, width: 'calc(100% + 24px)', height: 'calc(100% + 24px)', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: [0, 0.95, 0.45, 0.95], scale: [0.96, 1, 1.03, 1] }}
                transition={{ duration: 2.2, delay: 3.2, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
              >
                <path d="M2 18 V2 H18 M82 2 H98 V18 M98 82 V98 H82 M18 98 H2 V82" fill="none" stroke="var(--red)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </motion.svg>
            </>
          )}
        </a>
        <div>
          <p className="lead" style={{ fontWeight: 500, color: 'var(--paper)' }}>Scan to join</p>
          <p className="small" style={{ marginTop: 6, fontFamily: 'var(--mono)', fontSize: 20, color: 'rgba(255,251,247,0.72)' }}>{JOIN_URL.replace(/^https?:\/\//, '')}</p>
        </div>
      </Reveal>
    </div>
  )
}
