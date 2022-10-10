import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
var web3 = require("web3");
var uuid = require("uuid");
const hre = require("hardhat");

import { Vault } from "../typechain-types/Vault";

describe("Vault", function () {
  let attacker: SignerWithAddress;
  let owner: SignerWithAddress;
  let vault: Vault;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const FalloutFactory = await ethers.getContractFactory("Vault");
    vault = await FalloutFactory.deploy(
      web3.utils.asciiToHex(uuid.v4().substring(1, 5)).padEnd(66, "0")
    );
  });

  describe("Deployment", function () {
    it("Locked is set to true", async function () {
      expect(await vault.locked()).to.equal(true);
    });
  });

  describe("Unlock Vault", function () {
    it("Locked is set to false", async function () {
      const password = await hre.ethers.provider.getStorageAt(vault.address, 1);
      await vault.unlock(password);
      expect(await vault.locked()).to.equal(false);
    });
  });
});
