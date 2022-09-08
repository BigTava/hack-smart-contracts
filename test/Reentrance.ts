import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe.only("Reentrance", function () {
  async function deployReentrance() {
    const [owner, donor, otherAccount, attacker] = await ethers.getSigners();
    const donation = 1000000000000000;
    const Reentrance = await ethers.getContractFactory("Reentrance");
    const reentrance = await Reentrance.deploy();
    await reentrance
      .connect(donor)
      .donate(otherAccount.address, { value: donation });

    return { reentrance, donation, otherAccount, attacker };
  }

  describe("Deployment", function () {
    it("The contract should have the right donation amount", async function () {
      const { reentrance, donation, otherAccount, attacker } =
        await loadFixture(deployReentrance);

      expect(await reentrance.balanceOf(otherAccount.address)).to.equal(
        donation
      );
    });

    it("Should receive and store the funds to lock", async function () {
      const { reentrance, donation } = await loadFixture(deployReentrance);

      expect(await ethers.provider.getBalance(reentrance.address)).to.equal(
        donation
      );
    });
  });

  describe("Withdraw funds", function () {
    async function deployReentranceAttack() {
      const { reentrance, donation, otherAccount, attacker } =
        await loadFixture(deployReentrance);

      const ReentranceAttack = await ethers.getContractFactory(
        "ReentranceAttack"
      );
      const reentranceAttack = await ReentranceAttack.connect(attacker).deploy(
        reentrance.address
      );

      await reentranceAttack
        .connect(attacker)
        .donateAndWithdraw({ value: donation });

      return { reentrance, donation, otherAccount, attacker, reentranceAttack };
    }

    describe("Deployment", function () {
      it("Attacker should be the owner", async function () {
        const { attacker, reentranceAttack } = await loadFixture(
          deployReentranceAttack
        );

        expect(await reentranceAttack.owner()).to.equal(attacker.address);
      });

      it("Should withdraw funds recursively until balance of Reentrance is reduced to 0", async function () {
        const { donation, reentranceAttack } = await loadFixture(
          deployReentranceAttack
        );

        expect(
          await ethers.provider.getBalance(reentranceAttack.address)
        ).to.equal(donation);
      });

      it("Atacker should be able to retrieve funds", async function () {
        const {
          reentrance,
          donation,
          otherAccount,
          attacker,
          reentranceAttack,
        } = await loadFixture(deployReentranceAttack);

        await expect(
          reentranceAttack.connect(attacker).withdrawAll()
        ).to.changeEtherBalances(
          [attacker, reentranceAttack],
          [donation, -donation]
        );
        expect(
          await reentrance.connect(otherAccount).balanceOf(otherAccount.address)
        ).to.equal(donation);
      });
    });
  });
});
