# GiftLock Smart Contracts & Deployment on Monad Testnet

## Network Details
- **Network Name**: Monad Testnet
- **Chain ID**: `10143` (`0x279f`)
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Currency Symbol**: `MON`
- **Block Explorer**: [https://testnet.monadvision.com](https://testnet.monadvision.com)
- **Faucet**: [https://faucet.monad.xyz](https://faucet.monad.xyz)

---

## 1. Running Foundry Tests

To run the complete test suite including unit tests and fuzzing:

```bash
forge test -vvv
```

All 6 tests pass:
- `test_CreateGiftSuccessful`
- `test_CreateGiftWithCustomTrigger`
- `test_ReleaseGiftSuccessful` (Atomic instant payout in same tx)
- `test_RevertUnauthorizedTrigger`
- `test_RevertDoubleRelease`
- `test_RevertZeroAmountOrRecipient`
- `testFuzz_CreateAndRelease`

---

## 2. Secure Keystore-Based Deployment (No Plaintext Private Keys)

### Step A: Import your funded deployer private key into an encrypted Cast Keystore
```bash
# You will be prompted to enter your private key securely and choose a password
cast wallet import monadDeployer --interactive
```

### Step B: Verify keystore address & balance on Monad Testnet
```bash
cast wallet address --account monadDeployer
cast balance $(cast wallet address --account monadDeployer) --rpc-url https://testnet-rpc.monad.xyz
```

### Step C: Deploy using `forge script`
```bash
forge script script/DeployGiftLock.s.sol:DeployGiftLock \
  --rpc-url monadTestnet \
  --account monadDeployer \
  --sender $(cast wallet address --account monadDeployer) \
  --broadcast \
  -vvvv
```

### Step D: Confirm on Monad Vision Explorer
Once the broadcast completes in sub-second time, view your contract on Monad Vision:
`https://testnet.monadvision.com/address/<DEPLOYED_CONTRACT_ADDRESS>`
