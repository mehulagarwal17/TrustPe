import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ExternalLink, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { MONAD_EXPLORER_URL } from '../config/monadChain';

interface SpeedConfirmationBadgeProps {
  durationMs: number;
  txHash?: string;
  blockNumber?: number;
  type: 'create' | 'release';
  onClose?: () => void;
}

export const SpeedConfirmationBadge: React.FC<SpeedConfirmationBadgeProps> = ({
  durationMs,
  txHash,
  blockNumber,
  type,
  onClose,
}) => {
  const seconds = (durationMs / 1000).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative overflow-hidden rounded-3xl bg-[#120208] p-6 border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.35)]"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#cf0f47]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#ff0b55]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Speed punchline */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#cf0f47]/20 border border-[#ff0b55]/40 flex items-center justify-center text-[#ff0b55] shadow-[0_0_20px_rgba(207,15,71,0.3)]">
            <Zap className="w-8 h-8 text-[#ffdede] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#cf0f47]/30 text-[#ffdede] border border-[#ff0b55]/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {type === 'create' ? 'Funds Locked in Escrow' : 'Milestone Confirmed & Paid'}
              </span>
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Monad Testnet</span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-[#ffdede] font-mono">
                {seconds}s
              </span>
              <span className="text-xl font-mono text-[#ff0b55] font-black">
                ({durationMs} ms)
              </span>
              <span className="text-xs font-black uppercase text-[#ffdede] bg-[#cf0f47]/40 border border-[#ff0b55]/40 px-2.5 py-1 rounded-full ml-1 tracking-wider">
                Sub-Second Finality
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 mt-1 uppercase font-bold tracking-wider">
              Single-slot consensus confirmation on Monad.
            </p>
          </div>
        </div>

        {/* Right: Explorer & Block Info */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#cf0f47]/30">
          {blockNumber && (
            <div className="text-xs text-zinc-400 font-mono font-bold flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-[#ff0b55]" />
              <span>Block #{blockNumber.toLocaleString()}</span>
            </div>
          )}

          {txHash && (
            <a
              href={`${MONAD_EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-tight bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white transition shadow-lg shadow-[#cf0f47]/30 cursor-pointer border border-[#ffdede]/30"
            >
              <span>View on MonadVision</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ffdede]" />
            </a>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
