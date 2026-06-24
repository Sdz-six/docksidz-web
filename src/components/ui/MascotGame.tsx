"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, AlertTriangle, RotateCcw } from "lucide-react";

interface MascotGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MascotGame({ isOpen, onClose }: MascotGameProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Pemain adalah X, Bot adalah O
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, bot: 0 });

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

  // Bot (Mascot) Logika
  useEffect(() => {
    if (!isXNext && !winner && board.includes(null)) {
      const timer = setTimeout(() => {
        // AI Super Sederhana (Random)
        const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        
        const newBoard = [...board];
        newBoard[randomIdx] = 'O';
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
  }, [isXNext, board, winner]);

  const handleClick = (i: number) => {
    if (!isXNext || board[i] || winner) return; // Hanya bisa klik jika giliran player
    
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScore(s => ({ ...s, player: s.player + 1 }));
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-surface border-4 border-border rounded-2xl neo-brutalist-shadow overflow-hidden max-w-[500px] w-full"
      >
        <div className="flex justify-between items-center p-4 border-b-4 border-border bg-primary text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-xl font-black tracking-widest">RAHASIA: TIC TAC TOE</h2>
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
                    <RotateCcw className="w-5 h-5" /> MAIN LAGI
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
