/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Play, 
  BookOpen, 
  ArrowLeft, 
  History, 
  Heart, 
  Flame, 
  Star, 
  CheckCircle2, 
  XCircle,
  Clock,
  Loader2,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Question, Player, Difficulty, GameState, AppState } from './types.ts';
import { questionsDB, INITIAL_RANKING } from './constants.ts';

const DIFFICULTY_SETTINGS = {
  easy: { time: 20, multiplier: 1 },
  medium: { time: 15, multiplier: 1.5 },
  hard: { time: 10, multiplier: 2 },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [ranking, setRanking] = useState<Player[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize ranking from local storage
  useEffect(() => {
    const savedRanking = localStorage.getItem('mariae_ranking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    } else {
      setRanking(INITIAL_RANKING);
      localStorage.setItem('mariae_ranking', JSON.stringify(INITIAL_RANKING));
    }
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (type: 'click' | 'correct' | 'wrong' | 'win' | 'lose') => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    switch(type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'correct':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'wrong':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'win':
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(500, now + 0.1);
        osc.frequency.setValueAtTime(600, now + 0.2);
        osc.frequency.setValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
      case 'lose':
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  };

  const startGame = useCallback((cat: string) => {
    setCategory(cat);
    setGameState('loading');
    playSound('click');
    
    // Simulate fetching data
    setTimeout(() => {
      const pool = [...questionsDB[cat]];
      const shuffled = pool.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentQIndex(0);
      setScore(0);
      setLives(3);
      setCombo(0);
      setMaxCombo(0);
      setIsAnswered(false);
      setSelectedOption(null);
      setGameState('game');
      setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
    }, 1500);
  }, [difficulty]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const win = lives > 0;
    setGameState('end');
    
    const isTopScore = ranking.length < 10 || score > (ranking[ranking.length - 1]?.score || 0);
    setIsHighScore(isTopScore && score > 0);

    if (win) {
      playSound('win');
    } else {
      playSound('lose');
    }
  }, [lives, ranking, score]);

  const handleNextQuestion = useCallback(() => {
    if (lives <= 0 || currentQIndex + 1 >= questions.length) {
      endGame();
    } else {
      setCurrentQIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
    }
  }, [currentQIndex, questions.length, lives, difficulty, endGame]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOption(optionIndex);
    
    const correctIndex = questions[currentQIndex].a;
    if (optionIndex === correctIndex) {
      playSound('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      
      const timeBonus = Math.floor(timeLeft * 10);
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const comboBonus = newCombo > 1 ? (newCombo * 50) : 0;
      setScore(prev => Math.floor(prev + (100 + timeBonus + comboBonus) * settings.multiplier));
    } else {
      playSound('wrong');
      setCombo(0);
      setLives(prev => prev - 1);
    }

    setTimeout(handleNextQuestion, 1500);
  };

  useEffect(() => {
    if (gameState === 'game' && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            playSound('wrong');
            setCombo(0);
            setLives(l => l - 1);
            setIsAnswered(true);
            setTimeout(handleNextQuestion, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswered, handleNextQuestion]);

  const saveHighScore = () => {
    if (!playerName.trim()) return;
    const newRanking = [...ranking, { name: playerName, score }].sort((a, b) => b.score - a.score).slice(0, 10);
    setRanking(newRanking);
    localStorage.setItem('mariae_ranking', JSON.stringify(newRanking));
    setIsHighScore(false);
    setGameState('ranking');
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full p-12 text-center"
            onClick={initAudio}
          >
            <div className="absolute top-12 left-12 flex items-center space-x-3 opacity-60">
              <span className="text-[10px] uppercase tracking-[0.4em] text-stone-gold">Edición Trivia</span>
              <div className="w-px h-3 bg-white/20"></div>
            </div>
            
            <div className="mb-12 flex flex-col items-center">
              <h1 className="text-6xl font-serif italic tracking-tighter text-white mb-2 flex items-center gap-2">
                MariaE
              </h1>
              <div className="h-px w-24 bg-stone-gold/20 mb-8 mt-2"></div>
              <p className="text-stone-gold font-light max-w-xs leading-relaxed text-[11px] uppercase tracking-[0.5em] text-center opacity-80">
                Abrazamos tus curvas
              </p>
            </div>
            
            <div className="w-full space-y-6 max-w-xs z-10">
              <button 
                onClick={() => setGameState('categories')}
                className="w-full bg-stone-gold text-deep-black font-bold py-4 px-8 uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-stone-gold/90 transition-all flex items-center justify-center gap-3 group"
              >
                <Play size={14} fill="currentColor" /> Iniciar Desafío
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="flex-1 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-bold py-4 px-4 uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} /> Guía
                </button>
                <button 
                  onClick={() => setGameState('ranking')}
                  className="flex-1 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-bold py-4 px-4 uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={14} /> Récords
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'categories':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full p-12"
          >
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
              <button onClick={() => setGameState('start')} className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                <ArrowLeft size={16} />
                <span className="text-[10px] uppercase tracking-widest">Volver</span>
              </button>
              <h2 className="text-xl font-serif italic">Configuración</h2>
              <div className="w-12"></div>
            </div>

            <section className="mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Intensidad</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-4 px-2 border transition-all text-[10px] uppercase tracking-widest font-bold ${
                      difficulty === d 
                      ? 'bg-stone-gold border-stone-gold text-deep-black shadow-lg shadow-stone-gold/10 scale-105' 
                      : 'border-white/10 text-white/40 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex-1 flex flex-col">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Seleccionar Colección</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1 pb-8">
                {Object.keys(questionsDB).map(cat => (
                  <button
                    key={cat}
                    onClick={() => startGame(cat)}
                    className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-stone-gold/30 p-6 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                       <span className="text-4xl">
                        {cat === 'Fajas' ? '📦' : 
                         cat === 'Postquirúrgicos' ? '🏥' : 
                         cat === 'Moldeadores' ? '🍑' : 
                         cat === 'Recuperación' ? '🛌' : 
                         cat === 'Ropa Deportiva' ? '👟' : '🎀'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-[0.2em] relative z-10 uppercase text-center">{cat}</span>
                    <div className="w-8 h-[1px] bg-stone-gold/30 mt-3 group-hover:w-16 transition-all"></div>
                  </button>
                ))}
              </div>
            </section>
          </motion.div>
        );

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-deep-black">
            <div className="relative w-20 h-20 mb-8">
              <Loader2 className="w-full h-full text-stone-gold animate-spin opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif italic text-stone-gold">M</span>
              </div>
            </div>
            <h2 className="text-xl font-serif italic mb-2">Sincronizando Archivos</h2>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Accediendo al catálogo central</p>
          </div>
        );

      case 'game':
        const currentQ = questions[currentQIndex];
        const maxTime = DIFFICULTY_SETTINGS[difficulty].time;
        const progress = (timeLeft / maxTime) * 100;

        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            {/* Top Bar */}
            <nav className="h-20 flex items-center justify-between px-8 border-b border-white/5 z-10">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/40">Puntos</span>
                <span className="font-mono text-lg text-stone-gold leading-none">{score}</span>
              </div>
              
              <div className="flex flex-col items-center">
                 <span className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-1 leading-none">
                  {currentQIndex + 1} / {questions.length}
                </span>
                 <div className="flex gap-1 items-center">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i < lives ? 'bg-stone-gold shadow-[0_0_8px_rgba(197,164,126,0.5)]' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-white/40">Racha</span>
                <div className="flex items-center gap-1 font-mono text-lg text-orange-400/80 leading-none">
                  <Flame size={12} className="opacity-60" /> {combo}
                </div>
              </div>
            </nav>

            {/* Main Question Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-12 relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-serif leading-tight max-w-xl mx-auto text-white group">
                    {currentQ.q}
                    <div className="w-12 h-px bg-stone-gold/30 mx-auto mt-6 group-hover:w-24 transition-all duration-700"></div>
                  </h2>
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                {currentQ.options.map((opt, idx) => {
                  let status = 'default';
                  if (isAnswered) {
                    if (idx === currentQ.a) status = 'correct';
                    else if (idx === selectedOption) status = 'wrong';
                    else status = 'dimmed';
                  }

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(idx)}
                      className={`
                        group relative flex flex-col items-start p-6 border transition-all text-left overflow-hidden
                        ${status === 'default' ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20' : ''}
                        ${status === 'correct' ? 'border-success bg-success/10 text-success' : ''}
                        ${status === 'wrong' ? 'border-danger bg-danger/10 text-danger animate-shake' : ''}
                        ${status === 'dimmed' ? 'border-white/5 opacity-30 grayscale' : ''}
                      `}
                    >
                      <span className={`text-[9px] font-mono mb-1 uppercase tracking-widest ${status === 'correct' ? 'text-success' : status === 'wrong' ? 'text-danger' : 'text-stone-gold'}`}>
                        Opción {labels[idx]}
                      </span>
                      <span className="text-lg font-light flex items-center justify-between w-full">
                        {opt}
                        {status === 'correct' && <CheckCircle2 size={16} className="ml-2" />}
                        {status === 'wrong' && <XCircle size={16} className="ml-2" />}
                      </span>
                      
                      {status === 'default' && (
                        <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-stone-gold transition-all duration-500 group-hover:w-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer / Timer */}
            <footer className="h-24 flex items-center justify-between px-12 border-t border-white/5 bg-white/[0.01]">
              <div className="flex flex-col w-32">
                <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Tiempo Restante</span>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-lg leading-none ${timeLeft <= 5 ? 'text-danger animate-pulse' : 'text-white'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                  <div className="flex-1 h-0.5 bg-white/5 overflow-hidden">
                    <motion.div 
                      className={`h-full ${timeLeft <= 5 ? 'bg-danger' : 'bg-stone-gold'}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 hidden sm:block">
                  Modo {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </div>
              </div>
            </footer>
          </motion.div>
        );

      case 'end':
        const isWin = lives > 0;
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full p-12 text-center"
          >
            <div className="mb-12">
              <span className={`text-[11px] uppercase tracking-[0.4em] mb-4 block ${isWin ? 'text-success' : 'text-danger'}`}>
                {isWin ? 'Desafío Completado' : 'Sesión Terminada'}
              </span>
              <h2 className="text-5xl font-serif italic text-white flex items-center justify-center gap-4">
                {isWin ? 'Maestría' : 'Intento'} 
                <div className="w-16 h-px bg-white/10"></div>
              </h2>
            </div>
            
            <div className="mb-16">
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-2">Evaluación Final</p>
              <div className="text-8xl font-serif text-stone-gold font-light tracking-tighter">{score}</div>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/40">Racha Máx</p>
                  <p className="font-mono text-white">{maxCombo}</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/40">Precisión</p>
                  <p className="font-mono text-white">{Math.round((questions.length - (3 - lives)) / questions.length * 100)}%</p>
                </div>
              </div>
            </div>

            {isHighScore && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full border border-stone-gold/20 bg-stone-gold/[0.03] p-8 mb-12"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Star size={12} className="text-stone-gold" fill="currentColor" />
                  <span className="text-[10px] font-bold text-stone-gold uppercase tracking-[0.4em]">Récord Elite Detectado</span>
                  <Star size={12} className="text-stone-gold" fill="currentColor" />
                </div>
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 15))}
                  placeholder="IDENTIDAD"
                  className="w-full bg-white/5 border-b border-white/20 py-3 text-center text-xl font-light text-white outline-none focus:border-stone-gold placeholder:text-white/10 uppercase tracking-widest"
                />
                <button 
                  onClick={saveHighScore}
                  className="w-full bg-stone-gold text-deep-black font-bold py-4 mt-8 uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors"
                >
                  Autorizar Entrada
                </button>
              </motion.div>
            )}

            <div className="w-full space-y-4 max-w-xs">
              <button 
                onClick={() => setGameState('categories')}
                className="w-full bg-white/5 text-white font-bold py-4 border border-white/10 uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-deep-black transition-all"
              >
                Rejugar Archivos
              </button>
              <button 
                onClick={() => setGameState('start')}
                className="w-full text-white/40 hover:text-white font-bold py-4 uppercase tracking-[0.2em] text-[10px] transition-all"
              >
                Volver a la Galería
              </button>
            </div>
          </motion.div>
        );

      case 'ranking':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full p-12"
          >
            <div className="text-center mb-16 border-b border-white/5 pb-12">
              <Trophy className="w-12 h-12 text-stone-gold mx-auto mb-6 opacity-30" />
              <h2 className="text-4xl font-serif italic text-white mb-2">Registro Elite</h2>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">El escalafón más alto del conocimiento</p>
            </div>

            <div className="flex-1 mb-8 overflow-hidden">
              <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar">
                {ranking.map((p, i) => (
                  <div key={i} className={`group flex justify-between items-center p-6 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i === 0 ? 'bg-stone-gold/5 border-stone-gold/20' : ''}`}>
                    <div className="flex items-center gap-6">
                      <span className={`font-mono text-xs ${i < 3 ? 'text-stone-gold' : 'text-white/20'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm uppercase tracking-widest font-light ${i === 0 ? 'text-white font-medium' : 'text-white/60'}`}>
                        {p.name}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-stone-gold">
                      {p.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setGameState('start')}
              className="w-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-bold py-5 uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft size={14} /> Volver a la Galería
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center p-0 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-sm h-screen sm:h-[850px] bg-[#050505] text-[#e5e5e5] sm:border border-white/5 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Advanced Decorative Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #443322 0%, transparent 70%)' }}></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to bottom, #c5a47e 0%, transparent 2%, transparent 98%, #c5a47e 100%)' }}></div>
        <div className="absolute h-[1px] w-full bg-white/5 top-20 pointer-events-none"></div>
        <div className="absolute h-[1px] w-full bg-white/5 bottom-24 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          <div key={gameState} className="relative z-10 flex-1 overflow-hidden flex flex-col">
            {renderScreen()}
          </div>
        </AnimatePresence>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#050505]/95 z-40 backdrop-blur-xl"
                onClick={() => setShowTutorial(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-[#080808] border border-white/10 p-10 z-50 shadow-2xl"
              >
                <div className="text-center mb-10">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-stone-gold mb-4 block">Instrucciones</span>
                  <h2 className="text-3xl font-serif italic text-white flex items-center justify-center gap-4">
                    La Guía
                    <div className="w-8 h-px bg-stone-gold/30"></div>
                  </h2>
                </div>

                <div className="space-y-8 mb-12">
                  <div className="flex gap-6 items-start">
                    <Star size={14} className="text-stone-gold mt-1 shrink-0" fill="currentColor" />
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Objetivo</h3>
                      <p className="text-xs font-light text-white/80 leading-relaxed">Descifra el legado. Las respuestas correctas validan tu experiencia en la artesanía de MariaE.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <Clock size={14} className="text-stone-gold mt-1 shrink-0" />
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Restricción Temporal</h3>
                      <p className="text-xs font-light text-white/80 leading-relaxed">Cada pregunta está regida por una ventana temporal estricta determinada por la dificultad elegida.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <Heart size={14} className="text-stone-gold mt-1 shrink-0" fill="currentColor" />
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Integridad Vital</h3>
                      <p className="text-xs font-light text-white/80 leading-relaxed">Posees tres indicadores vitales. Errores o agotamiento temporal resultarán en su consumo.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-stone-gold text-deep-black font-bold py-4 uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors"
                >
                  Proceder a la Galería
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
