import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Play, RotateCcw, Clock, DollarSign, Cpu, 
  CheckCircle2, Flame, Award, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NetworkCompetitor {
  id: string;
  name: string;
  badge: string;
  logo: string;
  targetMs: number;
  gasCost: string;
  tps: string;
  finalityDesc: string;
  color: string;
  borderColor: string;
  glowColor: string;
  progress: number;
  status: 'idle' | 'running' | 'completed';
  finishTimeMs?: number;
}

export const SpeedRaceSimulator: React.FC = () => {
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  
  const [competitors, setCompetitors] = useState<NetworkCompetitor[]>([
    {
      id: 'monad',
      name: 'Monad Testnet',
      badge: 'Parallel EVM',
      logo: '⚡',
      targetMs: 410, // ~0.41s
      gasCost: '< $0.0001',
      tps: '10,000 TPS',
      finalityDesc: 'Single-Slot (~0.4s)',
      color: 'bg-gradient-to-r from-[#cf0f47] to-[#ff0b55]',
      borderColor: 'border-[#ff0b55]',
      glowColor: 'shadow-[0_0_30px_rgba(255,11,85,0.4)]',
      progress: 0,
      status: 'idle',
    },
    {
      id: 'arbitrum',
      name: 'Layer 2 Rollup',
      badge: 'Optimistic Batch',
      logo: '🔷',
      targetMs: 2400, // ~2.4s
      gasCost: '$0.05 - $0.20',
      tps: '~100 TPS',
      finalityDesc: 'Soft (Hard: 7 days)',
      color: 'bg-rose-900',
      borderColor: 'border-rose-950/40',
      glowColor: 'shadow-[0_0_20px_rgba(207,15,71,0.2)]',
      progress: 0,
      status: 'idle',
    },
    {
      id: 'ethereum',
      name: 'Ethereum L1',
      badge: 'Sequential EVM',
      logo: '💎',
      targetMs: 14000, // scaled down to 14s for interactive demo (real is 12-15m)
      gasCost: '$4.50 - $18.00',
      tps: '15 TPS',
      finalityDesc: '2 Epochs (12.8 min)',
      color: 'bg-zinc-700',
      borderColor: 'border-zinc-800',
      glowColor: 'shadow-none',
      progress: 0,
      status: 'idle',
    },
  ]);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const startRace = () => {
    setIsRacing(true);
    setHasCompleted(false);
    setElapsedMs(0);
    startRef.current = performance.now();

    setCompetitors((prev) =>
      prev.map((c) => ({
        ...c,
        progress: 0,
        status: 'running',
        finishTimeMs: undefined,
      }))
    );
  };

  const resetRace = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRacing(false);
    setHasCompleted(false);
    setElapsedMs(0);
    setCompetitors((prev) =>
      prev.map((c) => ({
        ...c,
        progress: 0,
        status: 'idle',
        finishTimeMs: undefined,
      }))
    );
  };

  useEffect(() => {
    if (!isRacing) return;

    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const currentElapsed = Math.round(now - startRef.current);
      setElapsedMs(currentElapsed);

      setCompetitors((prev) => {
        let allDone = true;
        const updated = prev.map((c) => {
          if (c.status === 'completed') return c;

          const pct = Math.min(100, Math.round((currentElapsed / c.targetMs) * 100));
          const isDone = pct >= 100;

          if (!isDone) allDone = false;

          // If Monad just finished, pop confetti
          if (c.id === 'monad' && isDone && c.status !== 'completed') {
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#cf0f47', '#ff0b55', '#ffdede', '#ffffff'],
              });
            } catch (e) {}
          }

          return {
            ...c,
            progress: pct,
            status: isDone ? ('completed' as const) : ('running' as const),
            finishTimeMs: isDone ? c.targetMs : undefined,
          };
        });

        // If Monad and Arbitrum completed, we can wrap up simulator view
        if (updated[0].status === 'completed') {
          setHasCompleted(true);
        }

        return updated;
      });
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRacing]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#cf0f47]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40">
              Parallel Execution Benchmark
            </span>
            <span className="text-xs text-zinc-400 font-mono">Live Finality Race Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Monad Speed Battle <span className="text-[#ff0b55]">⚡</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl mt-1">
            Compare transaction execution & escrow settlement times across Monad, Layer 2 Rollups, and Sequential EVMs in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetRace}
            disabled={!isRacing && elapsedMs === 0}
            className="px-4 py-3 rounded-full bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 text-xs font-black uppercase tracking-tight transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={startRace}
            disabled={isRacing && !hasCompleted}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight transition flex items-center gap-2 shadow-[0_0_30px_rgba(207,15,71,0.4)] cursor-pointer disabled:opacity-50 border border-[#ffdede]/30"
          >
            <Zap className="w-4 h-4 text-[#ffdede]" />
            <span>{isRacing ? 'Race in Progress...' : 'Start Speed Race'}</span>
          </button>
        </div>
      </div>

      {/* Live Race Tracks */}
      <div className="mt-8 space-y-4">
        {competitors.map((network, index) => {
          const isWinner = network.id === 'monad' && network.status === 'completed';

          return (
            <motion.div
              key={network.id}
              layout
              className={`p-6 rounded-3xl bg-[#120208] border-2 transition-all relative overflow-hidden ${
                network.id === 'monad'
                  ? 'border-[#ff0b55] shadow-[0_0_40px_rgba(255,11,85,0.25)]'
                  : 'border-[#cf0f47]/20'
              }`}
            >
              {/* Winner Glow */}
              {isWinner && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff0b55]/10 rounded-full blur-3xl pointer-events-none" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                
                {/* Network Identity */}
                <div className="flex items-center gap-3">
                  <div className="text-2xl sm:text-3xl">{network.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {network.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-black/40 text-zinc-300 border border-white/10">
                        {network.badge}
                      </span>
                      {isWinner && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#cf0f47]/30 text-[#ffdede] border border-[#ff0b55]/50 animate-pulse">
                          🏆 1st Place (Winner)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mt-1">
                      <span>Throughput: <strong className="text-white">{network.tps}</strong></span>
                      <span>Gas Fee: <strong className="text-[#ffdede]">{network.gasCost}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Milliseconds / Latency */}
                <div className="text-right font-mono">
                  <div className="text-2xl font-black text-[#ffdede]">
                    {network.status === 'completed' 
                      ? `${(network.targetMs / 1000).toFixed(2)}s`
                      : isRacing 
                        ? `${(elapsedMs / 1000).toFixed(2)}s`
                        : `${(network.targetMs / 1000).toFixed(2)}s`}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {network.finalityDesc}
                  </div>
                </div>

              </div>

              {/* Progress Bar Track */}
              <div className="relative w-full h-4 bg-[#000000] rounded-full overflow-hidden border border-[#cf0f47]/30 p-0.5">
                <motion.div
                  className={`h-full rounded-full transition-all duration-75 ${
                    network.id === 'monad'
                      ? 'bg-gradient-to-r from-[#cf0f47] via-[#ff0b55] to-[#ffdede]'
                      : network.color
                  }`}
                  style={{ width: `${network.progress}%` }}
                />
              </div>

              {/* Speed Status Ticker */}
              <div className="flex items-center justify-between text-[11px] font-mono mt-3 text-zinc-400">
                <span className="flex items-center gap-1.5">
                  {network.status === 'completed' ? (
                    <span className="text-[#ffdede] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff0b55]" />
                      Finalized & Settled in {network.targetMs}ms
                    </span>
                  ) : network.status === 'running' ? (
                    <span className="text-[#ff0b55] font-bold animate-pulse flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      Executing EVM Bytecode ({network.progress}%)...
                    </span>
                  ) : (
                    <span>Ready at Starting Line</span>
                  )}
                </span>

                <span>{network.progress}% Complete</span>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Technical Architecture Comparison Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#120208] border border-[#cf0f47]/30">
          <div className="w-10 h-10 rounded-2xl bg-[#cf0f47]/20 text-[#ff0b55] flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-[#ffdede] uppercase tracking-tight">Parallel EVM Execution</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Unlike legacy EVMs that process one transaction at a time sequentially, Monad executes thousands of escrow transactions concurrently across multiple CPU cores.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#120208] border border-[#cf0f47]/30">
          <div className="w-10 h-10 rounded-2xl bg-[#cf0f47]/20 text-[#ffdede] flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-[#ff0b55]" />
          </div>
          <h4 className="text-sm font-black text-[#ffdede] uppercase tracking-tight">MonadBFT Single-Slot Finality</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Consensus and execution finalize in a single 400ms block slot. When a mentor clicks "Confirm Milestone", funds reach the student's wallet instantaneously.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#120208] border border-[#cf0f47]/30">
          <div className="w-10 h-10 rounded-2xl bg-[#cf0f47]/20 text-[#ff0b55] flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-[#ffdede] uppercase tracking-tight">Sub-Cent Micro-Escrows</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Optimized gas schedules allow creating small 0.5 MON rewards or bounties without losing 20-50% of the value to network fees.
          </p>
        </div>
      </div>

    </div>
  );
};
