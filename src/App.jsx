import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flower2, Sparkles, Send, RefreshCcw, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const Sunflower = ({ delay = 0, scale = 1, x = 0, y = 0 }) => (
  <motion.div
    initial={{ scale: 0, rotate: -45, opacity: 0 }}
    animate={{ scale: scale, rotate: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 80, damping: 15, delay: delay, duration: 2 }}
    style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 5 }}
  >
    <div className="flower-container" style={{ position: 'relative', width: 'clamp(100px, 30vw, 150px)', aspectRatio: '1/1' }}>
      {/* Stem with Leaves */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 'clamp(150px, 40vh, 220px)' }}
        transition={{ delay: delay, duration: 1.2 }}
        style={{
          width: 'clamp(6px, 1.5vw, 10px)',
          background: 'linear-gradient(to top, #1b5e20, #4caf50)',
          position: 'absolute',
          bottom: '-120%',
          left: '46%',
          borderRadius: '5px',
          zIndex: 1
        }}
      >
        <div style={{ position: 'absolute', width: '30px', height: '18px', background: '#2e7d32', borderRadius: '100% 0 100% 0', left: '-25px', top: '20%' }} />
        <div style={{ position: 'absolute', width: '30px', height: '18px', background: '#388e3c', borderRadius: '0 100% 0 100%', right: '-25px', top: '40%' }} />
      </motion.div>

      {/* Petals (Optimized for Mobile) */}
      {[...Array(16)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '30%',
          height: '50%',
          background: i % 2 === 0 ? 'linear-gradient(to bottom, #fbc02d, #fdd835)' : 'linear-gradient(to bottom, #ffeb3b, #fbc02d)',
          borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
          left: '35%',
          top: '0',
          transformOrigin: '50% 100%',
          rotate: `${i * 22.5}deg`,
          zIndex: i % 2 === 0 ? 2 : 3,
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }} />
      ))}

      {/* Center */}
      <div style={{
        position: 'absolute',
        width: '45%',
        height: '45%',
        backgroundColor: '#3e2723',
        borderRadius: '50%',
        left: '27.5%',
        top: '27.5%',
        zIndex: 4,
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.2)',
        border: '3px solid #5d4037',
        backgroundImage: 'radial-gradient(circle, #5d4037 1px, transparent 1px)', 
        backgroundSize: '4px 4px'
      }} />
    </div>
  </motion.div>
);

const FloatingPetal = ({ delay }) => {
  const [pos] = useState({
    x: Math.random() * 100,
    endX: (Math.random() - 0.5) * 60,
    rotate: Math.random() * 360,
    size: 12 + Math.random() * 18
  });

  return (
    <motion.div
      className="petal"
      initial={{ top: -20, left: `${pos.x}%`, opacity: 0, rotate: pos.rotate }}
      animate={{
        top: '110vh',
        left: `${pos.x + pos.endX}%`,
        opacity: [0, 1, 1, 0],
        rotate: pos.rotate + 720
      }}
      transition={{
        duration: 12 + Math.random() * 8,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      style={{
        width: pos.size,
        height: pos.size * 1.6,
        backgroundColor: '#ffd600',
        borderRadius: '50% 0 50% 50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        filter: 'drop-shadow(0 2px 5px rgba(255,215,0,0.4))'
      }}
    />
  );
};

// Flower component rendered inside the App
const sunflowerAnimation = {
  initial: { scale: 0, rotate: -45, opacity: 0 },
  animate: { scale: (s) => s, rotate: 0, opacity: 1 },
};

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const name = "Isabel";
  const [showMessage, setShowMessage] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [miniFlowers, setMiniFlowers] = useState([]);
  
  // Ref for Audio (Better for iOS)
  const audioRef = React.useRef(null);

  useEffect(() => {
    // Initialize audio on mount
    audioRef.current = new Audio('/musica.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    triggerConfetti();
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio blocked:", e));
    }

    // Back to the original 6 perfect flowers
    const initialFlowers = [
      { id: 1, x: 15, y: 25, delay: 0.2, scale: 0.75 },
      { id: 2, x: 75, y: 20, delay: 0.5, scale: 1.1 },
      { id: 3, x: 48, y: 50, delay: 0.8, scale: 0.95 },
      { id: 4, x: 20, y: 65, delay: 1.1, scale: 1.2 },
      { id: 5, x: 80, y: 70, delay: 1.4, scale: 0.8 },
      { id: 6, x: 40, y: 20, delay: 1.7, scale: 0.6 },
    ];
    setFlowers(initialFlowers);
    setMiniFlowers([]); // Clear mini flowers
    
    setTimeout(() => { setShowMessage(true); }, 2200);
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 70 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
    }, 300);
  };

  return (
    <div style={{ 
      position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle, #fff9c4 0%, #fffde7 100%)'
    }}>
      {/* Falling Petals Background */}
      {[...Array(20)].map((_, i) => (
        <FloatingPetal key={i} delay={i * 0.5} />
      ))}

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(15px)',
              padding: 'clamp(40px, 10vw, 60px) 30px',
              borderRadius: '40px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
              textAlign: 'center',
              width: '85%',
              maxWidth: '400px',
              zIndex: 20
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ marginBottom: '30px', display: 'inline-block' }}
            >
              <Flower2 size={64} color="#fbc02d" fill="#fbc02d" style={{ filter: 'drop-shadow(0 5px 15px rgba(251,192,45,0.4))' }} />
            </motion.div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)', color: '#3e2723', margin: '20px 0 10px' }}>Para Isabel</h1>
            <p style={{ color: '#5d4037', fontSize: '1.1rem', marginBottom: '30px', fontStyle: 'italic' }}>
              Tengo algo preparado para ti...
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(251,192,45,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #fbc02d, #f9a825)',
                color: 'white',
                fontWeight: '800',
                fontSize: '1.2rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              DESCUBRIR <Sparkles size={20} />
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
              {/* Sunflowers blooming in the background */}
              {flowers.map(flower => (
                <Sunflower key={flower.id} {...flower} />
              ))}
            </div>

            {/* Poetic Message Overlay */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(25px)',
                    padding: 'clamp(30px, 8vw, 45px) 25px',
                    borderRadius: '35px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                    zIndex: 100,
                    width: 'min(90%, 500px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    position: 'relative'
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginBottom: '15px' }}
                  >
                    <Heart size={44} color="#e91e63" fill="#e91e63" />
                  </motion.div>
                  
                  <h2 className="romantic-text" style={{ 
                    fontSize: 'clamp(2rem, 8vw, 2.8rem)', 
                    color: '#3e2723', 
                    marginBottom: '15px',
                    lineHeight: 1.2
                  }}>
                    ¡Feliz 21 de Marzo!
                  </h2>
                  
                  <p style={{ 
                    fontSize: 'clamp(1rem, 4.5vw, 1.25rem)', 
                    color: '#4e342e', 
                    lineHeight: '1.6', 
                    fontStyle: 'italic',
                    maxWidth: '100%'
                  }}>
                    Buenas noches Isabel, estas flores amarillas son como tu sonrisa:<br />
                    <strong style={{ display: 'block', marginTop: '10px', color: '#f57f17' }}> Que iluminan el mundo entero.</strong><br />
                    Cada pétalo es un recordatorio de lo especial que eres para mí. Gracias por ser esa luz constante. 💛
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    style={{ marginTop: '25px' }}
                  >
                    <p style={{ color: '#8d6e63', fontSize: '0.9rem' }}>Con todo mi cariño ✨</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Lush grass at the bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 'clamp(80px, 15vh, 120px)',
        background: 'linear-gradient(to top, #1b5e20 0%, #2e7d32 50%, transparent 100%)', zIndex: 1, opacity: 0.7
      }} />
    </div>
  );
}
