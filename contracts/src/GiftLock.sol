// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @dev OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)
 * Lightweight inline ReentrancyGuard implementation for standalone compilation and Foundry testing.
 */
abstract contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _status;

    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    modifier nonReentrant() {
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

/**
 * @title GiftLock
 * @author Monad Blitz Hyderabad Hackathon Team
 * @notice Programmable milestone-locked gifts on Monad.
 * Funds are locked in the contract and released automatically the instant
 * the designated trigger authority confirms the milestone is met.
 */
contract GiftLock is ReentrancyGuard {
    enum GiftStatus {
        Locked,
        Released,
        Cancelled
    }

    struct Gift {
        uint256 id;
        address creator;
        address recipient;
        address triggerAuthority;
        uint256 amount;
        string description;
        GiftStatus status;
        uint256 createdAt;
        uint256 releasedAt;
    }

    // Storage
    uint256 public nextGiftId;
    mapping(uint256 => Gift) private _gifts;
    
    // Address index tracking for frontend queries without indexer
    mapping(address => uint256[]) private _createdGifts;
    mapping(address => uint256[]) private _receivedGifts;
    mapping(address => uint256[]) private _triggerGifts;

    // Events
    event GiftCreated(
        uint256 indexed giftId,
        address indexed creator,
        address indexed recipient,
        address triggerAuthority,
        uint256 amount,
        string description
    );

    event GiftReleased(
        uint256 indexed giftId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event GiftCancelled(
        uint256 indexed giftId,
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );

    // Custom Errors for gas efficiency
    error ZeroAmount();
    error ZeroRecipient();
    error GiftNotFound(uint256 giftId);
    error GiftNotLocked(uint256 giftId, GiftStatus status);
    error UnauthorizedTrigger(uint256 giftId, address caller, address expectedTrigger);
    error TransferFailed(address recipient, uint256 amount);

    constructor() {
        nextGiftId = 1; // 1-indexed for clear UX
    }

    /**
     * @notice Locks funds in a new programmable gift.
     * @param recipient The address that receives the funds upon milestone completion.
     * @param description Human-readable description of the milestone condition.
     * @param customTrigger Optional custom trigger authority. If address(0), defaults to msg.sender.
     * @return giftId The newly created unique gift identifier.
     */
    function createGift(
        address recipient,
        string calldata description,
        address customTrigger
    ) external payable returns (uint256 giftId) {
        if (msg.value == 0) revert ZeroAmount();
        if (recipient == address(0)) revert ZeroRecipient();

        giftId = nextGiftId++;
        address trigger = customTrigger == address(0) ? msg.sender : customTrigger;

        _gifts[giftId] = Gift({
            id: giftId,
            creator: msg.sender,
            recipient: recipient,
            triggerAuthority: trigger,
            amount: msg.value,
            description: description,
            status: GiftStatus.Locked,
            createdAt: block.timestamp,
            releasedAt: 0
        });

        _createdGifts[msg.sender].push(giftId);
        _receivedGifts[recipient].push(giftId);
        if (trigger != msg.sender) {
            _triggerGifts[trigger].push(giftId);
        }

        emit GiftCreated(giftId, msg.sender, recipient, trigger, msg.value, description);
    }

    /**
     * @notice Convenience overload defaulting trigger authority to msg.sender.
     */
    function createGift(
        address recipient,
        string calldata description
    ) external payable returns (uint256 giftId) {
        return this.createGift{value: msg.value}(recipient, description, address(0));
    }

    /**
     * @notice Confirms the milestone is met and instantly releases the locked funds to recipient.
     * @dev Only callable by the gift's trigger authority. Atomically transfers funds in the same tx.
     * @param giftId Identifier of the locked gift.
     */
    function markMilestoneComplete(uint256 giftId) external nonReentrant {
        if (giftId == 0 || giftId >= nextGiftId) {
            revert GiftNotFound(giftId);
        }

        Gift storage gift = _gifts[giftId];

        if (gift.status != GiftStatus.Locked) {
            revert GiftNotLocked(giftId, gift.status);
        }

        if (msg.sender != gift.triggerAuthority) {
            revert UnauthorizedTrigger(giftId, msg.sender, gift.triggerAuthority);
        }

        // State update before transfer (Checks-Effects-Interactions)
        gift.status = GiftStatus.Released;
        gift.releasedAt = block.timestamp;

        uint256 payoutAmount = gift.amount;
        address recipient = gift.recipient;

        // Instant direct transfer
        (bool success, ) = payable(recipient).call{value: payoutAmount}("");
        if (!success) {
            revert TransferFailed(recipient, payoutAmount);
        }

        emit GiftReleased(giftId, recipient, payoutAmount, block.timestamp);
    }

    /**
     * @notice Retrieves single gift record by ID.
     */
    function getGift(uint256 giftId) external view returns (Gift memory) {
        if (giftId == 0 || giftId >= nextGiftId) {
            revert GiftNotFound(giftId);
        }
        return _gifts[giftId];
    }

    /**
     * @notice Retrieves all gift IDs associated with an address (as creator, recipient, or trigger).
     */
    function getGiftsByAddress(address account) external view returns (
        uint256[] memory created,
        uint256[] memory received,
        uint256[] memory triggered
    ) {
        return (
            _createdGifts[account],
            _receivedGifts[account],
            _triggerGifts[account]
        );
    }

    /**
     * @notice Returns total number of gifts created.
     */
    function totalGifts() external view returns (uint256) {
        return nextGiftId - 1;
    }

    /**
     * @notice Batch fetch gifts for frontend convenience.
     */
    function getGiftsBatch(uint256[] calldata ids) external view returns (Gift[] memory) {
        Gift[] memory batch = new Gift[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            batch[i] = _gifts[ids[i]];
        }
        return batch;
    }
}
