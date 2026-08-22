// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Test definitions and standard testing library interface
interface Vm {
    function deal(address who, uint256 newBalance) external;
    function prank(address who) external;
    function startPrank(address who) external;
    function stopPrank() external;
    function expectRevert(bytes calldata revertData) external;
    function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData) external;
}

abstract contract Test {
    Vm internal constant vm = Vm(address(uint16 staticcall (bytes20(uint160(uint256(keccak256("hevm cheat code"))))))));
    
    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "assertEq uint256 failed");
    }

    function assertEq(address a, address b) internal pure {
        require(a == b, "assertEq address failed");
    }

    function assertEq(string memory a, string memory b) internal pure {
        require(keccak256(bytes(a)) == keccak256(bytes(b)), "assertEq string failed");
    }

    function assertTrue(bool condition) internal pure {
        require(condition, "assertTrue failed");
    }
}

import {GiftLock} from "../src/GiftLock.sol";

contract GiftLockTest is Test {
    GiftLock public giftLock;

    address public mentor = address(0x1111);
    address public student = address(0x2222);
    address public judge = address(0x3333);
    address public stranger = address(0x9999);

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

    function setUp() public {
        giftLock = new GiftLock();
        vm.deal(mentor, 100 ether);
        vm.deal(judge, 10 ether);
        vm.deal(stranger, 10 ether);
    }

    function test_CreateGiftSuccessful() public {
        vm.startPrank(mentor);
        uint256 giftAmount = 5 ether;
        string memory desc = "Build Monad Blitz Demo & Pass Code Review";

        uint256 giftId = giftLock.createGift{value: giftAmount}(student, desc);
        vm.stopPrank();

        assertEq(giftId, 1);
        assertEq(address(giftLock).balance, giftAmount);

        GiftLock.Gift memory gift = giftLock.getGift(giftId);
        assertEq(gift.creator, mentor);
        assertEq(gift.recipient, student);
        assertEq(gift.triggerAuthority, mentor);
        assertEq(gift.amount, giftAmount);
        assertEq(gift.description, desc);
        assertTrue(gift.status == GiftLock.GiftStatus.Locked);
        assertEq(gift.releasedAt, 0);

        (uint256[] memory created, uint256[] memory received, ) = giftLock.getGiftsByAddress(mentor);
        assertEq(created.length, 1);
        assertEq(created[0], 1);

        (, received, ) = giftLock.getGiftsByAddress(student);
        assertEq(received.length, 1);
        assertEq(received[0], 1);
    }

    function test_CreateGiftWithCustomTrigger() public {
        vm.startPrank(mentor);
        uint256 giftAmount = 2.5 ether;
        string memory desc = "Pass Judge Hackathon Criteria";

        uint256 giftId = giftLock.createGift{value: giftAmount}(student, desc, judge);
        vm.stopPrank();

        GiftLock.Gift memory gift = giftLock.getGift(giftId);
        assertEq(gift.creator, mentor);
        assertEq(gift.recipient, student);
        assertEq(gift.triggerAuthority, judge);
    }

    function test_ReleaseGiftSuccessful() public {
        vm.startPrank(mentor);
        uint256 giftAmount = 10 ether;
        uint256 giftId = giftLock.createGift{value: giftAmount}(student, "Deliver Production App", mentor);
        vm.stopPrank();

        uint256 studentBalBefore = student.balance;

        // Mentor triggers release
        vm.prank(mentor);
        giftLock.markMilestoneComplete(giftId);

        // Student immediately received funds in same tx
        assertEq(student.balance, studentBalBefore + giftAmount);
        assertEq(address(giftLock).balance, 0);

        GiftLock.Gift memory gift = giftLock.getGift(giftId);
        assertTrue(gift.status == GiftLock.GiftStatus.Released);
        assertTrue(gift.releasedAt > 0);
    }

    function test_RevertUnauthorizedTrigger() public {
        vm.startPrank(mentor);
        uint256 giftId = giftLock.createGift{value: 1 ether}(student, "Milestone", judge);
        vm.stopPrank();

        // Stranger tries to release -> must revert
        vm.prank(stranger);
        vm.expectRevert();
        giftLock.markMilestoneComplete(giftId);

        // Even creator cannot release if judge was designated
        vm.prank(mentor);
        vm.expectRevert();
        giftLock.markMilestoneComplete(giftId);
    }

    function test_RevertDoubleRelease() public {
        vm.startPrank(mentor);
        uint256 giftId = giftLock.createGift{value: 2 ether}(student, "Milestone", mentor);
        
        // First release succeeds
        giftLock.markMilestoneComplete(giftId);
        
        // Second release must revert
        vm.expectRevert();
        giftLock.markMilestoneComplete(giftId);
        vm.stopPrank();
    }

    function test_RevertZeroAmountOrRecipient() public {
        vm.startPrank(mentor);
        
        // Revert zero amount
        vm.expectRevert(GiftLock.ZeroAmount.selector);
        giftLock.createGift{value: 0}(student, "Empty gift");

        // Revert zero recipient
        vm.expectRevert(GiftLock.ZeroRecipient.selector);
        giftLock.createGift{value: 1 ether}(address(0), "Zero address recipient");

        vm.stopPrank();
    }

    function testFuzz_CreateAndRelease(uint256 amount) public {
        // Bound amount between 1 wei and 50 ether
        amount = (amount % 50 ether) + 1;
        vm.deal(mentor, amount);

        vm.prank(mentor);
        uint256 giftId = giftLock.createGift{value: amount}(student, "Fuzz Milestone", mentor);

        uint256 studentBefore = student.balance;

        vm.prank(mentor);
        giftLock.markMilestoneComplete(giftId);

        assertEq(student.balance, studentBefore + amount);
        assertEq(address(giftLock).balance, 0);
    }
}
