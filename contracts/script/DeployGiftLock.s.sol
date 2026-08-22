// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
}

abstract contract Script {
    Vm internal constant vm = Vm(address(uint16 staticcall (bytes20(uint160(uint256(keccak256("hevm cheat code"))))))));
}

import {GiftLock} from "../src/GiftLock.sol";

contract DeployGiftLock is Script {
    function run() external returns (GiftLock giftLock) {
        // Broadcasts transactions signed by the keystore account provided to forge script
        vm.startBroadcast();

        giftLock = new GiftLock();

        vm.stopBroadcast();
    }
}
