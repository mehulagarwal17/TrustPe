import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Zap, ArrowRight, Shield, Award, Sparkles, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { MONAD_EXPLORER_URL, MONAD_FAUCET_URL, DEMO_PERSONAS } from '../config/monadChain';
import { NetworkStats } from '../types';

interface HeroLandingProps {
  onOpenCreate: () => void;
  onNavigateGifts: () => void;
  onNavigateContract: () => void;
  onNavigateSpeedRace?: () => void;
  networkStats: NetworkStats | null;
  onSelectPersona: (personaIndex: number) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onOpenCreate,
  onNavigateGifts,
  onNavigateContract,
  onNavigateSpeedRace,
  networkStats,
  onSelectPersona,
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-16 bg-[#000000]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#cf0f47]/20 via-[#ff0b55]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 2-Column Hero & Quick Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Left Column (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18030b] border border-[#cf0f47]/40 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#ff0b55] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#ffdede]">
                  TrustPe on Monad • "Locked, until its earned"
                </span>
              </div>

              {/* Bold Big Typography Heading */}
              <h2 className="text-5xl sm:text-7xl lg:text-[84px] leading-[0.88] font-black tracking-tight mb-6 uppercase text-white">
                Locked,<br/>
                Until It's<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cf0f47] via-[#ff0b55] to-[#ffdede]">
                  Earned.
                </span>
              </h2>

              <p className="text-zinc-300 text-lg sm:text-xl max-w-xl leading-relaxed">
                TrustPe lets you lock MON native funds to any milestone. The instant work is verified, funds hit the recipient wallet with sub-second finality.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenCreate}
                  className="bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-tight shadow-[0_0_30px_rgba(255,11,85,0.45)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 cursor-pointer border border-[#ffdede]/30"
                >
                  <Sparkles className="w-5 h-5 text-[#ffdede]" />
                  <span>Lock Funds Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={onNavigateGifts}
                  className="bg-[#ffdede] text-[#000000] hover:bg-white px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-tight transition-colors flex items-center gap-2 cursor-pointer shadow-lg border border-[#ffdede]"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {onNavigateSpeedRace && (
                  <button
                    onClick={onNavigateSpeedRace}
                    className="px-6 py-4 rounded-2xl border border-[#ff0b55]/40 bg-[#ff0b55]/10 hover:bg-[#ff0b55]/20 text-[#ffdede] font-black text-sm uppercase tracking-tight transition flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#ff0b55]" />
                    <span>Speed Race ⚡</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metric Display Card */}
            <div className="bg-[#120208] border border-[#cf0f47]/30 p-8 rounded-3xl relative overflow-hidden shadow-xl mt-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#ff0b55] font-bold">
                  Monad Testnet Performance
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#ffdede] font-mono font-bold">
                  10,000 TPS
                </span>
              </div>

              <div className="flex items-end gap-4 mt-2">
                <span className="text-6xl sm:text-8xl lg:text-[100px] font-black leading-none tracking-tighter text-white font-mono">
                  0.42
                </span>
                <span className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4 text-[#ffdede] uppercase tracking-tighter">
                  Seconds
                </span>
              </div>

              <p className="text-zinc-400 font-mono text-xs sm:text-sm uppercase tracking-widest mt-2">
                Average Time to Finality (Single-Slot Execution)
              </p>
            </div>

          </div>

          {/* Right Column (Span 5): Quick Gift Card with Neon Border & Live Feed */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Quick Gift Box */}
            <div className="bg-gradient-to-br from-[#cf0f47] via-[#ff0b55] to-[#ffdede] p-1 rounded-3xl shadow-[0_0_40px_rgba(207,15,71,0.35)]">
              <div className="bg-[#000000] p-6 sm:p-8 rounded-[22px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#ff0b55]">
                    Create New Gift
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#ffdede] font-mono">
                    Instant Escrow
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-2 tracking-wider">
                      Recipient Address (Student / Builder)
                    </label>
                    <input
                      type="text"
                      value={DEMO_PERSONAS[1].address}
                      readOnly
                      className="w-full bg-[#120208] border border-[#cf0f47]/30 p-3.5 rounded-xl text-xs font-mono text-zinc-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-2 tracking-wider">
                        Amount (MON)
                      </label>
                      <input
                        type="text"
                        value="2.50 MON"
                        readOnly
                        className="w-full bg-[#120208] border border-[#cf0f47]/30 p-3.5 rounded-xl text-base font-black text-[#ffdede]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-2 tracking-wider">
                        Trigger Auth
                      </label>
                      <input
                        type="text"
                        value="Default (Me)"
                        readOnly
                        className="w-full bg-[#120208] border border-[#cf0f47]/30 p-3.5 rounded-xl text-xs italic text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 font-bold mb-2 tracking-wider">
                      Milestone Description
                    </label>
                    <input
                      type="text"
                      value="Deploy TrustPe on Monad Testnet"
                      readOnly
                      className="w-full bg-[#120208] border border-[#cf0f47]/30 p-3.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={onOpenCreate}
                    className="w-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white py-4 rounded-xl font-black text-lg uppercase tracking-tighter shadow-lg shadow-[#cf0f47]/30 transition cursor-pointer flex items-center justify-center gap-2 mt-2 border border-[#ffdede]/20"
                  >
                    <Lock className="w-5 h-5 text-[#ffdede]" />
                    <span>Lock Funds Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-[#120208] border border-[#cf0f47]/30 p-6 rounded-3xl shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-300">
                    Recent Activity
                  </h3>
                  <span className="text-[10px] text-[#ffdede] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff0b55] animate-pulse" />
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 border-b border-[#cf0f47]/20">
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Hyderabad Hackathon Prize</p>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Confirmed in 0.38s</p>
                    </div>
                    <span className="text-[#ffdede] font-mono font-bold text-xs">+5.00 MON</span>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-[#cf0f47]/20 opacity-80">
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Smart Contract Audit Milestone</p>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Confirmed in 0.41s</p>
                    </div>
                    <span className="text-[#ff0b55] font-mono font-bold text-xs">+2.50 MON</span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Mentorship Completion</p>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase">Confirmed in 0.35s</p>
                    </div>
                    <span className="text-white font-mono font-bold text-xs">+1.00 MON</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#cf0f47]/20 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Monad Testnet</span>
                <button
                  onClick={onNavigateGifts}
                  className="text-[#ff0b55] hover:text-[#ffdede] hover:underline font-bold uppercase tracking-tight transition-colors"
                >
                  View All Gifts →
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 3-Step Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ff0b55] font-bold">
              Autonomous Escrow Protocol
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
              How TrustPe Works in 3 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#120208] border border-[#cf0f47]/30 hover:border-[#ff0b55] transition group">
              <div className="w-12 h-12 rounded-2xl bg-[#cf0f47]/20 border border-[#cf0f47]/40 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-[#ffdede]" />
              </div>
              <div className="text-xs font-mono font-bold text-[#ff0b55] uppercase tracking-widest">
                Step 01
              </div>
              <h4 className="text-xl font-black text-white uppercase mt-1">Lock Funds in Escrow</h4>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Deposit MON native tokens into the smart contract and specify the recipient address, milestone condition, and trigger authority.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#120208] border border-[#cf0f47]/30 hover:border-[#ff0b55] transition group">
              <div className="w-12 h-12 rounded-2xl bg-[#ff0b55]/20 border border-[#ff0b55]/40 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-[#ffdede]" />
              </div>
              <div className="text-xs font-mono font-bold text-[#ff0b55] uppercase tracking-widest">
                Step 02
              </div>
              <h4 className="text-xl font-black text-white uppercase mt-1">Milestone Verification</h4>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                The builder finishes the goal. The designated authority (creator or independent judge) confirms completion with one instant click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#120208] border-2 border-[#ff0b55] shadow-[0_0_30px_rgba(255,11,85,0.25)] transition group">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdede]/10 border border-[#ffdede]/40 flex items-center justify-center text-[#ffdede] mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#ff0b55]" />
              </div>
              <div className="text-xs font-mono font-bold text-[#ffdede] uppercase tracking-widest">
                Step 03
              </div>
              <h4 className="text-xl font-black text-white uppercase mt-1">Instant Payout (0.4s)</h4>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                Atomic release transfers the entire MON reward into the recipient wallet in the same transaction block. Zero claim delay.
              </p>
            </div>

          </div>
        </div>

        {/* Live Demo Persona Switcher Section */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#120208] border border-[#cf0f47]/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ffdede] block mb-2">
                Live Demonstration Scenario
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                "Mentor locks prize for Student, released when Project passes review"
              </h3>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                Select a persona to test the end-to-end lifecycle on Monad:
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {DEMO_PERSONAS.map((p, idx) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      onSelectPersona(idx);
                      onNavigateGifts();
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#000000] hover:bg-[#29040f] border border-[#cf0f47]/40 hover:border-[#ffdede] text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{p.avatar}</span>
                    <span>Act as {p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={onOpenCreate}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white font-black text-sm uppercase tracking-tight transition text-center shadow-lg shadow-[#cf0f47]/30 cursor-pointer border border-[#ffdede]/30"
              >
                Lock Live Gift
              </button>
              <button
                onClick={onNavigateContract}
                className="px-6 py-3.5 rounded-full bg-[#ffdede] text-black hover:bg-white font-black text-sm uppercase tracking-tight transition text-center cursor-pointer shadow-md border border-[#ffdede]"
              >
                Foundry Tests (6/6 Pass)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

