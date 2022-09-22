import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { Telephone } from "../typechain-types/Telephone";
import { TelephoneAttack } from "../typechain-types/Telephone/TelephoneAttack";

describe("Telephone", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let telephone: Telephone;
  let telephoneAttack: TelephoneAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const TelephoneFactory = await ethers.getContractFactory("Telephone");
    telephone = await TelephoneFactory.connect(owner).deploy();

    const TelephoneAttackFactory = await ethers.getContractFactory(
      "TelephoneAttack"
    );
    telephoneAttack = await TelephoneAttackFactory.connect(attacker).deploy(
      telephone.address
    );
  });

  describe("Deployment", function () {
    it("Should set the contract owner", async function () {
      expect(await telephone.owner()).to.equal(owner.address);
    });
  });

  describe("Claim ownership of the contract", function () {
    it("Should change the ownership", async function () {
      await telephoneAttack.connect(attacker).changeOwner();
      expect(await telephone.owner()).to.equal(attacker.address);
    });
  });
});
