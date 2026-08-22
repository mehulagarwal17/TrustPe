import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, Sparkles, Copy, Check, Download, Share2, 
  Lock, CheckCircle2, Zap, Shield, RotateCw, ExternalLink, Flame
} from 'lucide-react';
import { GiftItem, DemoPersona, CardTheme } from '../types';
import { DEMO_PERSONAS, MONAD_EXPLORER_URL } from '../config/monadChain';

interface DigitalGiftCardModalProps {
  gift: GiftItem | null;
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
}

export const DigitalGiftCardModal: React.FC<DigitalGiftCardModalProps> = ({
  gift,
  isOpen,
  onClose,
  activePersona,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(gift?.theme || 'neon-purple');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !gift) return null;

  const getPersona = (addr: string) => {
    return DEMO_PERSONAS.find((p) => p.address.toLowerCase() === addr.toLowerCase());
  };

  const recipientPersona = getPersona(gift.recipient);
  const creatorPersona = getPersona(gift.creator);

  const recipientName = recipientPersona ? recipientPersona.name : `${gift.recipient.slice(0, 6)}...${gift.recipient.slice(-4)}`;
  const creatorName = creatorPersona ? creatorPersona.name : `${gift.creator.slice(0, 6)}...${gift.creator.slice(-4)}`;

  const claimUrl = `${window.location.origin}/?claim=${gift.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(claimUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyEscrowId = () => {
    navigator.clipboard.writeText(`TRUSTPE-ESCROW-#${gift.id}-${gift.amount}MON`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Theme styling configurations
  const themeStyles = {
    'neon-purple': {
      border: 'border-[#cf0f47]',
      glow: 'shadow-[0_0_60px_rgba(207,15,71,0.45)]',
      bgGradient: 'from-[#18030b] via-[#0d0105] to-[#000000]',
      accentColor: '#cf0f47',
      accentText: 'text-[#ff0b55]',
      accentBg: 'bg-[#cf0f47]',
      badgeBg: 'bg-[#cf0f47]/20 text-[#ffdede] border-[#cf0f47]/40',
      holoStripe: 'from-transparent via-[#ff0b55]/25 to-transparent',
    },
    'cyber-gold': {
      border: 'border-[#ffdede]',
      glow: 'shadow-[0_0_60px_rgba(255,222,222,0.35)]',
      bgGradient: 'from-[#250812] via-[#100307] to-[#000000]',
      accentColor: '#ffdede',
      accentText: 'text-[#ffdede]',
      accentBg: 'bg-[#ffdede]',
      badgeBg: 'bg-[#ffdede]/20 text-[#ffdede] border-[#ffdede]/40',
      holoStripe: 'from-transparent via-[#ffdede]/25 to-transparent',
    },
    'emerald-builder': {
      border: 'border-[#ff0b55]',
      glow: 'shadow-[0_0_60px_rgba(255,11,85,0.4)]',
      bgGradient: 'from-[#20020b] via-[#0e0105] to-[#000000]',
      accentColor: '#ff0b55',
      accentText: 'text-[#ff0b55]',
      accentBg: 'bg-[#ff0b55]',
      badgeBg: 'bg-[#ff0b55]/20 text-[#ffdede] border-[#ff0b55]/40',
      holoStripe: 'from-transparent via-[#ff0b55]/25 to-transparent',
    },
    'sakura-frost': {
      border: 'border-[#cf0f47]',
      glow: 'shadow-[0_0_60px_rgba(207,15,71,0.4)]',
      bgGradient: 'from-[#2c0512] via-[#140208] to-[#000000]',
      accentColor: '#ff0b55',
      accentText: 'text-[#ffdede]',
      accentBg: 'bg-[#cf0f47]',
      badgeBg: 'bg-[#cf0f47]/20 text-[#ffdede] border-[#cf0f47]/40',
      holoStripe: 'from-transparent via-[#ffdede]/25 to-transparent',
    },
  }[selectedTheme];

  const handleDownloadSVG = () => {
    // Generate an exportable SVG graphic
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c030c" />
            <stop offset="50%" stop-color="#0a0104" />
            <stop offset="100%" stop-color="#000000" />
          </linearGradient>
          <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#cf0f47" />
            <stop offset="100%" stop-color="#ff0b55" />
          </linearGradient>
        </defs>
        <rect width="800" height="480" rx="32" fill="url(#bg)" stroke="#cf0f47" stroke-width="4"/>
        <circle cx="700" cy="100" r="140" fill="#ff0b55" opacity="0.15" filter="blur(40px)"/>
        
        <!-- Header -->
        <text x="50" y="70" font-family="monospace" font-size="14" font-weight="900" fill="#ff0b55" letter-spacing="4">TRUSTPE // LOCKED, UNTIL ITS EARNED</text>
        <text x="750" y="70" text-anchor="end" font-family="monospace" font-size="14" font-weight="900" fill="#ffdede">STATUS: ${gift.status.toUpperCase()}</text>
        
        <!-- Amount -->
        <text x="50" y="170" font-family="monospace" font-size="64" font-weight="900" fill="#FFFFFF">${gift.amount} MON</text>
        <text x="50" y="210" font-family="sans-serif" font-size="14" font-weight="700" fill="#888888" letter-spacing="2">LOCKED ON MONAD TESTNET (10,000 TPS • 0.4S FINALITY)</text>
        
        <!-- Milestone Box -->
        <rect x="50" y="240" width="700" height="110" rx="16" fill="#18030b" stroke="#cf0f47" stroke-width="1.5"/>
        <text x="75" y="275" font-family="monospace" font-size="12" font-weight="900" fill="#ff0b55" letter-spacing="2">MILESTONE REQUIREMENT</text>
        <text x="75" y="315" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">${gift.description.slice(0, 60)}${gift.description.length > 60 ? '...' : ''}</text>
        
        <!-- Footer -->
        <text x="50" y="400" font-family="sans-serif" font-size="14" font-weight="bold" fill="#AAAAAA">TO: <tspan fill="#FFFFFF">${recipientName}</tspan></text>
        <text x="50" y="425" font-family="monospace" font-size="12" fill="#666666">${gift.recipient}</text>
        
        <text x="750" y="400" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="bold" fill="#AAAAAA">FROM: <tspan fill="#FFFFFF">${creatorName}</tspan></text>
        <text x="750" y="425" text-anchor="end" font-family="monospace" font-size="12" fill="#666666">ESCROW ID #${gift.id}</text>
      </svg>
    `;

    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustPe-Card-#${gift.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-[#000000] border-2 border-[#cf0f47] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(207,15,71,0.35)] text-white my-auto overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40 flex items-center justify-center shadow-[0_0_20px_rgba(207,15,71,0.3)]">
              <Sparkles className="w-5 h-5 text-[#ffdede]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#ff0b55] tracking-widest">
                Monad 3D Holographic Card
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Shareable Digital Gift Card
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Selector Pills */}
        <div className="my-4 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
            Holographic Theme:
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#120208] border border-[#cf0f47]/30">
            {[
              { id: 'neon-purple', label: 'Ruby Crimson', color: 'bg-[#cf0f47]' },
              { id: 'cyber-gold', label: 'Blush Glow', color: 'bg-[#ffdede]' },
              { id: 'emerald-builder', label: 'Neon Rose', color: 'bg-[#ff0b55]' },
              { id: 'sakura-frost', label: 'Rose Gold', color: 'bg-[#cf0f47]' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th.id as CardTheme)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                  selectedTheme === th.id
                    ? 'bg-black text-[#ffdede] shadow-sm border border-[#ffdede]/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${th.color}`} />
                <span>{th.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Flippable Holographic Card Stage */}
        <div className="perspective-[1200px] my-6">
          <motion.div
            ref={cardRef}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-full aspect-[16/9] sm:aspect-[1.75/1] rounded-3xl preserve-3d cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* FRONT FACE */}
            <div
              className={`absolute inset-0 backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-2 bg-gradient-to-br ${themeStyles.bgGradient} ${themeStyles.border} ${themeStyles.glow}`}
            >
              {/* Holographic animated scan line */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${themeStyles.holoStripe} -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none opacity-50`}
              />

              {/* Card Top: Monad Brand + Flip Trigger */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${themeStyles.accentBg} text-white flex items-center justify-center font-black text-xl shadow-lg border border-[#ffdede]/40`}>
                    M
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-black tracking-widest uppercase text-white/90">
                      MONAD TESTNET ESCROW
                    </div>
                    <div className="text-[9px] font-mono text-zinc-400">
                      10,000 TPS • SINGLE-SLOT FINALITY
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${themeStyles.badgeBg}`}>
                    {gift.status === 'Released' ? '✨ PAID & DELIVERED' : '🔒 FUNDS LOCKED'}
                  </span>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-zinc-300 hover:text-white transition">
                    <RotateCw className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Center: Amount & Milestone */}
              <div className="relative z-10 my-auto py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-6xl font-black font-mono tracking-tighter text-white drop-shadow-md">
                    {gift.amount}
                  </span>
                  <span className={`text-2xl sm:text-3xl font-black uppercase font-mono ${themeStyles.accentText}`}>
                    MON
                  </span>
                </div>

                <div className="mt-2 p-3 rounded-2xl bg-black/60 border border-[#cf0f47]/30 backdrop-blur-md">
                  <div className="text-[9px] uppercase font-bold text-[#ff0b55] tracking-wider">
                    Milestone Condition:
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white line-clamp-2 mt-0.5">
                    "{gift.description}"
                  </div>
                </div>
              </div>

              {/* Card Bottom: Recipient & Creator */}
              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="text-[9px] font-mono uppercase text-zinc-400">Beneficiary</div>
                  <div className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{recipientPersona?.avatar || '👤'}</span>
                    <span>{recipientName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono uppercase text-zinc-400">Escrow Pledge By</div>
                  <div className="font-black text-white text-sm flex items-center gap-1.5 justify-end">
                    <span>{creatorName}</span>
                    <span>{creatorPersona?.avatar || '👑'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK FACE (QR CODE & ON-CHAIN VERIFICATION) */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-2 bg-gradient-to-br ${themeStyles.bgGradient} ${themeStyles.border} ${themeStyles.glow}`}
            >
              {/* Back Top */}
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${themeStyles.accentText}`} />
                  <span>CRYPTOGRAPHIC ESCROW PASS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  ID: #{gift.id}
                </div>
              </div>

              {/* Back Center: QR Code & Direct Scan Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-auto">
                <div className="flex justify-center sm:justify-start">
                  <div className="p-3.5 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                    <QRCodeSVG
                      value={claimUrl}
                      size={130}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-[#cf0f47]/30">
                    <div className="text-[9px] uppercase font-mono text-zinc-400">Scan to View / Claim</div>
                    <div className="text-xs font-mono font-bold text-white truncate">{claimUrl}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-[#cf0f47]/30">
                    <div className="text-[9px] uppercase font-mono text-zinc-400">Smart Contract (Monad)</div>
                    <div className="text-[11px] font-mono font-bold text-[#ffdede] truncate">
                      {gift.creationTxHash ? `${gift.creationTxHash.slice(0, 16)}...` : 'Verified on 10143'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Bottom */}
              <div className="text-center text-[10px] font-mono text-zinc-400 border-t border-white/10 pt-2">
                Click anywhere to flip back to front view
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-[#cf0f47]/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-[#120208] hover:bg-[#250410] border border-[#cf0f47]/30 text-xs font-black uppercase tracking-tight text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#ffdede]" /> : <Share2 className="w-4 h-4 text-[#ff0b55]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="px-4 py-3 rounded-2xl bg-[#120208] hover:bg-[#250410] border border-[#cf0f47]/30 text-xs font-black uppercase tracking-tight text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-[#ffdede]" /> : <Download className="w-4 h-4 text-[#ffdede]" />}
            <span>{downloadSuccess ? 'Downloaded!' : 'Export Card SVG'}</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#cf0f47]/30 border border-[#ffdede]/30"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card View</span>
          </button>

        </div>
      </motion.div>
    </div>
  );
};
