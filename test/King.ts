import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { King } from "../typechain-types/King";
import { KingAttack } from "../typechain-types/King/KingAttack";

describe("King", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let wannaBeKing: SignerWithAddress;
  let king: King;
  let kingAttack: KingAttack;

  before(async function () {
    [owner, attacker, wannaBeKing] = await ethers.getSigners();

    const KingFactory = await ethers.getContractFactory("King");
    king = await KingFactory.connect(owner).deploy({
      value: web3.utils.toWei("0.01"),
    });

    const KingAttackFactory = await ethers.getContractFactory("KingAttack");
    kingAttack = await KingAttackFactory.connect(attacker).deploy(king.address);
  });

  describe("Deployment", function () {
    it("Owner should own contract", async function () {
      expect(await king.owner()).to.equal(owner.address);
    });

    it("Owner should be the king", async function () {
      expect(await king._king()).to.equal(owner.address);
    });

    it("Prize should be set to 0.01", async function () {
      expect(await king.prize()).to.equal(web3.utils.toWei("0.01"));
    });
  });

  describe("No address should be able to reclaim kingship", function () {
    before(async function () {
      await kingAttack.connect(attacker).sendTransaction({
        value: web3.utils.toWei("2"),
      });
    });

    it("Attacker contract should be the king", async function () {
      expect(await king._king()).to.equal(kingAttack.address);
    });

    it("Prize should be set to 2.00", async function () {
      expect(await king.prize()).to.equal(web3.utils.toWei("2"));
    });

    it("Attacker contract should be king forever", async function () {
      expect(
        wannaBeKing.sendTransaction({
          to: king.address,
          value: web3.utils.toWei("3"),
        })
      ).to.be.revertedWithoutReason;
    });
  });
});
