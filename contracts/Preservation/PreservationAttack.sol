// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreservationAttack {

  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 
  uint storedTime;
 
  function setTime(uint _timeStamp) public {
    owner = msg.sender;
  }
}