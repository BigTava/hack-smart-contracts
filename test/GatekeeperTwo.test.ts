import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GatekeeperTwo } from "../typechain-types/GatekeeperTwo";
import { GatekeeperTwoAttack } from "../typechain-types/GatekeeperTwo/GatekeeperTwoAttack";

describe("GatekeeperTwo", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let gatekeeperTwo: GatekeeperTwo;
  let gatekeeperTwoAttack: GatekeeperTwoAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const GatekeeperTwoFactory = await ethers.getContractFactory(
      "GatekeeperTwo"
    );
    gatekeeperTwo = await GatekeeperTwoFactory.connect(owner).deploy();

    const GatekeeperTwoAttackFactory = await ethers.getContractFactory(
      "GatekeeperTwoAttack"
    );
    gatekeeperTwoAttack = await GatekeeperTwoAttackFactory.connect(
      attacker
    ).deploy(gatekeeperTwo.address);
  });

  describe("Make it past the gatekeepers and register as an entrant.", function () {
    it("Should enter", async function () {
      expect(await gatekeeperTwo.entrant()).to.equal(attacker.address);
    });
  });
});
