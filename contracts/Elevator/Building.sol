// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElevator {
  function goTo(uint) external;
}

contract Building {

    address public owner;
    IElevator targetContract;
    bool top;

    constructor(address _targetAddr) {
        targetContract = IElevator(_targetAddr);
        owner = msg.sender;
        top = false;
    }

    function goToTop() external {
        require(msg.sender == owner, "my elevator!");
        targetContract.goTo(1);
    }

    function isLastFloor(uint) external returns (bool success) {
        if (top == false) {
            top = true;
            success = false;
        } else if (top == true ) {
            top = false;
            success =  true;
        }
    }
}