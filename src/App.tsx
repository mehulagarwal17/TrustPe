import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { CreateGiftModal } from './components/CreateGiftModal';
import { MyGiftsScreen } from './components/MyGiftsScreen';
import { GiftDetailModal } from './components/GiftDetailModal';
import { ContractInspector } from './components/ContractInspector';
import { WalletConnectModal } from './components/WalletConnectModal';
import { SpeedConfirmationBadge } from './components/SpeedConfirmationBadge';
import { DigitalGiftCardModal } from './components/DigitalGiftCardModal';
import { AchievementCertificateModal } from './components/AchievementCertificateModal';
import { SpeedRaceSimulator } from './components/SpeedRaceSimulator';
import { AiMilestoneVerifierModal } from './components/AiMilestoneVerifierModal';
import { DEMO_PERSONAS, MONAD_CHAIN_ID, MONAD_RPC_URL, MONAD_EXPLORER_URL } from './config/monadChain';
import { GiftItem, DemoPersona, NetworkStats, TxSpeedRecord } from './types';
import { getStoredGifts, saveStoredGifts, fetchMonadNetworkStats, generateMonadTxHash, recordTxSpeed } from './services/monadRpc';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'hero' | 'create' | 'gifts' | 'speedrace' | 'contract'>('hero');

  // Wallet & Persona State
  const [activePersonaIndex, setActivePersonaIndex] = useState<number>(0);
  const [isInjectedWallet, setIsInjectedWallet] = useState<boolean>(false);
  const [injectedAddress, setInjectedAddress] = useState<`0x${string}` | null>(null);

  // Data State
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);

  // Modals & Active Selections
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [cardModalGift, setCardModalGift] = useState<GiftItem | null>(null);
  const [certModalGift, setCertModalGift] = useState<GiftItem | null>(null);
  const [aiVerifierGift, setAiVerifierGift] = useState<GiftItem | null>(null);
  const [releasingGiftId, setReleasingGiftId] = useState<string | null>(null);

  // Speedometer Pop-up Banner
  const [activeSpeedRecord, setActiveSpeedRecord] = useState<TxSpeedRecord | null>(null);

  const activePersona = DEMO_PERSONAS[activePersonaIndex];

  // Initialize stored gifts and live network telemetry
  useEffect(() => {
    const loadedGifts = getStoredGifts();
    setGifts(loadedGifts);

    const updateStats = async () => {
      const stats = await fetchMonadNetworkStats();
      setNetworkStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sync state to local storage
  const handleUpdateGifts = (newGifts: GiftItem[]) => {
    setGifts(newGifts);
    saveStoredGifts(newGifts);
  };

  // Gift Creation Handler
  const handleGiftCreated = (newGift: GiftItem, speedRecord: TxSpeedRecord) => {
    const updated = [newGift, ...gifts];
    handleUpdateGifts(updated);
    setActiveSpeedRecord(speedRecord);
  };

  // Milestone Confirmation Handler (Immediate Fund Release with Sub-Second Latency)
  const handleConfirmMilestone = async (gift: GiftItem) => {
    setReleasingGiftId(gift.id);
    const start = performance.now();

    try {
      // Simulate real Monad sub-second execution (~310ms - 440ms)
      const simulatedLatency = Math.floor(Math.random() * 130) + 310;
      await new Promise((resolve) => setTimeout(resolve, simulatedLatency));

      const durationMs = Math.round(performance.now() - start);
      const releaseTxHash = generateMonadTxHash();
      const currentBlock = (networkStats?.blockNumber || 4893180) + 1;

      const updatedGifts = gifts.map((g) => {
        if (g.id === gift.id) {
          return {
            ...g,
            status: 'Released' as const,
            releasedAt: Date.now(),
            releaseTxHash,
            confirmationTimeMs: durationMs,
          };
        }
        return g;
      });

      handleUpdateGifts(updatedGifts);

      const speedRecord: TxSpeedRecord = {
        type: 'release',
        giftId: gift.id,
        txHash: releaseTxHash,
        durationMs,
        blockNumber: currentBlock,
        timestamp: Date.now(),
        amountMon: gift.amount,
      };

      recordTxSpeed(speedRecord);
      setActiveSpeedRecord(speedRecord);

      // Update active selection modal if open
      if (selectedGift && selectedGift.id === gift.id) {
        setSelectedGift({
          ...selectedGift,
          status: 'Released',
          releasedAt: Date.now(),
          releaseTxHash,
          confirmationTimeMs: durationMs,
        });
      }

      // Trigger Celebration Fireworks
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#cf0f47', '#ff0b55', '#ffdede', '#ffffff'],
        });
      } catch (err) {
        // ignore confetti errors
      }
    } catch (err) {
      console.error('Milestone release failed', err);
    } finally {
      setReleasingGiftId(null);
    }
  };

  // Injected Wallet Connector
  const handleConnectInjected = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('No Web3 wallet extension found');
    }

    const eth = (window as any).ethereum;
    const accounts = await eth.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      setInjectedAddress(accounts[0] as `0x${string}`);
      setIsInjectedWallet(true);

      // Request Monad Testnet Switch / Add
      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x279f' }], // 10143 in hex
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x279f',
                chainName: 'Monad Testnet',
                nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
                rpcUrls: [MONAD_RPC_URL],
                blockExplorerUrls: [MONAD_EXPLORER_URL],
              },
            ],
          });
        }
      }
    }
  };

  const handleDisconnectInjected = () => {
    setIsInjectedWallet(false);
    setInjectedAddress(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#cf0f47] selection:text-white font-sans antialiased">
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activePersona={activePersona}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        networkStats={networkStats}
        isInjectedWallet={isInjectedWallet}
        injectedAddress={injectedAddress}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Floating / Active Speed Confirmation Banner */}
        {activeSpeedRecord && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <SpeedConfirmationBadge
              durationMs={activeSpeedRecord.durationMs}
              txHash={activeSpeedRecord.txHash}
              blockNumber={activeSpeedRecord.blockNumber}
              type={activeSpeedRecord.type}
              onClose={() => setActiveSpeedRecord(null)}
            />
          </div>
        )}

        {/* View Switching */}
        {currentTab === 'hero' && (
          <HeroLanding
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onNavigateGifts={() => setCurrentTab('gifts')}
            onNavigateContract={() => setCurrentTab('contract')}
            onNavigateSpeedRace={() => setCurrentTab('speedrace')}
            networkStats={networkStats}
            onSelectPersona={(idx) => {
              handleDisconnectInjected();
              setActivePersonaIndex(idx);
            }}
          />
        )}

        {currentTab === 'gifts' && (
          <MyGiftsScreen
            gifts={gifts}
            activePersona={activePersona}
            isInjectedWallet={isInjectedWallet}
            injectedAddress={injectedAddress}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onSelectGift={(gift) => setSelectedGift(gift)}
            onConfirmMilestone={handleConfirmMilestone}
            releasingGiftId={releasingGiftId}
            onOpenCardModal={(gift) => setCardModalGift(gift)}
            onOpenCertModal={(gift) => setCertModalGift(gift)}
            onOpenAiVerifier={(gift) => setAiVerifierGift(gift)}
          />
        )}

        {currentTab === 'speedrace' && (
          <div className="py-8">
            <SpeedRaceSimulator />
          </div>
        )}

        {currentTab === 'contract' && <ContractInspector />}
      </main>

      {/* Footer styled with Crimson / Rose Palette */}
      <footer className="mt-auto border-t border-[#cf0f47]/30 py-6 bg-[#000000]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-white font-black tracking-tight text-xs">TRUST<span className="text-[#ff0b55]">PE</span></span>
            <span>•</span>
            <span className="text-[#ffdede] normal-case font-bold">"Locked, until its earned"</span>
            <span>•</span>
            <span className="text-[#ffdede]">Chain ID: 10143</span>
            <span>•</span>
            <span className="text-[#ffdede] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff0b55] animate-pulse"></span>
              Monad Testnet RPC: Online
            </span>
            <span>•</span>
            <span>Block: {networkStats?.blockNumber ? `#${networkStats.blockNumber.toLocaleString()}` : '#4,821,092'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('speedrace')}
              className="text-[#ffdede] hover:text-white hover:underline cursor-pointer transition-colors"
            >
              Speed Race Simulator ⚡
            </button>
            <a
              href="https://testnet.monadvision.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#ffdede] transition-colors"
            >
              MonadVision Explorer
            </a>
            <a
              href="https://faucet.monad.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#ffdede] transition-colors"
            >
              MON Faucet
            </a>
            <button
              onClick={() => setCurrentTab('contract')}
              className="hover:text-[#ffdede] transition-colors cursor-pointer"
            >
              Solidity Contract
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateGiftModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        activePersona={activePersona}
        isInjectedWallet={isInjectedWallet}
        injectedAddress={injectedAddress}
        onGiftCreated={handleGiftCreated}
        networkStats={networkStats}
      />

      <GiftDetailModal
        gift={selectedGift}
        isOpen={!!selectedGift}
        onClose={() => setSelectedGift(null)}
        activePersona={activePersona}
        isInjectedWallet={isInjectedWallet}
        injectedAddress={injectedAddress}
        onConfirmMilestone={handleConfirmMilestone}
        isReleasing={releasingGiftId === selectedGift?.id}
        onOpenCardModal={(gift) => setCardModalGift(gift)}
        onOpenCertModal={(gift) => setCertModalGift(gift)}
        onOpenAiVerifier={(gift) => setAiVerifierGift(gift)}
      />

      <AiMilestoneVerifierModal
        gift={aiVerifierGift}
        isOpen={!!aiVerifierGift}
        onClose={() => setAiVerifierGift(null)}
        activePersona={activePersona}
        isInjectedWallet={isInjectedWallet}
        injectedAddress={injectedAddress}
        onConfirmMilestone={handleConfirmMilestone}
        isReleasing={releasingGiftId === aiVerifierGift?.id}
      />

      <DigitalGiftCardModal
        gift={cardModalGift}
        isOpen={!!cardModalGift}
        onClose={() => setCardModalGift(null)}
        activePersona={activePersona}
      />

      <AchievementCertificateModal
        gift={certModalGift}
        isOpen={!!certModalGift}
        onClose={() => setCertModalGift(null)}
        activePersona={activePersona}
      />

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        activePersona={activePersona}
        onSelectPersona={(idx) => setActivePersonaIndex(idx)}
        isInjectedWallet={isInjectedWallet}
        injectedAddress={injectedAddress}
        onConnectInjected={handleConnectInjected}
        onDisconnectInjected={handleDisconnectInjected}
      />

    </div>
  );
}

