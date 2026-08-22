import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, ShieldCheck, CheckCircle2, AlertCircle, 
  ExternalLink, Upload, Github, Globe, FileCode, FileText, 
  Zap, ArrowRight, RefreshCw, Check, Bot, Award, Lock
} from 'lucide-react';
import { GiftItem, DemoPersona } from '../types';
import { MONAD_EXPLORER_URL } from '../config/monadChain';

interface AiMilestoneVerifierModalProps {
  gift: GiftItem | null;
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onConfirmMilestone: (gift: GiftItem) => void;
  isReleasing: boolean;
}

interface VerificationResult {
  verdict: 'APPROVED' | 'NEEDS_REVISION';
  score: number;
  summary: string;
  deliverablesFound: string[];
  criteriaAnalysis: string;
  reasoning: string;
  recommendedAction: string;
  oracleSignature: string;
  oracleTimestamp: number;
}

const SAMPLE_PROOFS = [
  {
    title: 'Foundry & Smart Contract Proof',
    type: 'github',
    url: 'https://github.com/monad-developers/monad-escrow-contracts/pull/42',
    notes: 'Completed full Solidity test suite with 100% code coverage. Deployed to Monad Testnet at 0x8a90CAB... Verified all events and reentrancy guards.',
    content: `// Monad Testnet Deployment Log\nContract deployed at: 0x8a90CAB4323E73E21f3AcA5dC2A802521c750B1B\nTx Hash: 0x9f8e7d6c5b4a3928172635441029384756102938475610293847561029384756\nGas used: 142,520 (0.00014 MON)\nTests passed: 24/24 | Fuzz tests: 5,000 runs`,
  },
  {
    title: 'Hackathon dApp & Frontend Proof',
    type: 'url',
    url: 'https://trustpe.vercel.app',
    notes: 'Finished the responsive React + Tailwind web3 interface with instant Monad RPC wallet connection, live speedometer, and 3D gift cards.',
    content: `Live Production URL: https://trustpe.vercel.app\nIntegrated Monad Testnet (Chain ID 10143)\n"Locked, until its earned" protocol workflows active.\nSub-second state synchronization and QR claim flows ready.`,
  },
  {
    title: 'Certification & Course Completion',
    type: 'text',
    url: 'https://credentials.monad.xyz/verify/CERT-9921',
    notes: 'Successfully completed the Advanced EVM High-Throughput Architecture course with 98% grade.',
    content: `Certificate ID: MONAD-ARCH-2026-9921\nRecipient: Verified Student\nIssued by: Monad Academy\nVerification Hash: 0x7c4b9a1e0f3d6c8b`,
  },
];

export const AiMilestoneVerifierModal: React.FC<AiMilestoneVerifierModalProps> = ({
  gift,
  isOpen,
  onClose,
  activePersona,
  isInjectedWallet,
  injectedAddress,
  onConfirmMilestone,
  isReleasing,
}) => {
  const [proofType, setProofType] = useState<'github' | 'url' | 'code' | 'text'>('github');
  const [proofUrl, setProofUrl] = useState<string>('https://github.com/monad-dev/proof-of-work/pull/12');
  const [proofNotes, setProofNotes] = useState<string>('Implemented the required milestone deliverables with automated tests and deployed to Monad Testnet.');
  const [proofContent, setProofContent] = useState<string>('');
  const [proofImageBase64, setProofImageBase64] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationStage, setEvaluationStage] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !gift) return null;

  const currentAddress = (isInjectedWallet && injectedAddress ? injectedAddress : activePersona.address).toLowerCase();
  const isRecipient = gift.recipient.toLowerCase() === currentAddress;
  const isTrigger = gift.triggerAuthority.toLowerCase() === currentAddress;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5MB');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofImageBase64(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplySample = (sample: typeof SAMPLE_PROOFS[0]) => {
    setProofType(sample.type as any);
    setProofUrl(sample.url);
    setProofNotes(sample.notes);
    setProofContent(sample.content);
    setResult(null);
    setErrorMsg(null);
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setErrorMsg(null);
    setResult(null);

    setEvaluationStage('Querying MonadLock AI Oracle (Gemini 3.7 Flash)...');

    try {
      const stages = [
        'Connecting to Monad AI Oracle...',
        'Parsing milestone condition & deliverables...',
        'Analyzing code commits & cryptographic proof...',
        'Synthesizing verification consensus & score...',
      ];

      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < stages.length) {
          setEvaluationStage(stages[step]);
        }
      }, 450);

      const res = await fetch('/api/verify-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneDescription: gift.description,
          proofType,
          proofUrl,
          proofNotes,
          proofContent,
          proofImageBase64,
          amount: gift.amount,
          recipient: gift.recipient,
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Evaluation request failed with status ${res.status}`);
      }

      const data: VerificationResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('AI Oracle evaluation error:', err);
      setErrorMsg(err.message || 'Failed to complete AI verification. Please verify details and try again.');
    } finally {
      setIsEvaluating(false);
      setEvaluationStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#000000] border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.4)] p-6 sm:p-8 text-white my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#ff0b55]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#cf0f47]/20 border border-[#ff0b55]/40 flex items-center justify-center text-[#ffdede] shadow-[0_0_20px_rgba(207,15,71,0.3)]">
              <Bot className="w-6 h-6 text-[#ff0b55]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ff0b55] tracking-widest">
                  AI Milestone Oracle
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#cf0f47]/20 border border-[#ff0b55]/30 text-[#ffdede]">
                  Gemini 3.7 Flash
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Proof-of-Work Verifier
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

        {/* Target Milestone Summary */}
        <div className="my-5 p-4 rounded-2xl bg-[#120208] border border-[#cf0f47]/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-[#ff0b55] tracking-[0.15em] flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#ff0b55]" />
              Locked Escrow Condition (#{gift.id})
            </span>
            <span className="text-sm font-mono font-black text-[#ffdede]">
              {gift.amount} MON
            </span>
          </div>
          <p className="text-sm text-white font-bold">
            "{gift.description}"
          </p>
          <div className="mt-2 text-[11px] font-mono text-zinc-400 flex flex-wrap gap-3">
            <span>Recipient: {gift.recipient.slice(0, 6)}...{gift.recipient.slice(-4)}</span>
            <span>•</span>
            <span>Trigger Authority: {gift.triggerAuthority.slice(0, 6)}...{gift.triggerAuthority.slice(-4)}</span>
          </div>
        </div>

        {/* Quick Sample Proof Presets */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#ff0b55]" />
            <span>Load Quick Demo Proof:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_PROOFS.map((samp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(samp)}
                className="p-2.5 rounded-xl bg-[#120208] hover:bg-[#250410] border border-[#cf0f47]/30 hover:border-[#ff0b55] text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-white truncate">{samp.title}</div>
                <div className="text-[10px] text-zinc-400 uppercase font-mono mt-0.5">{samp.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Proof Submission Tabs */}
        <div className="space-y-4">
          <div className="flex border-b border-[#cf0f47]/30 pb-2 gap-2 overflow-x-auto">
            {[
              { id: 'github', label: 'GitHub PR / Repo', icon: Github },
              { id: 'url', label: 'Live App / URL', icon: Globe },
              { id: 'code', label: 'Code & Logs', icon: FileCode },
              { id: 'text', label: 'Cert / Text Proof', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = proofType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProofType(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] text-white shadow-md shadow-[#cf0f47]/30'
                      : 'bg-[#120208] text-zinc-400 hover:text-white border border-[#cf0f47]/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* URL Input */}
          {(proofType === 'github' || proofType === 'url') && (
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">
                {proofType === 'github' ? 'GitHub Pull Request or Repository Link' : 'Live Verification URL'}
              </label>
              <input
                type="text"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 rounded-xl bg-[#120208] border border-[#cf0f47]/40 focus:border-[#ffdede] focus:outline-none text-white font-mono text-xs"
              />
            </div>
          )}

          {/* Builder Deliverables Notes */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">
              Deliverable Summary & Testimonial Notes
            </label>
            <textarea
              rows={2}
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              placeholder="Explain how your deliverable satisfies the milestone condition..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#120208] border border-[#cf0f47]/40 focus:border-[#ffdede] focus:outline-none text-white text-xs"
            />
          </div>

          {/* Code / Test Output Snippet */}
          {proofType === 'code' && (
            <div>
              <label className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">
                Code Snippet / Deployment Logs
              </label>
              <textarea
                rows={4}
                value={proofContent}
                onChange={(e) => setProofContent(e.target.value)}
                placeholder="Paste contract address, test outputs, or code diff..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#120208] border border-[#cf0f47]/40 focus:border-[#ffdede] focus:outline-none text-white font-mono text-xs"
              />
            </div>
          )}

          {/* Optional Screenshot / Certificate Upload */}
          <div className="p-3.5 rounded-xl bg-[#120208] border border-[#cf0f47]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-[#ff0b55]" />
              <div>
                <div className="text-xs font-bold text-white">Attach Screenshot / Certificate</div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {imageFileName ? `Selected: ${imageFileName}` : 'PNG, JPG or PDF proof (optional)'}
                </div>
              </div>
            </div>

            <label className="px-3 py-1.5 rounded-lg bg-[#cf0f47]/30 hover:bg-[#cf0f47]/50 text-[#ffdede] border border-[#ff0b55]/40 text-xs font-bold uppercase tracking-wider cursor-pointer transition">
              <span>{imageFileName ? 'Change' : 'Browse'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Evaluation Trigger Button */}
        <div className="mt-5">
          <button
            type="button"
            disabled={isEvaluating}
            onClick={handleRunEvaluation}
            className={`w-full py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isEvaluating
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#cf0f47] via-[#ff0b55] to-[#ffdede] text-white hover:brightness-110 shadow-[#cf0f47]/40 border border-[#ffdede]/40'
            }`}
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#ffdede]" />
                <span>{evaluationStage || 'AI Oracle Evaluating Proof...'}</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-white" />
                <span>Run AI Oracle Milestone Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AI Evaluation Results Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-5 rounded-2xl border-2 shadow-xl ${
                result.verdict === 'APPROVED'
                  ? 'bg-[#120208] border-[#ff0b55] shadow-[0_0_30px_rgba(255,11,85,0.2)]'
                  : 'bg-[#120208] border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
              }`}
            >
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#cf0f47]/30">
                <div className="flex items-center gap-2">
                  {result.verdict === 'APPROVED' ? (
                    <div className="w-8 h-8 rounded-full bg-[#cf0f47]/30 text-[#ffdede] flex items-center justify-center border border-[#ff0b55]/50">
                      <CheckCircle2 className="w-5 h-5 text-[#ff0b55]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">AI Oracle Verdict</span>
                    <h3 className={`text-base font-black uppercase tracking-wide ${
                      result.verdict === 'APPROVED' ? 'text-[#ffdede]' : 'text-amber-400'
                    }`}>
                      {result.verdict === 'APPROVED' ? '✨ Milestone Verified & Approved' : '⚠️ Revision Required'}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Score</span>
                  <span className="text-2xl font-black font-mono text-white">
                    {result.score}<span className="text-xs text-zinc-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="mt-3 text-xs text-zinc-200 leading-relaxed font-medium">
                {result.summary}
              </p>

              {/* Deliverables Checklist */}
              {result.deliverablesFound && result.deliverablesFound.length > 0 && (
                <div className="mt-3.5 p-3 rounded-xl bg-[#000000]/60 border border-[#cf0f47]/20">
                  <span className="text-[10px] uppercase font-bold text-[#ff0b55] tracking-wider block mb-1.5">
                    Verified Deliverables
                  </span>
                  <div className="space-y-1">
                    {result.deliverablesFound.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-white">
                        <Check className="w-3.5 h-3.5 text-[#ffdede] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Oracle Cryptographic Signature */}
              <div className="mt-3 text-[10px] font-mono text-zinc-400 flex items-center justify-between border-t border-[#cf0f47]/20 pt-2">
                <span className="truncate max-w-[70%]">Oracle Sig: {result.oracleSignature}</span>
                <span>{new Date(result.oracleTimestamp).toLocaleTimeString()}</span>
              </div>

              {/* Immediate Release Button if Approved */}
              {result.verdict === 'APPROVED' && gift.status === 'Locked' && (
                <div className="mt-4 pt-3 border-t border-[#cf0f47]/30">
                  <button
                    type="button"
                    disabled={isReleasing}
                    onClick={() => {
                      onConfirmMilestone(gift);
                      onClose();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white font-black uppercase text-xs tracking-wider shadow-lg shadow-[#cf0f47]/40 flex items-center justify-center gap-2 transition cursor-pointer border border-[#ffdede]/40"
                  >
                    <Zap className="w-4 h-4 text-[#ffdede]" />
                    <span>
                      {isReleasing ? 'Executing Instant Settlement on Monad...' : `Execute AI-Verified Instant Release (${gift.amount} MON)`}
                    </span>
                  </button>
                  <p className="text-center text-[10px] font-mono text-[#ffdede] mt-1.5">
                    ⚡ Instant finality on Monad Testnet (~400ms single-slot)
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
