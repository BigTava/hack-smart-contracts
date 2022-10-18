import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
var web3 = require("web3");
const hre = require("hardhat");

import { Privacy, PrivacyAttack } from "../typechain-types/Privacy";

describe("Privacy", function () {
  let attacker: SignerWithAddress;
  let owner: SignerWithAddress;
  let privacy: Privacy;
  let privacyAttack: PrivacyAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const key_1 = web3.utils.asciiToHex("key_1").padEnd(66, "0");
    const key_2 = web3.utils.asciiToHex("key_2").padEnd(66, "0");
    const key_3 = web3.utils.asciiToHex("key_3").padEnd(66, "0");

    const PrivacyFactory = await ethers.getContractFactory("Privacy");
    privacy = await PrivacyFactory.connect(owner).deploy([key_1, key_2, key_3]);

    const PrivacyAttackFactory = await ethers.getContractFactory(
      "PrivacyAttack"
    );
    privacyAttack = await PrivacyAttackFactory.connect(attacker).deploy();
  });

  describe("Deployment", function () {
    it("Locked is set to true", async function () {
      expect(await privacy.locked()).to.equal(true);
    });
  });

  describe("Unlock Privacy", function () {
    it("Locked is set to false", async function () {
      const _key_3 = await hre.ethers.provider.getStorageAt(privacy.address, 5);
      const b16Key = await privacyAttack
        .connect(attacker)
        .convertToBytes16(_key_3);
      await privacy.unlock(b16Key);
      expect(await privacy.locked()).to.equal(false);
    });
  });
});
