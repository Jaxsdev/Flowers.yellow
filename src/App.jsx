import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flower2, Sparkles, Send, RefreshCcw, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const Sunflower = ({ delay = 0, scale = 1, x = 0, y = 0 }) => (
  <motion.div
    initial={{ scale: 0, rotate: -45, opacity: 0 }}
    animate={{ scale: scale, rotate: 0, opacity: 1 }}
    transition={{
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: delay,
      duration: 2
    }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      zIndex: 5
    }}
  >
    <div className="flower-container" style={{ position: 'relative', width: '150px', height: '150px' }}>
      {/* Stem with Leaves */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '220px' }}
        transition={{ delay: delay, duration: 1.2 }}
        style={{
          width: '10px',
          background: 'linear-gradient(to top, #1b5e20, #4caf50)',
          position: 'absolute',
          bottom: '-180px',
          left: '70px',
          borderRadius: '5px',
          zIndex: 1
        }}
      >
        {/* Leaves */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -30 }}
          transition={{ delay: delay + 1, duration: 0.5 }}
          style={{
            position: 'absolute',
            width: '40px',
            height: '25px',
            background: '#2e7d32',
            borderRadius: '100% 0 100% 0',
            left: '-35px',
            top: '40px'
          }}
        />
        <motion.div
          initial={{ scale: 0, rotate: 30 }}
          animate={{ scale: 1, rotate: 30 }}
          transition={{ delay: delay + 1.2, duration: 0.5 }}
          style={{
            position: 'absolute',
            width: '40px',
            height: '25px',
            background: '#388e3c',
            borderRadius: '0 100% 0 100%',
            right: '-35px',
            top: '80px'
          }}
        />
      </motion.div>

      {/* Back Petals (Darker) */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={`back-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.5 + i * 0.04 }}
          style={{
            position: 'absolute',
            width: '45px',
            height: '75px',
            background: 'linear-gradient(to bottom, #f9a825, #fdd835)',
            borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
            left: '52px',
            top: '-10px',
            transformOrigin: '23px 75px',
            rotate: `${i * 22.5}deg`,
            zIndex: 2,
            filter: 'brightness(0.9)'
          }}
        />
      ))}

      {/* Front Petals (Brighter) */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={`front-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 0.9 }}
          transition={{ delay: delay + 0.8 + i * 0.04 }}
          style={{
            position: 'absolute',
            width: '42px',
            height: '70px',
            background: 'linear-gradient(to bottom, #ffeb3b, #fbc02d)',
            borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
            left: '54px',
            top: '-5px',
            transformOrigin: '21px 70px',
            rotate: `${i * 22.5 + 11}deg`,
            zIndex: 3
          }}
        />
      ))}

      {/* Center of the flower */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 1.2, type: 'spring', damping: 12 }}
        style={{
          position: 'absolute',
          width: '65px',
          height: '65px',
          backgroundColor: '#3e2723',
          borderRadius: '50%',
          left: '42.5px',
          top: '37.5px',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6), 0 4px 10px rgba(0,0,0,0.2)',
          border: '4px solid #5d4037',
          overflow: 'hidden'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle, #5d4037 1px, transparent 1px)',
          backgroundSize: '5px 5px',
          opacity: 0.8
        }} />
      </motion.div>
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

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const name = "Isabel"; // Fixed name for the special person
  const [showMessage, setShowMessage] = useState(false);
  const [flowers, setFlowers] = useState([]);
  
  // Robust Audio Handling
  const [audio] = useState(new Audio('/musica.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleStart = () => {
    setHasStarted(true);
    triggerConfetti();
    
    // Force play on first interaction
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(e => console.log("Auto-play blocked, user needs to click the music icon:", e));

    const newFlowers = [
      { id: 1, x: 15, y: 25, delay: 0.2, scale: 0.75 },
      { id: 2, x: 75, y: 20, delay: 0.5, scale: 1.1 },
      { id: 3, x: 48, y: 50, delay: 0.8, scale: 0.95 },
      { id: 4, x: 20, y: 65, delay: 1.1, scale: 1.2 },
      { id: 5, x: 80, y: 70, delay: 1.4, scale: 0.8 },
      { id: 6, x: 40, y: 20, delay: 1.7, scale: 0.6 },
    ];
    setFlowers(newFlowers);
    
    setTimeout(() => {
      setShowMessage(true);
    }, 2500);
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
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle, #fff9c4 0%, #fffde7 100%)'
    }}>
      {/* Falling Petals Background */}
      {[...Array(30)].map((_, i) => (
        <FloatingPetal key={i} delay={i * 0.4} />
      ))}

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(15px)',
              padding: '60px 40px',
              borderRadius: '40px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
              textAlign: 'center',
              width: '90%',
              maxWidth: '450px',
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
              <Flower2 size={80} color="#fbc02d" fill="#fbc02d" style={{ filter: 'drop-shadow(0 5px 15px rgba(251,192,45,0.4))' }} />
            </motion.div>

            <h1 style={{ fontSize: '3.5rem', color: '#3e2723', marginBottom: '15px' }}>Para Isabel</h1>
            <p style={{ color: '#5d4037', fontSize: '1.2rem', marginBottom: '40px', fontStyle: 'italic' }}>
              Tengo un detalle especial preparado para ti hoy...
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(251,192,45,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #fbc02d, #f9a825)',
                color: 'white',
                fontWeight: '800',
                fontSize: '1.3rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              DESCUBRIR <Sparkles size={24} />
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
            {/* Sunflowers blooming in the background */}
            {flowers.map(flower => (
              <Sunflower key={flower.id} {...flower} />
            ))}

            {/* Poetic Message Overlay */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 100, x: "-50%" }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                  style={{
                    position: 'absolute',
                    top: '15%',
                    left: '50%',
                    background: 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(20px)',
                    padding: '40px 25px',
                    borderRadius: '35px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                    zIndex: 100,
                    width: 'min(90%, 550px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  {/* Music Control Indicator */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMusic}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '25px',
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: isPlaying ? '#ff9800' : '#8d6e63'
                    }}
                  >
                    {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </motion.button>

                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginBottom: '15px' }}
                  >
                    <Heart size={44} color="#e91e63" fill="#e91e63" />
                  </motion.div>
                  
                  <h2 className="romantic-text" style={{ 
                    fontSize: 'clamp(2rem, 8vw, 3rem)', 
                    color: '#3e2723', 
                    marginBottom: '15px',
                    lineHeight: 1.2
                  }}>
                    ¡Feliz 21 de Marzo, {name}!
                  </h2>
                  
                  <p style={{ 
                    fontSize: 'clamp(1rem, 4vw, 1.3rem)', 
                    color: '#4e342e', 
                    lineHeight: '1.6', 
                    fontStyle: 'italic',
                    maxWidth: '100%'
                  }}>
                    Buenas noches Isabel, estas flores amarillas son como tu sonrisa:<br />
                    <strong style={{ display: 'block', marginTop: '10px', color: '#f57f17' }}> Que iluminan el mundo entero.</strong><br />
                    Cada pétalo es un recordatorio de lo increíble y especial que eres para mí. Gracias por ser esa luz constante. 💛
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
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, #1b5e20, #2e7d32, transparent)',
          zIndex: 1
        }}
      />
    </div>
  );
}
