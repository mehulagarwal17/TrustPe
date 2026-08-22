import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Lock, CheckCircle2, Zap, ArrowUpRight, Search, Shield, User, Sparkles, Clock, Filter, Eye, Award, Layers, Bot } from 'lucide-react';
import { GiftItem, DemoPersona } from '../types';
import { DEMO_PERSONAS, MONAD_EXPLORER_URL } from '../config/monadChain';

interface MyGiftsScreenProps {
  gifts: GiftItem[];
  activePersona: DemoPersona;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onOpenCreate: () => void;
  onSelectGift: (gift: GiftItem) => void;
  onConfirmMilestone: (gift: GiftItem) => void;
  releasingGiftId: string | null;
  onOpenCardModal?: (gift: GiftItem) => void;
  onOpenCertModal?: (gift: GiftItem) => void;
  onOpenAiVerifier?: (gift: GiftItem) => void;
}

export const MyGiftsScreen: React.FC<MyGiftsScreenProps> = ({
  gifts,
  activePersona,
  isInjectedWallet,
  injectedAddress,
  onOpenCreate,
  onSelectGift,
  onConfirmMilestone,
  releasingGiftId,
  onOpenCardModal,
  onOpenCertModal,
  onOpenAiVerifier,
}) => {
  const currentAddress = (isInjectedWallet && injectedAddress ? injectedAddress : activePersona.address).toLowerCase();

  const [activeTab, setActiveTab] = useState<'created' | 'received'>('created');
  const [filterStatus, setFilterStatus] = useState<'all' | 'locked' | 'released'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Partition gifts based on active tab
  const tabGifts = gifts.filter((g) => {
    if (activeTab === 'created') {
      return g.creator.toLowerCase() === currentAddress || g.triggerAuthority.toLowerCase() === currentAddress;
    } else {
      return g.recipient.toLowerCase() === currentAddress;
    }
  });

  // Apply status & search filters
  const filteredGifts = tabGifts.filter((g) => {
    if (filterStatus === 'locked' && g.status !== 'Locked') return false;
    if (filterStatus === 'released' && g.status !== 'Released') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.description.toLowerCase().includes(q) ||
        g.recipient.toLowerCase().includes(q) ||
        g.creator.toLowerCase().includes(q) ||
        g.amount.includes(q)
      );
    }
    return true;
  });

  const getPersonaName = (addr: string) => {
    const found = DEMO_PERSONAS.find((p) => p.address.toLowerCase() === addr.toLowerCase());
    return found ? `${found.avatar} ${found.name}` : `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#cf0f47]/30">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ffdede]">
            Dashboard & Escrow Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            TrustPe Escrows Hub
          </h1>
          <p className="text-xs tracking-wider text-zinc-300 font-mono mt-1">
            "Locked, until its earned" • Active for: <span className="text-[#ffdede] font-bold">{activePersona.name}</span> ({activePersona.role})
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white font-black text-xs uppercase tracking-tight shadow-lg shadow-[#cf0f47]/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 self-start md:self-auto cursor-pointer border border-[#ffdede]/30"
        >
          <Sparkles className="w-4 h-4 text-[#ffdede]" />
          <span>Lock New Gift</span>
        </button>
      </div>

      {/* Primary Tabs (Created / Supervised vs Received) */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'created'
                ? 'bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] text-white shadow-md shadow-[#cf0f47]/30 border border-[#ffdede]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Created & Supervised</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/50 text-[#ffdede] font-mono font-bold">
              {gifts.filter((g) => g.creator.toLowerCase() === currentAddress || g.triggerAuthority.toLowerCase() === currentAddress).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] text-white shadow-md shadow-[#cf0f47]/30 border border-[#ffdede]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Addressed to Me</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/50 text-[#ffdede] font-mono font-bold">
              {gifts.filter((g) => g.recipient.toLowerCase() === currentAddress).length}
            </span>
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#120208] border border-[#cf0f47]/30 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-[#cf0f47]/40 text-white border border-[#ff0b55]/50' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('locked')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'locked' ? 'bg-[#cf0f47] text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Locked
            </button>
            <button
              onClick={() => setFilterStatus('released')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === 'released' ? 'bg-[#ffdede] text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Released
            </button>
          </div>
        </div>

      </div>

      {/* Gifts Grid */}
      <div className="mt-6">
        {filteredGifts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#120208] border border-[#cf0f47]/30 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#000000] flex items-center justify-center mx-auto text-zinc-500 mb-4 border border-[#cf0f47]/30">
              <Gift className="w-8 h-8 text-[#ffdede]" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">No gifts found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {activeTab === 'created'
                ? "You haven't locked any gifts yet. Create one now for a student or teammate!"
                : "You don't have any incoming gifts in this view. Try switching to the Student persona!"}
            </p>
            <button
              onClick={onOpenCreate}
              className="mt-5 px-6 py-3 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight transition shadow-lg shadow-[#cf0f47]/30 cursor-pointer border border-[#ffdede]/30"
            >
              Create Gift
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGifts.map((gift) => {
              const isTrigger = gift.triggerAuthority.toLowerCase() === currentAddress;
              const isLocked = gift.status === 'Locked';
              const isCurrentlyReleasing = releasingGiftId === gift.id;

              return (
                <motion.div
                  key={gift.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-[#120208] border border-[#cf0f47]/30 hover:border-[#ffdede]/60 transition-all p-6 sm:p-7 flex flex-col justify-between group shadow-xl"
                >
                  {/* Card Top: Amount and Status */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Amount */}
                      <div className="flex items-center gap-2">
                        <div className="text-3xl sm:text-4xl font-black font-mono text-[#ffdede] tracking-tighter">
                          {gift.amount} <span className="text-[#ff0b55] text-xl font-black">MON</span>
                        </div>
                      </div>

                      {/* Status Badge & 3D Card Quick Action */}
                      <div className="flex items-center gap-2">
                        {onOpenCardModal && (
                          <button
                            onClick={() => onOpenCardModal(gift)}
                            title="Open 3D Hologram Gift Card"
                            className="p-1.5 rounded-lg bg-[#000000] border border-[#cf0f47]/30 hover:border-[#ffdede] text-zinc-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#ffdede]" />
                            <span className="text-[10px] hidden sm:inline uppercase">3D Card</span>
                          </button>
                        )}

                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                          gift.status === 'Released'
                            ? 'bg-[#ffdede]/20 text-[#ffdede] border border-[#ffdede]/40'
                            : 'bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40'
                        }`}>
                          {gift.status === 'Released' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Released</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked</span>
                            </>
                          )}
                        </span>
                      </div>

                    </div>

                    {/* Milestone Description */}
                    <div className="mt-4 p-4 rounded-2xl bg-[#000000] border border-[#cf0f47]/30">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#ff0b55] tracking-[0.2em] mb-1">
                        <span>Milestone Requirement</span>
                        {gift.stages && (
                          <span className="text-[#ffdede] font-mono flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {gift.stages.length} Tranches
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
                        "{gift.description}"
                      </p>
                    </div>

                    {/* Parties Breakdown */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="uppercase font-bold text-[10px] tracking-wider">Recipient:</span>
                        <span className="font-bold text-zinc-200 font-mono">
                          {getPersonaName(gift.recipient)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="uppercase font-bold text-[10px] tracking-wider">Trigger Auth:</span>
                        <span className="font-bold text-zinc-200 font-mono flex items-center gap-1">
                          {getPersonaName(gift.triggerAuthority)}
                          {isTrigger && (
                            <span className="px-1.5 py-0.2 rounded bg-[#ffdede]/20 text-[#ffdede] text-[9px] font-black uppercase tracking-widest border border-[#ffdede]/40">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-[#cf0f47]/20 flex flex-wrap items-center justify-between gap-3">
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectGift(gift)}
                        className="text-xs font-black uppercase tracking-tight text-zinc-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      {isLocked && onOpenAiVerifier && (
                        <button
                          onClick={() => onOpenAiVerifier(gift)}
                          className="text-xs font-black uppercase tracking-tight text-[#ffdede] hover:brightness-110 transition flex items-center gap-1 cursor-pointer bg-[#cf0f47]/20 px-2.5 py-1 rounded-lg border border-[#ff0b55]/30 hover:border-[#ffdede]"
                          title="Verify Proof of Work with AI Oracle"
                        >
                          <Bot className="w-3.5 h-3.5 text-[#ff0b55]" />
                          <span>AI Oracle</span>
                        </button>
                      )}

                      {gift.status === 'Released' && onOpenCertModal && (
                        <button
                          onClick={() => onOpenCertModal(gift)}
                          className="text-xs font-black uppercase tracking-tight text-[#ffdede] hover:brightness-110 transition flex items-center gap-1 cursor-pointer bg-[#cf0f47]/20 px-2.5 py-1 rounded-lg border border-[#ff0b55]/30"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Cert</span>
                        </button>
                      )}
                    </div>

                    {/* Action Button: Confirm Milestone if Trigger Authority & Locked */}
                    {isLocked && isTrigger ? (
                      <button
                        disabled={isCurrentlyReleasing}
                        onClick={() => onConfirmMilestone(gift)}
                        className="px-5 py-2.5 rounded-full bg-[#ffdede] hover:bg-white text-black text-xs font-black uppercase tracking-tight shadow-lg shadow-[#ffdede]/20 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer border border-[#ffdede]"
                      >
                        <Zap className="w-3.5 h-3.5 text-black" />
                        <span>{isCurrentlyReleasing ? 'Executing...' : 'Confirm Milestone'}</span>
                      </button>
                    ) : (
                      isLocked && (
                        <span className="text-[11px] text-zinc-400 italic font-mono">
                          Awaiting {getPersonaName(gift.triggerAuthority)}
                        </span>
                      )
                    )}

                    {gift.status === 'Released' && (
                      <span className="text-[11px] text-[#ffdede] font-black uppercase tracking-wider flex items-center gap-1 font-mono">
                        <Zap className="w-3 h-3 text-[#ff0b55]" />
                        Confirmed in {gift.confirmationTimeMs || 380}ms
                      </span>
                    )}

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

