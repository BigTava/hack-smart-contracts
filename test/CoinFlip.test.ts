import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { CoinFlip } from "../typechain-types/CoinFlip";
import { CoinFlipAttack } from "../typechain-types/CoinFlip/CoinFlipAttack";

const hre = require("hardhat");
describe("CoinFlip", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let coinFlip: CoinFlip;
  let coinFlipAttack: CoinFlipAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const CoinFlipFactory = await ethers.getContractFactory("CoinFlip");
    coinFlip = await CoinFlipFactory.connect(owner).deploy();

    const CoinFlipAttackFactory = await ethers.getContractFactory(
      "CoinFlipAttack"
    );
    coinFlipAttack = await CoinFlipAttackFactory.connect(attacker).deploy(
      coinFlip.address
    );
  });

  describe("Deployment", function () {
    it("Consective wins should be 0", async function () {
      expect(await coinFlip.consecutiveWins()).to.equal(0);
    });
  });

  describe("Guess the outcome of a coin flip", function () {
    it("Should guess correctly 1 time", async function () {
      await coinFlipAttack.connect(attacker).flip();
      expect(await coinFlip.consecutiveWins()).to.equal(1);
    });

    it("Should guess correctly 10 times", async function () {
      for (let i = 0; i < 9; i++) {
        await hre.network.provider.send("hardhat_mine", ["0x100"]);
        await coinFlipAttack.connect(attacker).flip();
      }

      expect(await coinFlip.consecutiveWins()).to.equal(10);
    });
  });
});
