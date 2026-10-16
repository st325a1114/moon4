import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
  color: string;
}

interface SakuraCanvasProps {
  intensity?: 'gentle' | 'breeze' | 'blizzard';
  interactive?: boolean;
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({
  intensity = 'gentle',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalCount = intensity === 'gentle' ? 45 : intensity === 'breeze' ? 85 : 140;
    const colors = [
      'rgba(255, 230, 238, ',
      'rgba(254, 215, 226, ',
      'rgba(251, 207, 232, ',
      'rgba(255, 245, 247, ',
    ];

    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.2,
        size: 7 + Math.random() * 9,
        speedY: 0.6 + Math.random() * 1.2,
        speedX: 0.4 + Math.random() * 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.8,
        opacity: 0.5 + Math.random() * 0.45,
        swayAmplitude: 15 + Math.random() * 25,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let tick = 0;

    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate((rotation * Math.PI) / 180);

      // Cherry petal shape using beziers
      context.beginPath();
      context.moveTo(0, -size);
      context.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.9, size * 0.5, 0, size);
      context.bezierCurveTo(-size * 0.9, size * 0.5, -size * 0.7, -size * 0.6, 0, -size);

      // Gradient fill with slight translucent tip
      const grad = context.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, `${color}${opacity * 0.95})`);
      grad.addColorStop(0.8, `${color}${opacity * 0.8})`);
      grad.addColorStop(1, `rgba(244, 114, 182, ${opacity * 0.4})`);

      context.fillStyle = grad;
      context.shadowColor = 'rgba(255, 255, 255, 0.2)';
      context.shadowBlur = 3;
      context.fill();
      context.restore();
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.swayPhase += p.swaySpeed;
        const swayOffset = Math.sin(p.swayPhase) * (p.swayAmplitude * 0.04);

        p.y += p.speedY;
        p.x += p.speedX + swayOffset;
        p.rotation += p.rotationSpeed;

        // Subtle mouse repulsion/stirring
        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 2.2;
            p.y += (dy / dist) * force * 1.5;
            p.rotation += force * 4;
          }
        }

        // Wrap around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * (width + 100) - 50;
        }
        if (p.x > width + 30) {
          p.x = -20;
        } else if (p.x < -30) {
          p.x = width + 20;
        }

        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 w-full h-full"
    />
  );
};
