import React from 'react';
import { Gift, Zap, Wallet, Droplets, Code2, Sparkles, ChevronDown } from 'lucide-react';
import { MONAD_CHAIN_ID, MONAD_FAUCET_URL, DEMO_PERSONAS } from '../config/monadChain';
import { DemoPersona, NetworkStats } from '../types';

interface HeaderProps {
  currentTab: 'hero' | 'create' | 'gifts' | 'speedrace' | 'contract';
  setCurrentTab: (tab: 'hero' | 'create' | 'gifts' | 'speedrace' | 'contract') => void;
  activePersona: DemoPersona;
  onOpenWalletModal: () => void;
  networkStats: NetworkStats | null;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activePersona,
  onOpenWalletModal,
  networkStats,
  isInjectedWallet,
  injectedAddress,
  onOpenCreateModal,
}) => {
  const displayAddress = isInjectedWallet && injectedAddress ? injectedAddress : activePersona.address;
  const shortAddress = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#000000]/90 border-b border-[#cf0f47]/25 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('hero')}
              className="flex items-center gap-3 text-left group transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#cf0f47] to-[#ff0b55] rounded-full flex items-center justify-center font-black text-xl text-white shadow-[0_0_20px_rgba(255,11,85,0.45)] group-hover:scale-105 transition-transform border border-[#ffdede]/40">
                T
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                  TRUST<span className="text-[#ff0b55]">PE</span>
                </h1>
                <p className="text-[10px] tracking-[0.12em] font-bold text-[#ffdede]">Locked, until its earned</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 ml-6 pl-6 border-l border-[#cf0f47]/20 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <button
                onClick={() => setCurrentTab('hero')}
                className={`transition cursor-pointer ${
                  currentTab === 'hero'
                    ? 'text-[#ffdede] border-b-2 border-[#ff0b55] pb-0.5 font-black'
                    : 'hover:text-white'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setCurrentTab('gifts')}
                className={`transition cursor-pointer ${
                  currentTab === 'gifts'
                    ? 'text-[#ff0b55] border-b-2 border-[#ff0b55] pb-0.5 font-black'
                    : 'hover:text-white'
                }`}
              >
                Gifts Hub
              </button>

              <button
                onClick={() => setCurrentTab('speedrace')}
                className={`transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'speedrace'
                    ? 'text-[#ffdede] border-b-2 border-[#ffdede] pb-0.5 font-black'
                    : 'text-zinc-400 hover:text-[#ffdede]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#ff0b55]" />
                <span>Speed Race ⚡</span>
              </button>

              <button
                onClick={() => setCurrentTab('contract')}
                className={`transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'contract'
                    ? 'text-[#ff0b55] border-b-2 border-[#ff0b55] pb-0.5 font-black'
                    : 'hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4 text-[#ff0b55]" />
                <span>Solidity & Tests</span>
              </button>
            </nav>
          </div>

          {/* Right Action Bar: Network, Faucet, Create, Wallet */}
          <div className="flex items-center gap-3">
            
            {/* Live Monad Network Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17030a] border border-[#cf0f47]/40 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0b55] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0b55]"></span>
              </span>
              <span className="text-zinc-200 font-mono text-[11px] font-bold">
                {networkStats?.blockNumber ? `#${networkStats.blockNumber}` : 'TESTNET'}
              </span>
              <span className="text-[#ffdede] font-mono text-[10px] font-bold uppercase tracking-wider border-l border-[#cf0f47]/30 pl-2">
                0.4s finality
              </span>
            </div>

            {/* Faucet Link */}
            <a
              href={MONAD_FAUCET_URL}
              target="_blank"
              rel="noreferrer"
              title="Get free Testnet MON"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-[#17030a] hover:bg-[#290713] border border-[#cf0f47]/40 transition"
            >
              <Droplets className="w-3.5 h-3.5 text-[#ff0b55]" />
              <span>MON Faucet</span>
            </a>

            {/* Quick Create CTA */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-tight bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white shadow-[0_0_20px_rgba(255,11,85,0.45)] transition cursor-pointer border border-[#ffdede]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffdede]" />
              <span>Lock Gift</span>
            </button>

            {/* Persona / Wallet Button */}
            <button
              onClick={onOpenWalletModal}
              className="bg-[#ffdede] text-[#000000] hover:bg-white px-4 sm:px-5 py-2 rounded-full font-black text-xs uppercase tracking-tight transition-colors flex items-center gap-2 cursor-pointer shadow-md border border-[#ffdede]"
            >
              <span className="text-sm">{isInjectedWallet ? '🦊' : activePersona.avatar}</span>
              <span className="font-mono font-bold">{shortAddress}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
