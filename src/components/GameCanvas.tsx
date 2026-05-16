import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

// --- Game Constants ---
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const WARP_COST = 30;
const ENERGY_REGEN = 0.2;
const BASE_SPEED = 5;

// --- Interfaces ---
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  color: string;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Item {
  x: number;
  y: number;
  radius: number;
  type: 'essence' | 'shard';
  collected: boolean;
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setStats, setScreen, screen } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Game State Variables ---
    let speed = BASE_SPEED;
    let distanceTraveled = 0;
    let score = 0;
    let comboMultiplier = 1;
    let energy = 100;
    let cameraX = 0;

    const player: Player = {
      x: width * 0.2,
      y: height / 2,
      width: 30,
      height: 30,
      vy: 0,
      isGrounded: false,
      color: '#00f3ff', // Cyan neon
    };

    let platforms: Platform[] = [];
    let particles: Particle[] = [];
    let items: Item[] = [];

    const initializeGame = () => {
      speed = BASE_SPEED;
      distanceTraveled = 0;
      score = 0;
      comboMultiplier = 1;
      energy = 100;
      
      player.x = width * 0.2;
      player.y = height / 2;
      player.vy = 0;
      player.isGrounded = false;
      
      platforms = [];
      particles = [];
      items = [];
      
      platforms.push({ x: 0, y: height - 100, width: width * 2, height: 100, color: '#1a1a2e' });
    };

    initializeGame();

    // Check store for reset
    const storeUnsubscribe = useGameStore.subscribe((state) => {
       if (state.distance === 0 && state.screen === 'playing') {
          initializeGame();
       }
    });

    // --- Inputs ---
    const handleTouchOrClick = (e: TouchEvent | MouseEvent) => {
      if (screen !== 'playing') return;
      
      // Prefer preventing default only if target is the canvas
      if (e.target === canvasRef.current) {
         e.preventDefault();
      }
      
      // Jump
      if (player.isGrounded) {
        player.vy = JUMP_FORCE;
        player.isGrounded = false;
        createParticles(player.x, player.y + player.height, 10, '#ffffff');
      } 
      // Warp
      else if (energy >= WARP_COST) {
        energy -= WARP_COST;
        const warpDistance = 150;
        
        // Leave echo
        createEcho(player.x, player.y);
        
        player.x += warpDistance;
        player.vy = JUMP_FORCE * 0.5; // Slight upward boost
        
        // Warp effect
        createParticles(player.x, player.y + player.height/2, 20, '#ff00ff');
        comboMultiplier = Math.min(comboMultiplier + 0.5, 5);
      }
    };

    window.addEventListener('touchstart', handleTouchOrClick, { passive: false });
    window.addEventListener('mousedown', handleTouchOrClick);

    // --- Generators ---
    const generateWorld = () => {
      const lastPlatform = platforms[platforms.length - 1];
      if (lastPlatform.x + lastPlatform.width - cameraX < width + 500) {
        // Create new platform
        const gap = Math.random() * 200 + 100;
        const pWidth = Math.random() * 300 + 100;
        // Y changes but remains playable
        const pY = Math.max(200, Math.min(height - 100, lastPlatform.y + (Math.random() * 200 - 100)));
        
        platforms.push({
          x: lastPlatform.x + lastPlatform.width + gap,
          y: pY,
          width: pWidth,
          height: 100,
          color: '#1a1a2e'
        });

        // Add items
        if (Math.random() > 0.5) {
          items.push({
            x: lastPlatform.x + lastPlatform.width + gap / 2,
            y: pY - 150,
            radius: 10,
            type: Math.random() > 0.8 ? 'shard' : 'essence',
            collected: false
          });
        }
      }
    };

    const createParticles = (x: number, y: number, count: number, color: string) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          maxLife: Math.random() * 30 + 10,
          color,
          size: Math.random() * 4 + 1
        });
      }
    };

    const createEcho = (x: number, y: number) => {
       particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          life: 1,
          maxLife: 60,
          color: 'rgba(255, 0, 255, 0.5)',
          size: player.width
        });
    };

    // --- Game Loop ---
    const update = () => {
      if (screen !== 'playing') return;

      // Physics
      player.vy += GRAVITY;
      player.y += player.vy;
      player.x += speed;

      const offset = width * 0.2;
      cameraX = player.x - offset; // Keep player at 20% on screen

      // Ground Collision
      player.isGrounded = false;
      for (const p of platforms) {
        // Basic AABB collision
        if (
          player.x < p.x + p.width &&
          player.x + player.width > p.x &&
          player.y + player.height >= p.y &&
          player.y + player.height <= p.y + p.height + player.vy + 2 && // Tolerate falling through slightly
          player.vy >= 0
        ) {
          player.isGrounded = true;
          player.vy = 0;
          player.y = p.y - player.height;
        }
      }

      // Items collision
      for (const item of items) {
        if (!item.collected) {
           const dx = (player.x + player.width/2) - item.x;
           const dy = (player.y + player.height/2) - item.y;
           if (Math.sqrt(dx*dx + dy*dy) < item.radius + player.width/2) {
             item.collected = true;
             createParticles(item.x, item.y, 15, item.type === 'shard' ? '#ff0055' : '#00ffcc');
             score += (item.type === 'shard' ? 500 : 100) * comboMultiplier;
             if (item.type === 'essence') {
                energy = Math.min(100, energy + 20);
             }
           }
        }
      }

      // State updates
      if (player.isGrounded) {
        comboMultiplier = 1;
      }

      energy = Math.min(100, energy + ENERGY_REGEN);
      distanceTraveled += speed / 10;
      speed = BASE_SPEED + (distanceTraveled / 1000); // Gradually increase speed

      generateWorld();

      // Clean up off-screen
      platforms = platforms.filter(p => p.x + p.width > cameraX);
      items = items.filter(i => i.x > cameraX && !i.collected);
      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
      }

      // Death condition
      if (player.y > height + 100) {
        setScreen('gameover');
      }

      // Update store stats frequently for HUD (throttle slightly if needed, but doing it every frame for smooth HUD)
      setStats({ distance: Math.floor(distanceTraveled), score: Math.floor(score), combo: Math.floor(comboMultiplier * 10)/10, warpEnergy: energy });
    };

    const draw = () => {
      // Clear background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, width, height);

      // Save context for camera offset
      ctx.save();
      ctx.translate(-cameraX, 0);

      // Draw Platforms (Neon style)
      ctx.shadowBlur = 10;
      for (const p of platforms) {
        ctx.fillStyle = '#0a0a20';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        
        // Neon top edge
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.fillRect(p.x, p.y, p.width, 2);
      }

      // Draw Items
      for (const item of items) {
        if (!item.collected) {
           ctx.beginPath();
           ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
           const color = item.type === 'shard' ? '#ff0055' : '#00ffcc';
           ctx.fillStyle = color;
           ctx.shadowColor = color;
           ctx.fill();
        }
      }

      // Draw Particles & Echoes
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        
        if (p.size === player.width) {
             // It's an echo
             ctx.globalAlpha = p.life / p.maxLife;
             ctx.fillRect(p.x, p.y, p.size, p.size);
             ctx.globalAlpha = 1.0;
        } else {
             ctx.globalAlpha = p.life / p.maxLife;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
             ctx.fill();
             ctx.globalAlpha = 1.0;
        }
      }

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 15;
      
      // Add slight stretch based on velocity
      const stretchY = player.vy * 0.5;
      ctx.fillRect(player.x, player.y - stretchY/2, player.width, player.height + Math.abs(stretchY));

      ctx.restore();

      // Draw minimal HUD (Wait, we will use React for HUD instead, it's easier to style with Tailwind)
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      storeUnsubscribe();
      window.removeEventListener('touchstart', handleTouchOrClick);
      window.removeEventListener('mousedown', handleTouchOrClick);
    };
  }, [screen, setStats, setScreen]);

  return (
    <canvas 
      ref={canvasRef} 
      className="block w-full h-full"
    />
  );
}
