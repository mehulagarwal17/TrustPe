import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookUser, X, Copy, Check, User, Shield, Award, Sparkles, Wallet } from 'lucide-react';
import { DEMO_PERSONAS } from '../config/monadChain';

interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string, label: string) => void;
  connectedAddress?: string | null;
}

export interface VerifiedContact {
  name: string;
  role: string;
  address: `0x${string}`;
  category: 'student' | 'funder' | 'auditor' | 'hackathon' | 'user';
  avatar: string;
  description: string;
}

export const TEST_ADDRESS_BOOK: VerifiedContact[] = [
  {
    name: 'Student / Builder Test Account',
    role: 'Full-Stack & Smart Contract Builder',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    category: 'student',
    avatar: '👩‍💻',
    description: 'Standard Hardhat/Anvil student account #2 for testing milestone receipts',
  },
  {
    name: 'Hackathon Grand Prize Finalist',
    role: 'Monad dApp Developer',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    category: 'hackathon',
    avatar: '🏆',
    description: 'Verified builder wallet for hackathon bounties and grant awards',
  },
  {
    name: 'Auditor & Multisig Judge Council',
    role: 'Independent Verification Authority',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    category: 'auditor',
    avatar: '⚖️',
    description: 'Third-party auditor address for multi-party escrow release triggers',
  },
  {
    name: 'Ecosystem Grant & Mentor Account',
    role: 'Angel Investor / Professor',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    category: 'funder',
    avatar: '🎓',
    description: 'Standard test deployer #1 funding educational incentives',
  },
  {
    name: 'Monad Community DAO Treasury',
    role: 'Protocol Treasury',
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    category: 'funder',
    avatar: '🏛️',
    description: 'Community pool funding public goods and open source bounties',
  },
];

export const AddressBookModal: React.FC<AddressBookModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  connectedAddress,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  const handleChoose = (address: string, label: string) => {
    onSelectAddress(address, label);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-[#000000] border-2 border-[#cf0f47] shadow-[0_0_50px_rgba(207,15,71,0.35)] p-6 sm:p-7 text-white my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#cf0f47]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#cf0f47]/20 border border-[#ff0b55]/40 flex items-center justify-center text-[#ffdede]">
              <BookUser className="w-5 h-5 text-[#ff0b55]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                EVM Address Book & Test Wallets
              </h3>
              <p className="text-[11px] text-zinc-400">
                Select a verified EVM recipient address or test account for fast testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#120208] hover:bg-[#250410] text-zinc-400 hover:text-white border border-[#cf0f47]/30 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Self-Gift Option if Connected */}
        {connectedAddress && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#120208] border border-[#ff0b55]/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#cf0f47]/30 flex items-center justify-center text-[#ffdede]">
                <Wallet className="w-4 h-4 text-[#ff0b55]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Your Connected Wallet (Self-Gift / Milestone Test)</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ff0b55]/20 text-[#ffdede] text-[9px] font-mono font-bold">You</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">{connectedAddress}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleChoose(connectedAddress, 'Connected Wallet')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] text-white text-xs font-bold uppercase tracking-tight shadow hover:brightness-110 cursor-pointer transition shrink-0"
            >
              Use This
            </button>
          </div>
        )}

        {/* Address List */}
        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {TEST_ADDRESS_BOOK.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#120208] hover:bg-[#1c030c] border border-[#cf0f47]/30 hover:border-[#ff0b55] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.avatar}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-black text-[#ffdede] text-[9px] font-mono font-bold border border-[#cf0f47]/30 uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5 break-all">
                    {item.address}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(item.address)}
                  className="p-2 rounded-xl bg-black hover:bg-zinc-900 border border-[#cf0f47]/30 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Copy 0x Address"
                >
                  {copiedAddress === item.address ? <Check className="w-3.5 h-3.5 text-[#ffdede]" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleChoose(item.address, item.name)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#cf0f47] to-[#ff0b55] text-white text-xs font-bold uppercase tracking-tight shadow hover:brightness-110 cursor-pointer transition flex items-center gap-1"
                >
                  <span>Insert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
