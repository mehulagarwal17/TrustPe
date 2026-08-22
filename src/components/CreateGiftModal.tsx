import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, User, Lock, AlertCircle, ArrowRight, Zap, Shield, CheckCircle2, ChevronRight, Wand2, Clock, Layers, Palette, Clipboard, Check, BookUser } from 'lucide-react';
import { parseEther, isAddress } from 'viem';
import { DEFAULT_GIFT_LOCK_ADDRESS, MONAD_EXPLORER_URL } from '../config/monadChain';
import { GiftItem, DemoPersona, NetworkStats, TxSpeedRecord, CardTheme, MilestoneStage } from '../types';
import { generateMonadTxHash, recordTxSpeed } from '../services/monadRpc';
import { AddressBookModal } from './AddressBookModal';
import confetti from 'canvas-confetti';

interface CreateGiftProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: DemoPersona;
  isInjectedWallet: boolean;
  injectedAddress: `0x${string}` | null;
  onGiftCreated: (gift: GiftItem, speedRecord: TxSpeedRecord) => void;
  networkStats: NetworkStats | null;
}

const PRESET_AMOUNTS = ['0.5', '1.0', '2.5', '5.0', '10.0'];

const AI_MILESTONE_TEMPLATES = [
  {
    category: 'hackathon',
    title: '🏆 Hackathon Winner MVP',
    desc: 'Ship functional working prototype on Monad Testnet with verified contracts & live presentation deck in Hyderabad',
    suggestedAmount: '5.0',
    stages: [
      { id: 1, title: 'UI Frontend & Wallet Connect', percentage: 30 },
      { id: 2, title: 'Solidity Smart Contract & Foundry Tests', percentage: 30 },
      { id: 3, title: 'Live Testnet Deployment & Demo', percentage: 40 },
    ],
  },
  {
    category: 'opensource',
    title: '🛠️ Open Source GitHub PR',
    desc: 'Resolve open issue, implement feature branch with >90% test coverage, and merge pull request into upstream repository',
    suggestedAmount: '2.5',
    stages: [
      { id: 1, title: 'Submit Pull Request with unit tests', percentage: 40 },
      { id: 2, title: 'Code review approval & upstream merge', percentage: 60 },
    ],
  },
  {
    category: 'security',
    title: '🔒 Smart Contract Audit',
    desc: 'Perform full security review of smart contracts, submit formal audit report, and fix all high/medium severity findings',
    suggestedAmount: '8.0',
    stages: [
      { id: 1, title: 'Initial Vulnerability Assessment Report', percentage: 50 },
      { id: 2, title: 'Verification of Remediation Fixes', percentage: 50 },
    ],
  },
  {
    category: 'education',
    title: '🎓 University Coursework / Research',
    desc: 'Complete EVM Parallel Execution research thesis and deliver a comprehensive technical whitepaper report with benchmarks',
    suggestedAmount: '3.0',
    stages: [
      { id: 1, title: 'Benchmark Methodology & Data Collection', percentage: 50 },
      { id: 2, title: 'Final Thesis Submission & Presentation', percentage: 50 },
    ],
  },
];

export const CreateGiftModal: React.FC<CreateGiftProps> = ({
  isOpen,
  onClose,
  activePersona,
  isInjectedWallet,
  injectedAddress,
  onGiftCreated,
  networkStats,
}) => {
  const currentCreatorAddress = (isInjectedWallet && injectedAddress ? injectedAddress : activePersona.address) as `0x${string}`;

  // Form State - strictly EVM address inputs
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('2.5');
  const [description, setDescription] = useState<string>(AI_MILESTONE_TEMPLATES[0].desc);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('neon-purple');
  const [useCustomTrigger, setUseCustomTrigger] = useState<boolean>(false);
  const [customTrigger, setCustomTrigger] = useState<string>('');
  const [enableStages, setEnableStages] = useState<boolean>(false);
  const [selectedDeadlineDays, setSelectedDeadlineDays] = useState<number>(0); // 0 = no deadline
  const [copiedPaste, setCopiedPaste] = useState<boolean>(false);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState<boolean>(false);
  const [addressBookTarget, setAddressBookTarget] = useState<'recipient' | 'trigger'>('recipient');

  // Submission & Latency State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [confirmedSpeed, setConfirmedSpeed] = useState<TxSpeedRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAiPresets, setShowAiPresets] = useState<boolean>(false);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setConfirmedSpeed(null);
      setIsSubmitting(false);
      setErrorMsg(null);
      setElapsedMs(0);
      setCopiedPaste(false);
    }
  }, [isOpen]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handlePasteAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        const trimmed = text.trim();
        if (trimmed) {
          setRecipient(trimmed);
          setErrorMsg(null);
          setCopiedPaste(true);
          setTimeout(() => setCopiedPaste(false), 1500);
        }
      }
    } catch (err) {
      // clipboard permission denied or not supported
    }
  };

  const handleApplyAiTemplate = (tmpl: typeof AI_MILESTONE_TEMPLATES[0]) => {
    setDescription(tmpl.desc);
    setAmount(tmpl.suggestedAmount);
    setShowAiPresets(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRecipient = recipient.trim();
    const cleanTrigger = customTrigger.trim();

    // Form Validations - strictly valid EVM address only
    if (!cleanRecipient) {
      setErrorMsg('Please enter a valid Monad EVM recipient address (0x...).');
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (!isAddress(cleanRecipient)) {
      setErrorMsg('Invalid EVM recipient address. It must be a valid 42-character hex address starting with 0x (e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8).');
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMsg('Please specify a positive MON amount to lock.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a milestone description.');
      return;
    }

    if (useCustomTrigger) {
      if (!cleanTrigger) {
        setErrorMsg('Please enter a custom trigger authority EVM address (0x...).');
        return;
      }
      if (!isAddress(cleanTrigger)) {
        setErrorMsg('Invalid custom trigger authority address. It must be a valid 42-character EVM address (0x...).');
        return;
      }
    }

    // Start Real-Time Monad Speedometer
    setIsSubmitting(true);
    setConfirmedSpeed(null);
    startTimeRef.current = performance.now();

    timerRef.current = window.setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startTimeRef.current));
    }, 10);

    try {
      // Simulate real Monad sub-second block inclusion (~320ms to 480ms on Monad Testnet)
      const simulatedMonadLatency = Math.floor(Math.random() * 140) + 340; 
      
      await new Promise((resolve) => setTimeout(resolve, simulatedMonadLatency));

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const totalDuration = Math.round(performance.now() - startTimeRef.current);
      setElapsedMs(totalDuration);

      const txHash = generateMonadTxHash();
      const blockNum = (networkStats?.blockNumber || 4893150) + 1;
      const giftId = Date.now().toString();

      // Build stages if enabled
      let stages: MilestoneStage[] | undefined = undefined;
      if (enableStages) {
        const totalNum = Number(amount);
        stages = [
          { id: 1, title: 'Phase 1: Architecture & Prototype', percentage: 30, amountMon: (totalNum * 0.3).toFixed(2), isCompleted: false },
          { id: 2, title: 'Phase 2: Core Implementation & Tests', percentage: 30, amountMon: (totalNum * 0.3).toFixed(2), isCompleted: false },
          { id: 3, title: 'Phase 3: Final Production Delivery', percentage: 40, amountMon: (totalNum * 0.4).toFixed(2), isCompleted: false },
        ];
      }

      const deadlineTimestamp = selectedDeadlineDays > 0 
        ? Date.now() + selectedDeadlineDays * 24 * 60 * 60 * 1000 
        : undefined;

      const newGift: GiftItem = {
        id: giftId,
        creator: currentCreatorAddress,
        recipient: recipient as `0x${string}`,
        triggerAuthority: (useCustomTrigger ? customTrigger : currentCreatorAddress) as `0x${string}`,
        amount: amount,
        amountWei: parseEther(amount).toString(),
        description: description.trim(),
        status: 'Locked',
        createdAt: Date.now(),
        releasedAt: 0,
        creationTxHash: txHash,
        confirmationTimeMs: totalDuration,
        blockNumber: blockNum,
        theme: selectedTheme,
        deadlineTimestamp,
        stages,
      };

      const speedRecord: TxSpeedRecord = {
        type: 'create',
        giftId,
        txHash,
        durationMs: totalDuration,
        blockNumber: blockNum,
        timestamp: Date.now(),
        amountMon: amount,
      };

      recordTxSpeed(speedRecord);
      setConfirmedSpeed(speedRecord);
      setIsSubmitting(false);

      // Trigger visual confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A005FF', '#00FF66', '#FFB800', '#FF007A'],
        });
      } catch (err) {
        // ignore confetti errors
      }

      onGiftCreated(newGift, speedRecord);
    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Transaction submission failed on Monad Testnet');
    }
  };

  return (
    <div ref={modalContainerRef} className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#000000] border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.35)] p-6 sm:p-8 text-white my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#cf0f47] to-[#ff0b55] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-[#cf0f47]/40 border border-[#ffdede]/30">
              <Lock className="w-5 h-5 text-[#ffdede]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Create TrustPe Escrow</h2>
              <p className="text-xs tracking-wider text-[#ffdede] font-bold">"Locked, until its earned"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Confirmation Screen if Confirmed */}
        {confirmedSpeed ? (
          <div className="py-6 space-y-6">
            <div className="p-8 rounded-3xl bg-[#120208] border-2 border-[#ffdede] text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#ff0b55]/20 text-[#ffdede] border border-[#ffdede]/40 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(255,11,85,0.35)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#ffdede]">
                Confirmed On Monad Testnet
              </span>
              
              {/* Giant Speed Punchline */}
              <div className="mt-3 flex items-baseline justify-center gap-2 font-mono">
                <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
                  {(confirmedSpeed.durationMs / 1000).toFixed(2)}s
                </span>
                <span className="text-2xl font-black text-[#ff0b55] uppercase tracking-tight">
                  ({confirmedSpeed.durationMs} ms)
                </span>
              </div>
              
              <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
                <strong className="text-[#ffdede] font-black">{amount} MON</strong> successfully locked in escrow.
                The funds will automatically unlock when the milestone is marked complete.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href={`${MONAD_EXPLORER_URL}/tx/${confirmedSpeed.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white text-xs font-black uppercase tracking-tight transition flex items-center gap-2 shadow-lg shadow-[#cf0f47]/30 border border-[#ffdede]/30"
                >
                  <span>Verify on MonadVision</span>
                  <Zap className="w-3.5 h-3.5 text-[#ffdede]" />
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#ffdede] text-black hover:bg-white text-xs font-black uppercase tracking-tight transition cursor-pointer shadow font-bold"
                >
                  View in Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            
            {/* Recipient Address Field - Pure EVM Address */}
            <div id="recipient-input-container">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <span>Recipient EVM Address (0x...)</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressBookTarget('recipient');
                      setIsAddressBookOpen(true);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#cf0f47]/30 hover:bg-[#cf0f47]/50 text-[#ffdede] border border-[#ff0b55]/40 text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
                  >
                    <BookUser className="w-3 h-3 text-[#ff0b55]" />
                    <span>Address Book / Test Accounts</span>
                  </button>

                  {/* Validation Status Badge */}
                  {isAddress(recipient.trim()) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#ffdede] font-bold bg-[#cf0f47]/30 px-2.5 py-0.5 rounded-full border border-[#ff0b55]/40 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-[#ff0b55]" />
                      <span>Valid EVM</span>
                    </span>
                  ) : recipient.trim().length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-mono">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Must be 42-char 0x</span>
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-[#ffdede] tracking-wider">
                      Required
                    </span>
                  )}
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                  className={`w-full px-4 py-3.5 pr-28 rounded-xl bg-[#120208] border focus:outline-none text-white font-mono text-sm placeholder-zinc-600 transition ${
                    isAddress(recipient.trim())
                      ? 'border-[#ff0b55] focus:border-[#ffdede] shadow-[0_0_15px_rgba(255,11,85,0.15)]'
                      : recipient.trim().length > 0
                      ? 'border-amber-500/60 focus:border-amber-400'
                      : 'border-[#cf0f47]/40 focus:border-[#ffdede]'
                  }`}
                />

                <div className="absolute right-2 flex items-center gap-1.5">
                  {recipient && (
                    <button
                      type="button"
                      onClick={() => {
                        setRecipient('');
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="px-2 py-1.5 rounded-lg bg-[#000000] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 text-[10px] font-mono transition cursor-pointer"
                      title="Clear address"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handlePasteAddress}
                    className="px-2.5 py-1.5 rounded-lg bg-[#cf0f47]/30 hover:bg-[#cf0f47]/50 text-[#ffdede] border border-[#ff0b55]/40 text-[10px] font-bold uppercase tracking-tight transition flex items-center gap-1 cursor-pointer"
                    title="Paste address from clipboard"
                  >
                    {copiedPaste ? <Check className="w-3 h-3 text-[#ffdede]" /> : <Clipboard className="w-3 h-3 text-[#ff0b55]" />}
                    <span>{copiedPaste ? 'Pasted' : 'Paste'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 mt-1.5">
                Enter the recipient's 42-character Ethereum / Monad wallet address where locked funds will be released upon milestone completion.
              </p>
            </div>

            {/* Amount Field (MON) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em]">
                  Reward Amount (MON)
                </label>
                <span className="text-[10px] uppercase font-bold text-[#ffdede] tracking-wider">Locked in smart contract</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.1"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2.5"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#120208] border border-[#cf0f47]/40 focus:border-[#ffdede] focus:outline-none text-white font-mono text-lg font-black placeholder-zinc-500 transition pr-16"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-[#ffdede] pointer-events-none">
                    MON
                  </div>
                </div>

                {/* Preset amount chips */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {PRESET_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-3 py-3 rounded-xl text-xs font-black uppercase tracking-tight border transition cursor-pointer ${
                        amount === val
                          ? 'bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] border-[#ffdede]/40 text-white shadow-md shadow-[#cf0f47]/30'
                          : 'bg-[#120208] border-[#cf0f47]/30 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestone Description with AI Smart Prompter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em]">
                  Milestone Description
                </label>
                <button
                  type="button"
                  onClick={() => setShowAiPresets(!showAiPresets)}
                  className="text-[10px] uppercase font-black tracking-wider text-[#ffdede] hover:brightness-110 flex items-center gap-1 cursor-pointer bg-[#cf0f47]/20 px-2.5 py-0.5 rounded-full border border-[#ff0b55]/30"
                >
                  <Wand2 className="w-3 h-3 text-[#ff0b55]" />
                  <span>AI Smart Milestones</span>
                </button>
              </div>

              {/* AI Presets Dropdown */}
              {showAiPresets && (
                <div className="mb-3 p-3 rounded-2xl bg-[#120208] border border-[#ff0b55]/40 space-y-2">
                  <div className="text-[10px] font-mono uppercase font-bold text-[#ffdede]">
                    Select an AI-Optimized Milestone Objective:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AI_MILESTONE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.title}
                        type="button"
                        onClick={() => handleApplyAiTemplate(tmpl)}
                        className="p-2.5 rounded-xl bg-[#000000] hover:bg-[#250410] border border-[#cf0f47]/30 hover:border-[#ffdede] text-left transition cursor-pointer"
                      >
                        <div className="text-xs font-bold text-white">{tmpl.title}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{tmpl.desc}</div>
                        <div className="text-[9px] font-mono text-[#ffdede] font-bold mt-1">Suggested: {tmpl.suggestedAmount} MON</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the milestone condition (e.g., Complete live demo on stage)..."
                className="w-full px-4 py-3.5 rounded-xl bg-[#120208] border border-[#cf0f47]/30 focus:border-[#ffdede] focus:outline-none text-white text-sm placeholder-zinc-500 transition resize-none"
              />
            </div>

            {/* Advanced Options Grid: Theme, Progressive Tranches, Time-Lock Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Card Hologram Theme */}
              <div className="p-3.5 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  <Palette className="w-3.5 h-3.5 text-[#ff0b55]" />
                  <span>Card Theme</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold font-mono">
                  {[
                    { id: 'neon-purple', label: '🌹 Ruby Rose' },
                    { id: 'cyber-gold', label: '🌸 Blush Glow' },
                    { id: 'emerald-builder', label: '💚 Emerald' },
                    { id: 'sakura-frost', label: '💖 Neon Fuchsia' },
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id as CardTheme)}
                      className={`px-2 py-1.5 rounded-lg transition text-left cursor-pointer border ${
                        selectedTheme === th.id
                          ? 'bg-[#cf0f47]/40 text-[#ffdede] border-[#ffdede]'
                          : 'bg-[#000000] border-[#cf0f47]/30 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline Expiry Selector */}
              <div className="p-3.5 rounded-2xl bg-[#120208] border border-[#cf0f47]/30">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#ffdede]" />
                  <span>Expiry Deadline</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold font-mono">
                  {[
                    { days: 0, label: 'None' },
                    { days: 1, label: '24 Hours' },
                    { days: 7, label: '7 Days' },
                    { days: 14, label: '14 Days' },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setSelectedDeadlineDays(opt.days)}
                      className={`px-2 py-1.5 rounded-lg transition text-left cursor-pointer border ${
                        selectedDeadlineDays === opt.days
                          ? 'bg-[#cf0f47]/40 text-[#ffdede] border-[#ffdede]'
                          : 'bg-[#000000] border-[#cf0f47]/30 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Progressive Tranches Toggle */}
            <div className="p-4 rounded-2xl bg-[#120208] border border-[#cf0f47]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff0b55]" />
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white">Multi-Stage Tranches</span>
                  <p className="text-[10px] text-zinc-400 font-mono">Split reward into 3 progressive milestone checkpoints (30% / 30% / 40%)</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableStages}
                  onChange={(e) => setEnableStages(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff0b55]"></div>
              </label>
            </div>

            {/* Optional Custom Trigger Authority */}
            <div className="p-4 rounded-2xl bg-[#120208] border border-[#cf0f47]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#ff0b55]" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Trigger Authority</span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomTrigger}
                    onChange={(e) => setUseCustomTrigger(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff0b55]"></div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Custom Trigger</span>
                </label>
              </div>

              {useCustomTrigger ? (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-400">
                      Designate an independent judge, auditor, or multisig EVM address:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressBookTarget('trigger');
                        setIsAddressBookOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-full bg-[#cf0f47]/30 hover:bg-[#cf0f47]/50 text-[#ffdede] border border-[#ff0b55]/40 text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
                    >
                      <BookUser className="w-3 h-3 text-[#ff0b55]" />
                      <span>Address Book</span>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={customTrigger}
                      onChange={(e) => setCustomTrigger(e.target.value)}
                      placeholder="0x..."
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#000000] border text-white font-mono text-xs focus:outline-none transition ${
                        isAddress(customTrigger.trim())
                          ? 'border-[#ff0b55] focus:border-[#ffdede]'
                          : customTrigger.trim().length > 0
                          ? 'border-amber-500/60 focus:border-amber-400'
                          : 'border-[#cf0f47]/30 focus:border-[#ffdede]'
                      }`}
                    />
                  </div>

                  {isAddress(customTrigger.trim()) && (
                    <div className="text-[10px] font-mono text-[#ffdede] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#ff0b55]" />
                      <span>Valid Trigger EVM Address</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-400">
                  Default: <strong className="text-white font-bold">You (Creator)</strong> will have exclusive authority to verify the milestone and release funds.
                </p>
              )}
            </div>

            {/* Error Display */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* Submit Action or Real-time Speed Ticker */}
            <div className="pt-2">
              {isSubmitting ? (
                <div className="p-6 rounded-2xl bg-[#120208] border-2 border-[#cf0f47] text-center shadow-[0_0_30px_rgba(207,15,71,0.35)]">
                  <div className="flex items-center justify-center gap-2 text-[#ff0b55] text-xs uppercase font-bold tracking-[0.2em] animate-pulse">
                    <Zap className="w-4 h-4 text-[#ffdede]" />
                    Broadcasting to Monad Testnet...
                  </div>

                  {/* Real-time Ticking Millisecond Stopwatch */}
                  <div className="mt-2 font-mono text-5xl sm:text-6xl font-black text-white tracking-tighter">
                    {(elapsedMs / 1000).toFixed(2)}s
                    <span className="text-lg text-[#ffdede] ml-2 font-normal">
                      ({elapsedMs} ms)
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                    Single-slot parallel execution in progress...
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-5 rounded-xl bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] hover:brightness-110 text-white font-black text-xl uppercase tracking-tighter shadow-[0_0_30px_rgba(255,11,85,0.45)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer border border-[#ffdede]/30"
                >
                  <Lock className="w-5 h-5 text-[#ffdede]" />
                  <span>Lock {amount || '0'} MON in Escrow</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

          </form>
        )}

        {/* Address Book Modal */}
        <AddressBookModal
          isOpen={isAddressBookOpen}
          onClose={() => setIsAddressBookOpen(false)}
          connectedAddress={currentCreatorAddress}
          onSelectAddress={(selectedAddr) => {
            if (addressBookTarget === 'recipient') {
              setRecipient(selectedAddr);
            } else {
              setCustomTrigger(selectedAddr);
            }
            if (errorMsg) setErrorMsg(null);
          }}
        />

      </motion.div>
    </div>
  );
};

