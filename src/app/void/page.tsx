"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { ArrowLeft } from "lucide-react";
import "./void.css";

const CONFIG = {
  itemCount: 20,
  starCount: 150,
  zGap: 800,
  camSpeed: 2.5,
  loopSize: 0, // Calculated below
  colors: ['#ff003c', '#00f3ff', '#ccff00', '#ffffff']
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const TEXTS = ["[KERNEL_PANIC]", "[DATA_BREACH]", "[SYNTAX_ERROR]", "[NODE_FATAL]", "[SYSTEM_FAILURE]", "[VOID_ACCESS]", "[MEMORY_LEAK]", "[HYPER_DRIVE]"];

export default function VoidPage() {
  const worldRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const velReadoutRef = useRef<HTMLElement>(null);
  const coordReadoutRef = useRef<HTMLElement>(null);
  const fpsReadoutRef = useRef<HTMLElement>(null);
  
  // Refs to hold individual item DOM elements for fast mutation
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State
  const stateRef = useRef({
    scroll: 0,
    velocity: 0,
    targetSpeed: 0,
    mouseX: 0,
    mouseY: 0
  });

  // Calculate items once
  const { itemsData, starsData } = useMemo(() => {
    const items = [];
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const isHeading = i % 4 === 0;
      const angle = (i / CONFIG.itemCount) * Math.PI * 6;
      // Gunakan nilai fallback jika window belum tersedia
      const wWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const wHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      
      const radius = 400 + Math.random() * 200;
      const x = isHeading ? 0 : Math.cos(angle) * (wWidth * 0.3);
      const y = isHeading ? 0 : Math.sin(angle) * (wHeight * 0.3);
      const rot = isHeading ? 0 : (Math.random() - 0.5) * 30;

      items.push({
        id: `item-${i}`,
        type: isHeading ? 'text' : 'card',
        text: TEXTS[i % TEXTS.length],
        x, y, rot,
        baseZ: -i * CONFIG.zGap,
        index: i
      });
    }

    const stars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
      stars.push({
        id: `star-${i}`,
        type: 'star',
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        baseZ: -Math.random() * CONFIG.loopSize
      });
    }

    return { itemsData: items, starsData: stars };
  }, []);

  useEffect(() => {
    // Prevent SSR hydration mismatch and window issues
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Lenis
    const lenis = new Lenis({
      // @ts-ignore
      smooth: true,
      lerp: 0.08,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: true
    });

    lenis.on('scroll', ({ scroll, velocity }: any) => {
      stateRef.current.scroll = scroll;
      stateRef.current.targetSpeed = velocity;
    });

    let lastTime = 0;
    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);

      const state = stateRef.current;
      const delta = time - lastTime;
      lastTime = time;

      if (time % 10 < 1 && fpsReadoutRef.current) {
        fpsReadoutRef.current.innerText = Math.round(1000 / (delta || 1)).toString();
      }

      state.velocity += (state.targetSpeed - state.velocity) * 0.1;

      if (velReadoutRef.current) velReadoutRef.current.innerText = Math.abs(state.velocity).toFixed(2);
      if (coordReadoutRef.current) coordReadoutRef.current.innerText = `${state.scroll.toFixed(0)}`;

      // 1. Camera Tilt & Shake
      const tiltX = state.mouseY * 5 - state.velocity * 0.5;
      const tiltY = state.mouseX * 5;

      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      // 2. Dynamic Perspective (Warp)
      const baseFov = 1000;
      const fov = baseFov - Math.min(Math.abs(state.velocity) * 10, 600);
      if (viewportRef.current) {
        viewportRef.current.style.perspective = `${fov}px`;
      }

      // 4. Item Loop
      const cameraZ = state.scroll * CONFIG.camSpeed;

      const allItems = [...itemsData, ...starsData];
      
      allItems.forEach((item, idx) => {
        const el = itemRefs.current[idx];
        if (!el) return;

        let relZ = item.baseZ + cameraZ;
        const modC = CONFIG.loopSize;
        let vizZ = ((relZ % modC) + modC) % modC;
        if (vizZ > 500) vizZ -= modC;

        let alpha = 1;
        if (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        
        if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400);
        if (alpha < 0) alpha = 0;

        el.style.opacity = alpha.toString();

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

          if (item.type === 'star') {
            const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10));
            trans += ` scale3d(1, 1, ${stretch})`;
          } else if (item.type === 'text') {
            trans += ` rotateZ(${item.rot}deg)`;
            if (Math.abs(state.velocity) > 1) {
              const offset = state.velocity * 2;
              el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`;
            } else {
              el.style.textShadow = 'none';
            }
          } else {
            const t = time * 0.001;
            const float = Math.sin(t + item.x) * 10;
            trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
          }

          el.style.transform = trans;
        }
      });

      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [itemsData, starsData]);

  // Combined data for rendering
  const allItemsToRender = [...itemsData, ...starsData];

  return (
    <div className="void-container">
      {/* OVERLAYS */}
      <div className="scanlines"></div>
      <div className="vignette"></div>
      <div className="noise"></div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-top">
          <span>SYS.READY</span>
          <div className="hud-line"></div>
          <span>FPS: <strong ref={fpsReadoutRef}>60</strong></span>
        </div>
        <div 
          className="center-nav"
          style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          SCROLL VELOCITY // <strong ref={velReadoutRef}>0.00</strong>
        </div>
        <div className="hud-bottom">
          <span>COORD: <strong ref={coordReadoutRef}>000.000</strong></span>
          <div className="hud-line"></div>
          <Link href="/#tools" className="hover:text-primary transition-colors flex items-center z-50 pointer-events-auto">
            <ArrowLeft className="w-4 h-4 mr-2" /> EXIT VOID
          </Link>
        </div>
      </div>

      {/* 3D WORLD */}
      <div className="viewport" ref={viewportRef}>
        <div className="world" ref={worldRef}>
          {allItemsToRender.map((item, idx) => {
            if (item.type === 'star') {
              return (
                <div 
                  key={item.id} 
                  className="star" 
                  ref={(el) => { itemRefs.current[idx] = el; }}
                />
              );
            }
            if (item.type === 'text') {
              return (
                <div 
                  key={item.id} 
                  className="item" 
                  ref={(el) => { itemRefs.current[idx] = el; }}
                >
                  <div className="big-text">DOCKSIDZ // BRUTAL</div>
                </div>
              );
            }
            // Card
            const randId = Math.floor(Math.random() * 9999);
            return (
              <div 
                key={item.id} 
                className="item" 
                ref={(el) => { itemRefs.current[idx] = el; }}
              >
                <div className="void-card">
                  <div className="card-header">
                    <span className="card-id">ID-{randId}</span>
                    <div style={{ width: '10px', height: '10px', background: 'var(--accent)' }}></div>
                  </div>
                  <h2>{item.text}</h2>
                  <div className="card-footer">
                    <span>GRID: {Math.floor(Math.random() * 10)}x{Math.floor(Math.random() * 10)}</span>
                    <span>DATA_SIZE: {(Math.random() * 100).toFixed(1)}MB</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontSize: '4rem', opacity: 0.1, fontWeight: 900 }}>
                    0{(item as any).index}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SCROLL PROXY FOR LENIS */}
      <div className="scroll-proxy"></div>
    </div>
  );
}
