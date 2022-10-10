import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { Force } from "../typechain-types/Force";
import { ForceAttack } from "../typechain-types/Force/ForceAttack";

describe("Force", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let force: Force;
  let forceAttack: ForceAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const ForceFactory = await ethers.getContractFactory("Force");
    force = await ForceFactory.connect(owner).deploy();

    const ForceAttackFactory = await ethers.getContractFactory("ForceAttack");
    forceAttack = await ForceAttackFactory.connect(attacker).deploy(
      force.address
    );
  });

  describe("Deployment", function () {
    it("Contract balance should be 0", async function () {
      expect(await ethers.provider.getBalance(force.address)).to.equal(0);
    });
  });

  describe("Send Eth to contract", function () {
    it("Should send some ether to attack contract", async function () {
      await forceAttack
        .connect(attacker)
        .collect({ value: web3.utils.toWei("1") });
      expect(await ethers.provider.getBalance(forceAttack.address)).to.equal(
        web3.utils.toWei("1")
      );
    });

    it("Should make the balance of the contract greater than zero", async function () {
      await forceAttack.connect(attacker).selfDestroy();
      expect(await ethers.provider.getBalance(force.address)).to.be.greaterThan(
        0
      );
    });
  });
});
