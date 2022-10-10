import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import web3 from "web3";

import { Token } from "../typechain-types/Token";

describe("Token", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let token: Token;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("Token");
    token = await TokenFactory.connect(owner).deploy(100);
  });

  describe("Deployment", function () {
    it("Should set balance of owner to 100", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(100);
    });

    it("Should set intial supply to 100", async function () {
      expect(await token.totalSupply()).to.equal(100);
    });
  });

  describe("Get additional tokens", function () {
    before(async function () {
      await token.connect(owner).transfer(attacker.address, 20);
    });

    it("Should set balance of attacker to 20", async function () {
      expect(await token.balanceOf(attacker.address)).to.equal(20);
    });

    it("Should get additional tokens for attacker", async function () {
      await token.connect(attacker).transfer(owner.address, 21);
      expect(await token.balanceOf(attacker.address)).to.be.greaterThan(20);
    });
  });
});
