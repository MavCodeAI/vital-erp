import { useEffect } from "react";

interface ConfettiOptions {
  startVelocity: number;
  spread: number;
  ticks: number;
  zIndex: number;
  origin: {
    x: number;
    y: number;
  };
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createConfettiParticles(count: number, options: ConfettiOptions): void {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${options.origin.x * 100}%`;
    confetti.style.top = `${options.origin.y * 100}%`;
    confetti.style.opacity = '1';
    confetti.style.transform = 'translate(-50%, -50%)';
    confetti.style.zIndex = options.zIndex.toString();
    confetti.style.pointerEvents = 'none';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = options.startVelocity + Math.random() * 10;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let x = parseFloat(confetti.style.left);
    let y = parseFloat(confetti.style.top);
    let opacity = 1;
    
    const animate = () => {
      x += vx;
      y += vy + 2; // gravity
      opacity -= 0.02;
      
      confetti.style.left = `${x}%`;
      confetti.style.top = `${y}%`;
      confetti.style.opacity = opacity.toString();
      
      if (opacity > 0 && y < 100) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    
    requestAnimationFrame(animate);
  }
}

export function triggerConfetti(): void {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Create confetti particles
    createConfettiParticles(particleCount, {
      ...defaults,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    createConfettiParticles(particleCount, {
      ...defaults,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

export function SuccessConfetti() {
  useEffect(() => {
    triggerConfetti();
  }, []);

  return null;
}
