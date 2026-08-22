import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Award, CheckCircle2, Download, ExternalLink, 
  ShieldCheck, Sparkles, Check, FileCheck, Share2, Flame 
} from 'lucide-react';
import { GiftItem, DemoPersona } from '../types';
import { DEMO_PERSONAS, MONAD_EXPLORER_URL } from '../config/monadChain';

interface AchievementCertificateModalProps {
  gift: GiftItem | null;
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
}

export const AchievementCertificateModal: React.FC<AchievementCertificateModalProps> = ({
  gift,
  isOpen,
  onClose,
  activePersona,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen || !gift) return null;

  const getPersona = (addr: string) => {
    return DEMO_PERSONAS.find((p) => p.address.toLowerCase() === addr.toLowerCase());
  };

  const recipientPersona = getPersona(gift.recipient);
  const creatorPersona = getPersona(gift.creator);

  const recipientName = recipientPersona ? recipientPersona.name : `${gift.recipient.slice(0, 6)}...${gift.recipient.slice(-4)}`;
  const creatorName = creatorPersona ? creatorPersona.name : `${gift.creator.slice(0, 6)}...${gift.creator.slice(-4)}`;
  const completionDate = gift.releasedAt > 0 
    ? new Date(gift.releasedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownloadCertificate = () => {
    const certificateSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
        <defs>
          <linearGradient id="certBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c030c" />
            <stop offset="50%" stop-color="#090104" />
            <stop offset="100%" stop-color="#000000" />
          </linearGradient>
          <linearGradient id="roseBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cf0f47" />
            <stop offset="50%" stop-color="#ff0b55" />
            <stop offset="100%" stop-color="#ffdede" />
          </linearGradient>
        </defs>
        
        <!-- Background Frame -->
        <rect width="1000" height="700" rx="32" fill="url(#certBg)"/>
        <rect x="24" y="24" width="952" height="652" rx="24" fill="none" stroke="url(#roseBorder)" stroke-width="4"/>
        <rect x="36" y="36" width="928" height="628" rx="20" fill="none" stroke="#cf0f47" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4"/>
        
        <!-- Header -->
        <text x="500" y="110" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffdede" letter-spacing="6">TRUSTPE PROTOCOL • "LOCKED, UNTIL ITS EARNED"</text>
        <text x="500" y="160" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" letter-spacing="1">CERTIFICATE OF MILESTONE COMPLETION</text>
        <text x="500" y="195" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#888888">This cryptographically confirms that the following builder has completed the on-chain pledge</text>
        
        <!-- Recipient Name -->
        <text x="500" y="275" text-anchor="middle" font-family="sans-serif" font-size="42" font-weight="900" fill="#ffdede">${recipientName}</text>
        <text x="500" y="305" text-anchor="middle" font-family="monospace" font-size="14" fill="#AAAAAA">${gift.recipient}</text>
        
        <!-- Milestone Condition Box -->
        <rect x="120" y="340" width="760" height="110" rx="16" fill="#18030b" stroke="#cf0f47" stroke-width="2"/>
        <text x="500" y="375" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#ff0b55" letter-spacing="3">VERIFIED MILESTONE REQUIREMENT</text>
        <text x="500" y="415" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">"${gift.description}"</text>
        
        <!-- Reward & Speed Details -->
        <rect x="120" y="475" width="235" height="85" rx="14" fill="#000000" stroke="#cf0f47" stroke-width="1.5"/>
        <text x="237" y="508" text-anchor="middle" font-family="monospace" font-size="11" fill="#888888">SETTLED VALUE</text>
        <text x="237" y="538" text-anchor="middle" font-family="monospace" font-size="20" font-weight="900" fill="#ffdede">${gift.amount} MON</text>
        
        <rect x="382" y="475" width="235" height="85" rx="14" fill="#000000" stroke="#cf0f47" stroke-width="1.5"/>
        <text x="500" y="508" text-anchor="middle" font-family="monospace" font-size="11" fill="#888888">MONAD LATENCY</text>
        <text x="500" y="538" text-anchor="middle" font-family="monospace" font-size="20" font-weight="900" fill="#ffdede">${gift.confirmationTimeMs || 382} MS</text>
        
        <rect x="645" y="475" width="235" height="85" rx="14" fill="#000000" stroke="#cf0f47" stroke-width="1.5"/>
        <text x="762" y="508" text-anchor="middle" font-family="monospace" font-size="11" fill="#888888">EXECUTION DATE</text>
        <text x="762" y="538" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">${completionDate}</text>
        
        <!-- Signatures & Authority -->
        <line x1="150" y1="625" x2="380" y2="625" stroke="#444" stroke-width="1.5"/>
        <text x="265" y="645" text-anchor="middle" font-family="monospace" font-size="12" fill="#AAAAAA">PLEDGED BY: ${creatorName}</text>
        
        <!-- Monad Seal -->
        <circle cx="500" cy="610" r="35" fill="#cf0f47" opacity="0.2"/>
        <circle cx="500" cy="610" r="28" fill="#000000" stroke="#cf0f47" stroke-width="2"/>
        <text x="500" y="618" text-anchor="middle" font-family="monospace" font-size="22" font-weight="900" fill="#ffdede">M</text>
        
        <line x1="620" y1="625" x2="850" y2="625" stroke="#444" stroke-width="1.5"/>
        <text x="735" y="645" text-anchor="middle" font-family="monospace" font-size="12" fill="#AAAAAA">CHAIN ID: 10143 (MONAD TESTNET)</text>
      </svg>
    `;

    const blob = new Blob([certificateSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustPe-Certificate-${recipientName.replace(/\s+/g, '-')}.svg`;
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
        className="relative w-full max-w-3xl bg-[#000000] border-2 border-[#cf0f47] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(207,15,71,0.35)] text-white my-auto overflow-hidden"
      >
        {/* Certificate Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff0b55]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top */}
        <div className="flex items-center justify-between pb-4 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#cf0f47]/20 text-[#ff0b55] border border-[#cf0f47]/40 flex items-center justify-center shadow-[0_0_20px_rgba(207,15,71,0.3)]">
              <Award className="w-5 h-5 text-[#ffdede]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#ff0b55] tracking-widest">
                Soulbound Achievement Badge
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                TrustPe Verified Builder Certificate
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

        {/* Certificate Display Canvas */}
        <div className="my-6 p-6 sm:p-8 rounded-2xl bg-[#120208] border border-[#cf0f47]/40 relative overflow-hidden text-center shadow-inner">
          <div className="absolute top-4 left-4 text-[10px] font-mono uppercase font-bold text-[#ff0b55] tracking-widest">
            MONAD BLITZ // HYDERABAD
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-[#ffdede]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff0b55]" />
            <span>VERIFIED ON-CHAIN</span>
          </div>

          {/* Certificate Body */}
          <div className="mt-6 mb-2">
            <div className="w-16 h-16 rounded-full bg-[#cf0f47]/20 text-[#ffdede] border border-[#ff0b55]/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(207,15,71,0.4)]">
              <Award className="w-8 h-8 text-[#ffdede]" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-400">
              Certificate of Completion
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
              {recipientName}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">{gift.recipient}</p>
          </div>

          {/* Milestone Description Box */}
          <div className="my-5 p-4 rounded-xl bg-[#000000] border border-[#cf0f47]/40 max-w-xl mx-auto">
            <div className="text-[10px] uppercase font-mono font-bold text-[#ffdede] tracking-widest mb-1">
              Accomplished Milestone
            </div>
            <p className="text-sm font-bold text-white">
              "{gift.description}"
            </p>
          </div>

          {/* Verification Metrics Trio */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto text-xs">
            <div className="p-3 rounded-xl bg-[#000000] border border-[#cf0f47]/30">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Payout</div>
              <div className="font-mono font-black text-[#ffdede] text-base">{gift.amount} MON</div>
            </div>
            <div className="p-3 rounded-xl bg-[#000000] border border-[#cf0f47]/30">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Latency</div>
              <div className="font-mono font-black text-white text-base">{gift.confirmationTimeMs || 382}ms</div>
            </div>
            <div className="p-3 rounded-xl bg-[#000000] border border-[#cf0f47]/30">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Status</div>
              <div className="font-mono font-black text-[#ffdede] text-base">SETTLED</div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-6 pt-4 border-t border-[#cf0f47]/30 flex items-center justify-between text-[11px] font-mono text-zinc-400 max-w-xl mx-auto">
            <div>
              <div className="font-bold text-white">Trigger Auth: {creatorName}</div>
              <div className="text-[10px] text-zinc-500">{completionDate}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#ffdede]">TrustPe Escrow Protocol</div>
              <div className="text-[10px] text-zinc-500">Chain ID: 10143</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#cf0f47]/30">
          {gift.releaseTxHash ? (
            <a
              href={`${MONAD_EXPLORER_URL}/tx/${gift.releaseTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
            >
              <span>Explore Settlement Tx</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ffdede]" />
            </a>
          ) : (
            <div className="text-xs font-mono text-zinc-500">
              Escrow ID #{gift.id}
            </div>
          )}

          <button
            onClick={handleDownloadCertificate}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight transition flex items-center gap-2 shadow-lg shadow-[#cf0f47]/30 cursor-pointer border border-[#ffdede]/40"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-[#ffdede]" /> : <Download className="w-4 h-4 text-[#ffdede]" />}
            <span>{downloadSuccess ? 'Certificate Downloaded!' : 'Download Certificate (SVG)'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
