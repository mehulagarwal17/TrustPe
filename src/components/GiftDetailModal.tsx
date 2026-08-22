import React from 'react';
import { motion } from 'motion/react';
import { 
  X, Lock, CheckCircle2, Zap, ExternalLink, ShieldCheck, 
  User, ArrowRight, Clock, Award, Sparkles, Share2, Layers, AlertTriangle, Bot
} from 'lucide-react';
import { MONAD_EXPLORER_URL, DEMO_PERSONAS } from '../config/monadChain';
import { GiftItem, DemoPersona } from '../types';

interface GiftDetailModalProps {
  gift: GiftItem | null;
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onConfirmMilestone: (gift: GiftItem) => void;
  isReleasing: boolean;
  onOpenCardModal?: (gift: GiftItem) => void;
  onOpenCertModal?: (gift: GiftItem) => void;
  onOpenAiVerifier?: (gift: GiftItem) => void;
}

export const GiftDetailModal: React.FC<GiftDetailModalProps> = ({
  gift,
  isOpen,
  onClose,
  activePersona,
  isInjectedWallet,
  injectedAddress,
  onConfirmMilestone,
  isReleasing,
  onOpenCardModal,
  onOpenCertModal,
  onOpenAiVerifier,
}) => {
  if (!isOpen || !gift) return null;

  const currentAddress = (isInjectedWallet && injectedAddress ? injectedAddress : activePersona.address).toLowerCase();
  const isTrigger = gift.triggerAuthority.toLowerCase() === currentAddress;
  const isCreator = gift.creator.toLowerCase() === currentAddress;
  const isRecipient = gift.recipient.toLowerCase() === currentAddress;

  const getPersonaName = (addr: string) => {
    const found = DEMO_PERSONAS.find((p) => p.address.toLowerCase() === addr.toLowerCase());
    return found ? `${found.avatar} ${found.name}` : `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const createdDate = new Date(gift.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const isExpired = gift.deadlineTimestamp ? Date.now() > gift.deadlineTimestamp : false;
  const deadlineDate = gift.deadlineTimestamp ? new Date(gift.deadlineTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#000000] border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.35)] p-6 sm:p-8 text-white my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Background glow for released gifts */}
        {gift.status === 'Released' && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0b55]/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              gift.status === 'Released'
                ? 'bg-[#cf0f47]/20 text-[#ffdede] border border-[#ff0b55]/40 shadow-[0_0_20px_rgba(255,11,85,0.2)]'
                : 'bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40 shadow-[0_0_20px_rgba(207,15,71,0.2)]'
            }`}>
              {gift.status === 'Released' ? <CheckCircle2 className="w-6 h-6 text-[#ffdede]" /> : <Lock className="w-6 h-6 text-[#ff0b55]" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ff0b55] tracking-widest">Escrow #{gift.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  gift.status === 'Released'
                    ? 'bg-[#ffdede]/20 text-[#ffdede] border border-[#ffdede]/40'
                    : 'bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40'
                }`}>
                  {gift.status === 'Released' ? '✨ Milestone Confirmed' : '🔒 Locked in Escrow'}
                </span>
              </div>
              <h2 className="text-3xl font-black text-[#ffdede] font-mono mt-0.5">{gift.amount} MON</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCardModal && (
              <button
                onClick={() => onOpenCardModal(gift)}
                title="View 3D Holographic Gift Card"
                className="p-2.5 rounded-xl bg-[#120208] hover:bg-[#250410] text-[#ffdede] hover:text-white border border-[#cf0f47]/30 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 text-[#ff0b55]" />
                <span className="hidden sm:inline">3D Card</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Released Celebration Banner */}
        {gift.status === 'Released' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-5 p-4 rounded-2xl bg-[#120208] border-2 border-[#ff0b55] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(255,11,85,0.15)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#cf0f47]/20 text-[#ffdede] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#ffdede] animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-[#ffdede]">Automated Instant Settlement</div>
                <div className="text-sm font-black text-white uppercase tracking-tight">Funds delivered in {gift.confirmationTimeMs || 380} ms</div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              {onOpenCertModal && (
                <button
                  onClick={() => onOpenCertModal(gift)}
                  className="px-3.5 py-2 rounded-full bg-[#cf0f47]/30 border border-[#ff0b55]/40 text-[#ffdede] text-xs font-black uppercase tracking-tight transition flex items-center gap-1.5 hover:bg-[#cf0f47]/50 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate</span>
                </button>
              )}

              {gift.releaseTxHash && (
                <a
                  href={`${MONAD_EXPLORER_URL}/tx/${gift.releaseTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full bg-[#ffdede] text-black text-xs font-black uppercase tracking-tight transition flex items-center gap-1 hover:bg-white shadow-md cursor-pointer"
                >
                  <span>Tx Hash</span>
                  <ExternalLink className="w-3 h-3 text-black" />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Milestone Description Card */}
        <div className="my-5 p-5 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] uppercase font-bold text-[#ff0b55] tracking-[0.2em]">
              Milestone Condition
            </div>
            {deadlineDate && (
              <div className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                isExpired ? 'text-rose-400' : 'text-zinc-400'
              }`}>
                <Clock className="w-3 h-3" />
                <span>Deadline: {deadlineDate} {isExpired ? '(EXPIRED)' : ''}</span>
              </div>
            )}
          </div>
          <p className="text-base text-white font-bold leading-relaxed">
            "{gift.description}"
          </p>
        </div>

        {/* Progressive Multi-Stage Tranches Breakdown if present */}
        {gift.stages && gift.stages.length > 0 && (
          <div className="my-5 p-4 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#ff0b55]" />
                <span>Progressive Milestones ({gift.stages.length} Tranches)</span>
              </div>
              <span className="text-[10px] font-mono text-[#ffdede] font-bold">
                {gift.status === 'Released' ? '100% Unlocked' : 'In Progress'}
              </span>
            </div>

            <div className="space-y-2">
              {gift.stages.map((stg) => (
                <div
                  key={stg.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    gift.status === 'Released' || stg.isCompleted
                      ? 'bg-[#cf0f47]/20 border-[#ff0b55]/40 text-white'
                      : 'bg-[#000000] border-[#cf0f47]/20 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold">
                      {gift.status === 'Released' || stg.isCompleted ? '✓' : stg.id}
                    </span>
                    <span className="font-sans font-bold text-white text-xs">{stg.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffdede] font-bold">{stg.amountMon || `${stg.percentage}%`} MON</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      gift.status === 'Released' || stg.isCompleted ? 'bg-[#cf0f47]/40 text-[#ffdede]' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {gift.status === 'Released' || stg.isCompleted ? 'Settled' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Lifecycle Stepper */}
        <div className="my-5 p-4 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">
            Monad Escrow Lifecycle
          </div>

          <div className="grid grid-cols-3 gap-2 text-center relative">
            <div className="p-3 rounded-xl bg-[#000000] border border-[#cf0f47]/30">
              <div className="text-xs font-black text-[#ff0b55] uppercase">1. Locked</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">{createdDate}</div>
            </div>

            <div className={`p-3 rounded-xl border ${
              gift.status === 'Released'
                ? 'bg-[#000000] border-[#cf0f47]/30'
                : 'bg-[#cf0f47]/20 border-[#ff0b55] animate-pulse'
            }`}>
              <div className={`text-xs font-black uppercase ${gift.status === 'Released' ? 'text-white' : 'text-[#ff0b55]'}`}>
                2. Verification
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">
                {gift.status === 'Released' ? 'Confirmed' : 'Awaiting Trigger'}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${
              gift.status === 'Released'
                ? 'bg-[#cf0f47]/30 border-[#ff0b55]/50'
                : 'bg-[#000000] border-[#cf0f47]/20 text-zinc-500'
            }`}>
              <div className={`text-xs font-black uppercase ${gift.status === 'Released' ? 'text-[#ffdede]' : 'text-zinc-500'}`}>
                3. Payout
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">
                {gift.status === 'Released' ? `${gift.confirmationTimeMs || 380}ms Finality` : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Breakdown */}
        <div className="space-y-2.5 text-xs">
          
          <div className="p-3 rounded-xl bg-[#120208] border border-[#cf0f47]/30 flex items-center justify-between">
            <span className="uppercase font-bold text-[10px] text-zinc-400 tracking-wider">Creator:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono">{getPersonaName(gift.creator)}</span>
              {isCreator && <span className="px-2 py-0.5 rounded bg-[#cf0f47]/30 text-[#ffdede] text-[9px] font-black uppercase tracking-widest">You</span>}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#120208] border border-[#cf0f47]/30 flex items-center justify-between">
            <span className="uppercase font-bold text-[10px] text-zinc-400 tracking-wider">Recipient:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono">{getPersonaName(gift.recipient)}</span>
              {isRecipient && <span className="px-2 py-0.5 rounded bg-[#ff0b55]/30 text-[#ffdede] text-[9px] font-black uppercase tracking-widest">You</span>}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#120208] border border-[#cf0f47]/30 flex items-center justify-between">
            <span className="uppercase font-bold text-[10px] text-zinc-400 tracking-wider">Trigger Auth:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono">{getPersonaName(gift.triggerAuthority)}</span>
              {isTrigger && <span className="px-2 py-0.5 rounded bg-[#ff0b55]/30 text-[#ffdede] text-[9px] font-black uppercase tracking-widest">You</span>}
            </div>
          </div>

        </div>

        {/* Action Footer: Confirm Milestone if Trigger Authority or AI Oracle */}
        <div className="mt-6 pt-4 border-t border-[#cf0f47]/30 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {gift.creationTxHash && (
              <a
                href={`${MONAD_EXPLORER_URL}/tx/${gift.creationTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-black uppercase tracking-tight text-zinc-400 hover:text-white transition flex items-center gap-1.5"
              >
                <span>Explorer Tx</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#ffdede]" />
              </a>
            )}

            {gift.status === 'Locked' && onOpenAiVerifier && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiVerifier(gift);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-[#ffdede] hover:text-white border border-[#ff0b55]/40 hover:border-[#ffdede] text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Bot className="w-4 h-4 text-[#ff0b55]" />
                <span>AI Oracle Verification</span>
              </button>
            )}
          </div>

          {gift.status === 'Locked' && (
            <div>
              {isTrigger ? (
                <button
                  disabled={isReleasing}
                  onClick={() => onConfirmMilestone(gift)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight shadow-lg shadow-[#cf0f47]/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer border border-[#ffdede]/30"
                >
                  <Zap className="w-4 h-4 text-[#ffdede]" />
                  <span>{isReleasing ? 'Confirming on Monad...' : 'Confirm Milestone & Release Payout'}</span>
                </button>
              ) : (
                <div className="text-xs font-mono font-bold text-zinc-400 bg-[#120208] border border-[#cf0f47]/30 px-3 py-1.5 rounded-lg uppercase">
                  Awaiting {getPersonaName(gift.triggerAuthority)}
                </div>
              )}
            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
};

