import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { NaughtCoin } from "../typechain-types/NaughtCoin";

describe.only("NaughtCoin", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let naughtCoin: NaughtCoin;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const NaughtCoinFactory = await ethers.getContractFactory("NaughtCoin");
    naughtCoin = await NaughtCoinFactory.connect(attacker).deploy(
      attacker.address
    );
  });

  describe("Deployment", function () {
    it("Should set initial supply", async function () {
      expect(await naughtCoin.INITIAL_SUPPLY()).to.be.greaterThan(0);
    });

    it("Should set time lock", async function () {
      expect(await naughtCoin.timeLock()).to.be.greaterThan(0);
    });

    it("Should mint tokens and transfer to player's address", async function () {
      expect(await naughtCoin.balanceOf(attacker.address)).to.equal(
        await naughtCoin.INITIAL_SUPPLY()
      );
    });

    it("Should not be able to transfer tokens", async function () {
      expect(naughtCoin.transfer(owner.address, 1000)).to.be
        .revertedWithoutReason;
    });
  });

  describe("Transfer tokens to another address", function () {
    it("Transfer to another address", async function () {
      await naughtCoin.approve(attacker.address, 100);
      await naughtCoin.transferFrom(attacker.address, owner.address, 100);
      expect(await naughtCoin.balanceOf(owner.address)).to.equal(100);
    });
  });
});
