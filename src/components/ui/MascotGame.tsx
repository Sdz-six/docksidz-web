"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertTriangle, RotateCcw, Crown, Star } from "lucide-react";

interface MascotGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MascotGame({ isOpen, onClose }: MascotGameProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Pemain adalah X, Bot adalah O
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });
  const [showReward, setShowReward] = useState(false);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // baris
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // kolom
      [0, 4, 8], [2, 4, 6] // diagonal
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Menentukan Level berdasarkan skor (Max Level 3)
  const currentLevel = Math.min(3, score.player + 1);

  // Logika AI Cerdas (Mencari langkah menang atau memblokir)
  const findWinningMove = (boardState: (string | null)[], playerMark: string) => {
    const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const line = [boardState[a], boardState[b], boardState[c]];
      if (line.filter(x => x === playerMark).length === 2 && line.includes(null)) {
        return lines[i][line.indexOf(null)];
      }
    }
    return null;
  };

  // Bot (Mascot) Logika
  useEffect(() => {
    if (!isXNext && !winner && board.includes(null) && !showReward) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        let moveIdx: number | null = null;

        // Level 1: 100% Random
        // Level 2: Bisa Menang, Sisanya Random
        // Level 3: Bisa Menang, Bisa Blokir, Ambil Tengah, Sisanya Random

        if (currentLevel >= 2) {
          // Coba cari jalan menang sendiri
          moveIdx = findWinningMove(board, 'O');
        }

        if (currentLevel >= 3 && moveIdx === null) {
          // Blokir player jika player mau menang
          moveIdx = findWinningMove(board, 'X');
          // Ambil titik tengah jika kosong
          if (moveIdx === null && board[4] === null) {
            moveIdx = 4;
          }
        }

        // Jika tidak ada jalan cerdas (atau Level 1), ambil random
        if (moveIdx === null) {
          moveIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
        
        const newBoard = [...board];
        newBoard[moveIdx] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
        
        const newWinner = calculateWinner(newBoard);
        if (newWinner) {
          setWinner(newWinner);
          setScore(s => ({ ...s, bot: s.bot + 1 }));
        } else if (!newBoard.includes(null)) {
          setWinner('Draw');
        }
      }, 600); // Jeda berfikir bot
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, currentLevel, showReward]);

  const handleClick = (i: number) => {
    if (!isXNext || board[i] || winner || showReward) return; 
    
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      const newScore = score.player + 1;
      setScore(s => ({ ...s, player: newScore }));
      
      // Jika menang 3 kali berturut-turut/total
      if (newScore === 3) {
        setTimeout(() => setShowReward(true), 1000);
      }
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const fullReset = () => {
    setScore({ player: 0, bot: 0 });
    setShowReward(false);
    resetGame();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Efek Hadiah Saat Menang 3 Kali */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#F59E0B]/90 backdrop-blur-md overflow-hidden pointer-events-auto"
          >
            {/* Hujan Bintang Emas */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0, scale: Math.random() * 1.5 + 0.5 }}
                animate={{ y: window.innerHeight + 100, rotate: 360 }}
                transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, ease: "linear" }}
                className="absolute text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              >
                <Star fill="currentColor" size={30} />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 1 }}
              className="relative z-10 flex flex-col items-center p-8 bg-surface border-8 border-primary rounded-3xl neo-brutalist-shadow shadow-[0_0_100px_rgba(255,255,255,0.5)]"
            >
              <Crown className="w-32 h-32 text-yellow-500 animate-bounce mb-6 drop-shadow-[4px_4px_0_#1A1A2E]" />
              <h1 className="text-5xl md:text-6xl font-black text-primary text-center mb-4 tracking-tighter">SANG DEWA<br/>TIC TAC TOE!</h1>
              <p className="text-xl font-bold text-center mb-8 px-4 py-2 bg-yellow-200 border-2 border-border rounded-lg">
                Anda telah mengalahkan Maskot tingkat tertinggi!<br/>Hormat kami untuk kecerdasan Anda. 🙇‍♂️
              </p>
              <button 
                onClick={fullReset}
                className="px-8 py-4 bg-primary text-white font-black text-2xl border-4 border-border rounded-xl neo-brutalist-shadow hover:scale-110 active:scale-95 transition-transform"
              >
                KLAIM KEMENANGAN & KELUAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-surface border-4 border-border rounded-2xl neo-brutalist-shadow overflow-hidden max-w-[500px] w-full"
      >
        <div className="flex justify-between items-center p-4 border-b-4 border-border bg-primary text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-xl font-black tracking-widest">LEVEL {currentLevel}: {currentLevel === 1 ? 'EASY' : currentLevel === 2 ? 'MEDIUM' : 'IMPOSSIBLE'}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-red-500 border-2 border-border rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Scoreboard */}
          <div className="flex justify-between w-full mb-8">
            <div className={`px-4 py-2 border-4 border-border rounded-xl neo-brutalist-shadow flex flex-col items-center w-[120px] transition-colors ${isXNext && !winner ? 'bg-primary text-white' : 'bg-background'}`}>
              <span className="text-xs font-bold uppercase mb-1">Anda (X)</span>
              <span className="text-3xl font-black">{score.player}</span>
            </div>
            
            {/* Progress Menuju Hadiah */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-[10px] font-bold text-muted uppercase mb-1">Progress Hadiah</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-6 h-6 ${score.player >= star ? 'text-yellow-500 fill-yellow-500 animate-pulse' : 'text-border/30'}`} 
                  />
                ))}
              </div>
            </div>

            <div className={`px-4 py-2 border-4 border-border rounded-xl neo-brutalist-shadow flex flex-col items-center w-[120px] transition-colors ${!isXNext && !winner ? 'bg-red-500 text-white' : 'bg-background'}`}>
              <span className="text-xs font-bold uppercase mb-1">Maskot (O)</span>
              <span className="text-3xl font-black">{score.bot}</span>
            </div>
          </div>

          {/* Board */}
          <div className="grid grid-cols-3 gap-3 mb-8 bg-border p-3 rounded-xl neo-brutalist-shadow">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                className={`w-24 h-24 sm:w-28 sm:h-28 bg-surface border-4 border-border rounded-lg flex items-center justify-center text-6xl font-black neo-brutalist-shadow-sm transition-transform ${!cell && isXNext && !winner ? 'hover:bg-primary/10 hover:scale-105 active:scale-95' : ''} ${cell === 'X' ? 'text-primary' : 'text-red-500'}`}
                disabled={cell !== null || !isXNext || winner !== null}
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          {/* Status / Controls */}
          <div className="h-16 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {winner ? (
                <motion.div
                  key="winner"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center"
                >
                  <h3 className={`text-2xl font-black mb-4 ${winner === 'X' ? 'text-primary' : winner === 'O' ? 'text-red-500' : 'text-text'}`}>
                    {winner === 'Draw' ? 'SERI!' : winner === 'X' ? 'ANDA MENANG! 🎉' : 'MASKOT MENANG! 🤖'}
                  </h3>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-black font-black border-4 border-border rounded-xl neo-brutalist-shadow hover:-translate-y-1 active:translate-y-0 transition-transform"
                  >
                    <RotateCcw className="w-5 h-5" /> LANJUT MAIN
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold text-muted animate-pulse"
                >
                  {isXNext ? 'Giliran Anda memilih kotak...' : 'Maskot sedang berfikir...'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
