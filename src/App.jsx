import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flower2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Sunflower Component ---
const Sunflower = ({ delay = 0, scale = 1, x = 0, y = 0 }) => (
  <motion.div
    initial={{ scale: 0, rotate: -45, opacity: 0 }}
    animate={{ scale: scale, rotate: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 40, damping: 12, delay: delay, duration: 2 }}
    style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 10, transform: 'translate(-50%, -50%)' }}
  >
    <div style={{ position: 'relative', width: 'clamp(90px, 25vw, 130px)', aspectRatio: '1/1' }}>
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 'clamp(140px, 35vh, 190px)' }}
        transition={{ delay: delay, duration: 1.5 }}
        style={{
          width: '7px', background: 'linear-gradient(to top, #1b5e20, #4caf50)',
          position: 'absolute', bottom: '-100%', left: '46%', borderRadius: '5px', zIndex: 1
        }}
      >
        <div style={{ position: 'absolute', width: '25px', height: '14px', background: '#2e7d32', borderRadius: '100% 0 100% 0', left: '-22px', top: '20%' }} />
        <div style={{ position: 'absolute', width: '25px', height: '14px', background: '#388e3c', borderRadius: '0 100% 0 100%', right: '-22px', top: '40%' }} />
      </motion.div>
      {[...Array(16)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', width: '30%', height: '50%', background: i % 2 === 0 ? '#fbc02d' : '#fdd835',
          borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%', left: '35%', top: '0', transformOrigin: '50% 100%',
          rotate: `${i * 22.5}deg`, zIndex: 3, boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }} />
      ))}
      <div style={{ position: 'absolute', width: '45%', height: '45%', backgroundColor: '#3e2723', borderRadius: '50%', left: '27.5%', top: '27.5%', zIndex: 4, border: '2px solid #5d4037' }} />
    </div>
  </motion.div>
);

// --- Mini Flower ---
const MiniFlower = ({ delay = 0, scale = 1, x = 0, y = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: scale, opacity: 0.5 }}
    transition={{ delay: delay, duration: 1 }}
    style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 5, transform: 'translate(-50%, -50%)' }}
  >
    <div style={{ position: 'relative', width: 'clamp(18px, 5vw, 25px)', height: 'clamp(18px, 5vw, 25px)' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: '40%', height: '60%', background: '#ffeb3b', borderRadius: '50%', left: '30%', top: '0', transformOrigin: '50% 100%', rotate: `${i * 60}deg` }} />
      ))}
      <div style={{ position: 'absolute', width: '35%', height: '35%', background: '#3e2723', borderRadius: '50%', left: '33%', top: '33%' }} />
    </div>
  </motion.div>
);

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [minis, setMinis] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const name = "Isabel";

  useEffect(() => {
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    triggerConfetti();
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // --- SCATTERED GARDEN (Natural Chaos Algorithm) ---
    const rows = 5;
    const cols = 3;
    const messyGarden = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // High Jitter: Randomly shift each flower far from its grid point
        messyGarden.push({
          id: `f-${r}-${c}`,
          x: (c * 30) + 10 + (Math.random() * 20), // 20% random shift
          y: (r * 18) + 5 + (Math.random() * 12),  // 12% random shift
          delay: Math.random() * 2,
          scale: 0.65 + Math.random() * 0.45
        });
      }
    }
    setFlowers(messyGarden);

    const miniSet = [...Array(35)].map((_, i) => ({
      id: `m-${i}`,
      x: Math.random() * 96 + 2,
      y: Math.random() * 94 + 3,
      delay: Math.random() * 3,
      scale: 0.4 + Math.random() * 0.3
    }));
    setMinis(miniSet);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 4500;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffeb3b', '#fbc02d'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffeb3b', '#fbc02d'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', background: 'radial-gradient(circle, #fffde7, #fff9c4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(15px)', padding: '50px 30px', borderRadius: '40px', textAlign: 'center', width: '85%', maxWidth: '380px', zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
          >
            <Flower2 size={60} color="#fbc02d" fill="#fbc02d" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '2.8rem', color: '#3e2723', margin: '0 0 10px' }}>Para Isabel</h1>
            <p style={{ color: '#5d4037', fontStyle: 'italic', marginBottom: '30px' }}>Tengo algo preparado para ti...</p>
            <button onClick={handleStart} style={{ width: '100%', padding: '18px', borderRadius: '50px', background: '#fbc02d', border: 'none', color: 'white', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(251,192,45,0.3)' }}>
              DESCUBRIR <Sparkles size={18} />
            </button>
          </motion.div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            {/* The Garden (Stay in background) */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {minis.map(m => <MiniFlower key={m.id} {...m} />)}
              {flowers.map(f => <Sunflower key={f.id} {...f} />)}
            </div>

            {/* The Message (Centered naturally by parent Flexbox) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 4.5, duration: 1.2, ease: "easeOut" }}
              style={{
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(25px)', padding: '40px 25px',
                borderRadius: '35px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', textAlign: 'center',
                width: 'min(85%, 450px)', zIndex: 999, border: '1px solid rgba(255,255,255,0.5)', position: 'relative'
              }}
            >
              <button onClick={toggleMusic} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#fbc02d' }}>
                <Volume2 size={24} />
              </button>
              <Heart size={40} color="#e91e63" fill="#e91e63" style={{ margin: '0 auto 15px' }} />
              <h2 className="romantic-text" style={{ fontSize: '2.2rem', color: '#3e2723', marginBottom: '15px', lineHeight: '1.1' }}>
                ¡Feliz 21 de Marzo, {name}!
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#4e342e', fontStyle: 'italic', lineHeight: '1.6' }}>
                Buenas noches Isabel, estas flores amarillas son como tu sonrisa:<br />
                <strong style={{ color: '#f57f17', display: 'block', margin: '8px 0' }}>Que iluminan el mundo entero.</strong>
                Cada pétalo es un recordatorio de lo especial que eres para mí. Gracias por ser esa luz constante. 💛
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '90px', background: 'linear-gradient(to top, #1b5e20, transparent)', zIndex: 1, opacity: 0.6 }} />
    </div>
  );
}
