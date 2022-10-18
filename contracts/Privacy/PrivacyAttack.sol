// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PrivacyAttack {
    
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function convertToBytes16 (bytes32 _key) public view returns (bytes16 key) {
        require(msg.sender == owner, "My hack!");
        key = bytes16(_key);
    }
}