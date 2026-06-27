"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Gamepad2, CircleDashed, Music, MousePointer2, Settings, 
  PenTool, Disc, Sparkles, Timer, BoxSelect, ArrowLeft
} from "lucide-react";
import Link from "next/link";

// --- TOY 1: VIRTUAL BUBBLE WRAP ---
const BubbleWrap = () => {
  const [bubbles, setBubbles] = useState(Array(35).fill(false));

  const popBubble = (index: number) => {
    if (bubbles[index]) return;
    
    // Play sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error(e);
    }

    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
  };

  const resetBubbles = () => setBubbles(Array(35).fill(false));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-7 gap-3 bg-surface p-6 rounded-3xl border-4 border-border neo-brutalist-shadow">
        {bubbles.map((popped, i) => (
          <motion.button
            key={i}
            whileTap={!popped ? { scale: 0.85 } : {}}
            onClick={() => popBubble(i)}
            className={cn(
              "w-12 h-12 rounded-full transition-all duration-200 border-2",
              popped 
                ? "bg-muted/30 border-muted shadow-inner scale-95" 
                : "bg-blue-100 border-blue-300 shadow-[inset_-2px_-4px_8px_rgba(0,0,0,0.1),2px_4px_0px_rgba(0,0,0,0.1)] hover:bg-blue-200 cursor-pointer"
            )}
          />
        ))}
      </div>
      <button onClick={resetBubbles} className="px-6 py-2 bg-text text-surface rounded-xl font-bold border-2 border-transparent hover:bg-surface hover:text-text hover:border-text transition-colors">
        Reset Bubbles
      </button>
    </div>
  );
};

// --- TOY 2: ZEN BREATHING ---
const ZenBreathing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 2.5, 2.5, 1, 1],
            opacity: [0.3, 0.1, 0.1, 0.3, 0.3],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            times: [0, 0.25, 0.4375, 0.9375, 1],
            ease: "easeInOut"
          }}
          className="absolute w-32 h-32 bg-primary rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.8, 1.8, 1, 1]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            times: [0, 0.25, 0.4375, 0.9375, 1],
            ease: "easeInOut"
          }}
          className="z-10 w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-surface/80 backdrop-blur-sm neo-brutalist-shadow-sm"
        >
          <motion.span
            animate={{ opacity: [1, 0, 1, 0, 1] }}
            transition={{ duration: 16, repeat: Infinity, times: [0, 0.2, 0.3, 0.8, 1] }}
            className="font-bold text-center text-sm"
          >
            Tarik
          </motion.span>
        </motion.div>
      </div>
      <p className="text-muted font-medium text-center">Ikuti ritme lingkaran untuk relaksasi pernapasan.</p>
    </div>
  );
};

// --- TOY 3: NEON SOUND PAD ---
const NeonSoundPad = () => {
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500"];
  
  const [activePad, setActivePad] = useState<number | null>(null);

  const playNote = (index: number, frequency: number) => {
    setActivePad(index);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error(e);
    }
    
    setTimeout(() => setActivePad(null), 200);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-surface rounded-3xl border-4 border-border neo-brutalist-shadow">
      {notes.map((freq, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.9 }}
          onClick={() => playNote(i, freq)}
          className={cn(
            "w-20 h-24 rounded-xl border-4 border-border transition-all duration-100",
            activePad === i ? cn(colors[i], "shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-95") : "bg-muted/10 hover:bg-muted/20"
          )}
        />
      ))}
    </div>
  );
};

// --- TOY 4: MOUSE TRAIL ---
const MouseTrail = () => {
  const [trails, setTrails] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailCount = useRef(0);
  
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = trailCount.current++;
    const color = colors[id % colors.length];
    
    setTrails(prev => [...prev.slice(-15), { id, x, y, color }]);
    
    setTimeout(() => {
      setTrails(prev => prev.filter(t => t.id !== id));
    }, 500);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-[400px] border-4 border-dashed border-border rounded-3xl relative overflow-hidden bg-surface cursor-crosshair flex items-center justify-center"
    >
      <p className="text-muted font-medium pointer-events-none select-none z-10 text-xl">Gerakkan kursor di area ini</p>
      {trails.map(t => (
        <motion.div
          key={t.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute rounded-full w-8 h-8 pointer-events-none -ml-4 -mt-4 shadow-lg blur-[2px]"
          style={{ left: t.x, top: t.y, backgroundColor: t.color }}
        />
      ))}
    </div>
  );
};

// --- TOY 5: FIDGET SPINNER ---
const FidgetSpinner = () => {
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const requestRef = useRef<number>(0);

  const spin = () => {
    setSpeed(prev => Math.min(prev + 20, 100)); // Max speed
  };

  const updateRotation = () => {
    if (speed > 0) {
      setRotation(prev => (prev + speed) % 360);
      setSpeed(prev => Math.max(prev - 0.2, 0)); // Friction
    }
    requestRef.current = requestAnimationFrame(updateRotation);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [speed]);

  return (
    <div className="flex flex-col items-center gap-10">
      <motion.div 
        onClick={spin}
        style={{ rotate: rotation }}
        className="w-48 h-48 relative cursor-pointer group"
      >
        <div className="absolute inset-0 border-[12px] border-text rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-primary rounded-full" />
        </div>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-surface border-[8px] border-text rounded-full" />
        <div className="absolute -bottom-4 left-4 w-16 h-16 bg-surface border-[8px] border-text rounded-full" />
        <div className="absolute -bottom-4 right-4 w-16 h-16 bg-surface border-[8px] border-text rounded-full" />
      </motion.div>
      <p className="font-bold text-lg border-b-2 border-text pb-1">Klik spinner-nya terus-menerus!</p>
    </div>
  );
};

// --- TOY 6: MINI CANVAS ---
const MiniCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff'; // light mode default, we can't easily sync but let's use transparent
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    // Gunakan warna teks dari tema (kira-kira hitam/putih)
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#fff' : '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-2 bg-surface rounded-2xl border-4 border-border neo-brutalist-shadow">
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full bg-transparent cursor-crosshair rounded-xl"
          style={{ touchAction: 'none' }}
        />
      </div>
      <button onClick={clearCanvas} className="self-center px-6 py-2 bg-text text-surface rounded-xl font-bold hover:opacity-80 transition-opacity">
        Bersihkan Layar
      </button>
    </div>
  );
};

// --- TOY 7: DVD BOUNCING LOGO ---
const DVDBounce = () => {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [dir, setDir] = useState({ x: 2, y: 2 });
  const [colorIdx, setColorIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899"];

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const logoWidth = 120;
        const logoHeight = 60;
        
        setPos(p => {
          let nx = p.x + dir.x;
          let ny = p.y + dir.y;
          let ndx = dir.x;
          let ndy = dir.y;
          let hit = false;
          
          if (nx <= 0 || nx + logoWidth >= rect.width) {
            ndx = -dir.x;
            nx = nx <= 0 ? 0 : rect.width - logoWidth;
            hit = true;
          }
          if (ny <= 0 || ny + logoHeight >= rect.height) {
            ndy = -dir.y;
            ny = ny <= 0 ? 0 : rect.height - logoHeight;
            hit = true;
          }
          
          if (hit) {
            setDir({ x: ndx, y: ndy });
            setColorIdx(c => (c + 1) % colors.length);
          }
          
          return { x: nx, y: ny };
        });
      }
      requestRef.current = requestAnimationFrame(update);
    };
    
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [dir]);

  return (
    <div ref={containerRef} className="w-full h-[400px] bg-black rounded-3xl relative overflow-hidden border-4 border-border neo-brutalist-shadow">
      <div 
        className="absolute w-[120px] h-[60px] flex items-center justify-center font-black text-4xl italic tracking-tighter transition-colors duration-200"
        style={{ left: pos.x, top: pos.y, color: colors[colorIdx] }}
      >
        DVD
      </div>
    </div>
  );
};

// --- TOY 8: PARTICLE BURST ---
const ParticleBurst = () => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string, angle: number, speed: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);
  
  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];

  const handleBurst = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticles = Array.from({length: 12}).map(() => ({
      id: particleId.current++,
      x, y,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      speed: 50 + Math.random() * 100
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleBurst}
      className="w-full h-[400px] bg-surface border-4 border-border rounded-3xl relative overflow-hidden cursor-crosshair neo-brutalist-shadow flex items-center justify-center"
    >
      <p className="text-muted font-medium pointer-events-none select-none z-10 text-xl">Klik di mana saja untuk meledakkan kembang api</p>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{ 
            x: p.x + Math.cos(p.angle) * p.speed, 
            y: p.y + Math.sin(p.angle) * p.speed, 
            opacity: 0, 
            scale: 0 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

// --- TOY 9: METRONOME ---
const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [tick, setTick] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTick(t => !t);
        // Play sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.frequency.value = 1000;
          gain.gain.value = 0.5;
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch(e) {}
      }, (60 / bpm) * 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm]);

  return (
    <div className="flex flex-col items-center gap-8 bg-surface p-10 rounded-3xl border-4 border-border neo-brutalist-shadow">
      <div className="relative w-full h-12 flex justify-center items-end border-b-4 border-border pb-2">
        <motion.div 
          animate={{ x: isPlaying ? (tick ? 100 : -100) : 0, rotate: isPlaying ? (tick ? 20 : -20) : 0 }}
          transition={{ duration: (60 / bpm), ease: "linear" }}
          className="w-2 h-32 bg-primary origin-bottom absolute bottom-0 rounded-t-full"
        >
          <div className="w-8 h-8 rounded-full bg-text absolute -left-3 top-4 shadow-md" />
        </motion.div>
      </div>
      
      <div className="flex items-center gap-6 mt-16 w-full max-w-sm">
        <span className="font-bold text-xl">{bpm} BPM</span>
        <input 
          type="range" 
          min="40" max="240" 
          value={bpm} 
          onChange={e => setBpm(parseInt(e.target.value))}
          className="flex-1 accent-primary"
        />
      </div>
      
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={cn(
          "px-10 py-4 rounded-xl font-bold text-xl border-4 neo-brutalist-shadow transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none",
          isPlaying ? "bg-red-500 text-white border-red-900" : "bg-primary text-surface border-text"
        )}
      >
        {isPlaying ? "Stop" : "Mulai"}
      </button>
    </div>
  );
};

// --- TOY 10: DRAGGABLE BLOCKS ---
const DraggableBlocks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = [
    { color: "bg-red-500", label: "Meja" },
    { color: "bg-blue-500", label: "Kursi" },
    { color: "bg-yellow-500", label: "Buku" },
    { color: "bg-green-500", label: "Kopi" },
  ];

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] border-4 border-dashed border-border rounded-3xl relative overflow-hidden bg-surface flex flex-wrap gap-4 p-8 items-center justify-center"
    >
      <p className="absolute top-4 left-0 w-full text-center text-muted font-medium pointer-events-none select-none z-10 text-xl">Seret dan lempar kotak-kotak ini</p>
      
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className={cn(
            "w-32 h-32 rounded-2xl flex items-center justify-center font-bold text-white text-xl cursor-grab active:cursor-grabbing border-4 border-text shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-transform",
            block.color
          )}
        >
          {block.label}
        </motion.div>
      ))}
    </div>
  );
};


// --- MAIN SCREEN COMPONENT ---
export function PlaygroundScreen() {
  const toys = [
    { id: 'bubble', name: 'Bubble Wrap', icon: CircleDashed, component: BubbleWrap },
    { id: 'zen', name: 'Zen Breathing', icon: Timer, component: ZenBreathing },
    { id: 'sound', name: 'Neon Sound Pad', icon: Music, component: NeonSoundPad },
    { id: 'mouse', name: 'Mouse Trail', icon: MousePointer2, component: MouseTrail },
    { id: 'spinner', name: 'Fidget Spinner', icon: Settings, component: FidgetSpinner },
    { id: 'canvas', name: 'Mini Canvas', icon: PenTool, component: MiniCanvas },
    { id: 'dvd', name: 'DVD Logo', icon: Disc, component: DVDBounce },
    { id: 'particle', name: 'Particle Burst', icon: Sparkles, component: ParticleBurst },
    { id: 'metro', name: 'Metronome', icon: Gamepad2, component: Metronome },
    { id: 'blocks', name: 'Physics Blocks', icon: BoxSelect, component: DraggableBlocks },
  ];

  const [activeToy, setActiveToy] = useState(toys[0].id);
  
  const ActiveComponent = toys.find(t => t.id === activeToy)?.component || BubbleWrap;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 flex-1 flex flex-col items-center max-w-6xl">
      <div className="w-full flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Ruang Santai 🎮</h1>
          <p className="text-xl text-muted">Ambil jeda sejenak, mainkan fitur interaktif di bawah ini.</p>
        </div>
        <Link href="/">
          <button className="px-6 py-3 border-4 border-border rounded-xl font-bold flex items-center gap-2 hover:bg-surface transition-colors neo-brutalist-shadow-sm active:translate-y-1 active:translate-x-1 active:shadow-none">
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        {/* Sidebar Menu */}
        <div className="md:col-span-3 flex flex-col gap-2 bg-surface p-4 border-4 border-border rounded-3xl neo-brutalist-shadow h-fit max-h-[600px] overflow-y-auto">
          {toys.map(toy => {
            const Icon = toy.icon;
            const isActive = activeToy === toy.id;
            return (
              <button
                key={toy.id}
                onClick={() => setActiveToy(toy.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl font-bold text-left transition-all duration-200",
                  isActive 
                    ? "bg-primary text-surface shadow-[4px_4px_0px_#000] border-2 border-text -translate-y-1 -translate-x-1" 
                    : "hover:bg-muted/10 text-muted hover:text-text border-2 border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-surface" : "text-primary")} />
                {toy.name}
              </button>
            );
          })}
        </div>

        {/* Main Toy Area */}
        <div className="md:col-span-9 bg-surface/50 border-4 border-border rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToy}
              initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
