import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Wallet, Check, ExternalLink, Sparkles, Droplets, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEMO_PERSONAS, MONAD_CHAIN_ID, MONAD_RPC_URL, MONAD_EXPLORER_URL, MONAD_FAUCET_URL } from '../config/monadChain';
import { DemoPersona } from '../types';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
  onSelectPersona: (index: number) => void;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onConnectInjected: () => Promise<void>;
  onDisconnectInjected: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  activePersona,
  onSelectPersona,
  isInjectedWallet,
  injectedAddress,
  onConnectInjected,
  onDisconnectInjected,
}) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [injectedError, setInjectedError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInjected = async () => {
    setConnecting(true);
    setInjectedError(null);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await onConnectInjected();
        onClose();
      } else {
        setInjectedError('No Web3 wallet extension found. You can use the Demo Personas below for a full live demo!');
      }
    } catch (err: any) {
      setInjectedError(err?.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#000000] border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.35)] p-6 sm:p-8 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#cf0f47]/20 border border-[#ff0b55]/40 flex items-center justify-center text-[#ff0b55]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Connect / Switch Wallet</h2>
              <p className="text-xs text-zinc-400 font-mono">Monad Testnet (Chain ID: {MONAD_CHAIN_ID})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Injected Wallet Option (MetaMask / Rabby / Backpack) */}
        <div className="mt-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff0b55] mb-2.5">
            Browser Web3 Wallet
          </div>

          <button
            onClick={isInjectedWallet ? onDisconnectInjected : handleInjected}
            disabled={connecting}
            className={`w-full p-4 rounded-2xl border transition flex items-center justify-between group cursor-pointer ${
              isInjectedWallet
                ? 'bg-[#120208] border-2 border-[#ff0b55] text-white'
                : 'bg-[#120208] hover:bg-[#250410] border border-[#cf0f47]/30 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#cf0f47]/30 flex items-center justify-center text-lg shadow-md">
                🦊
              </div>
              <div className="text-left">
                <div className="text-sm font-black uppercase tracking-tight">
                  {isInjectedWallet ? 'Connected (MetaMask / Rabby)' : 'Connect Browser Wallet'}
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  {isInjectedWallet && injectedAddress
                    ? `${injectedAddress.slice(0, 6)}...${injectedAddress.slice(-4)}`
                    : 'Auto-switches to Monad Testnet (10143)'}
                </div>
              </div>
            </div>

            {isInjectedWallet ? (
              <span className="text-xs px-3 py-1 rounded-full bg-[#cf0f47]/30 text-[#ffdede] font-black uppercase tracking-wider border border-[#ff0b55]/40">
                Disconnect
              </span>
            ) : (
              <span className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white font-black uppercase tracking-tight transition shadow-md shadow-[#cf0f47]/30 border border-[#ffdede]/30">
                {connecting ? 'Connecting...' : 'Connect'}
              </span>
            )}
          </button>

          {injectedError && (
            <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{injectedError}</span>
            </div>
          )}
        </div>

        {/* Live Demo Personas Switcher (Critical for Hackathon Stage Demo) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff0b55]">
              Hackathon Demo Personas
            </div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Instant Switch</span>
          </div>

          <div className="space-y-2.5">
            {DEMO_PERSONAS.map((p, idx) => {
              const isSelected = !isInjectedWallet && activePersona.address.toLowerCase() === p.address.toLowerCase();

              return (
                <button
                  key={p.name}
                  onClick={() => {
                    onDisconnectInjected();
                    onSelectPersona(idx);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-2xl border transition flex items-center justify-between text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#120208] border-2 border-[#ff0b55] text-white shadow-lg shadow-[#cf0f47]/20'
                      : 'bg-[#120208] hover:bg-[#250410] border border-[#cf0f47]/30 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#000000] border border-[#cf0f47]/30 flex items-center justify-center text-lg">
                      {p.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-[10px] text-zinc-400 font-normal tracking-normal">({p.title})</span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {p.address.slice(0, 6)}...{p.address.slice(-4)} •{' '}
                        <strong className="text-[#ffdede] font-mono">{p.balance} MON</strong>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#cf0f47] flex items-center justify-center text-[#ffdede]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Faucet Link */}
        <div className="mt-6 pt-4 border-t border-[#cf0f47]/30 flex items-center justify-between text-xs">
          <span className="text-zinc-400 uppercase font-bold tracking-wider text-[10px]">Need Monad Testnet tokens?</span>
          <a
            href={MONAD_FAUCET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[#ffdede] hover:underline transition flex items-center gap-1 font-black uppercase tracking-tight"
          >
            <Droplets className="w-3.5 h-3.5 text-[#ff0b55]" />
            <span>Monad Faucet</span>
            <ExternalLink className="w-3 h-3 text-[#ffdede]" />
          </a>
        </div>

      </motion.div>
    </div>
  );
};
