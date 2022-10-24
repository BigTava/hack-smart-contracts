import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GatekeeperOne } from "../typechain-types/GatekeeperOne";
import { GatekeeperOneAttack } from "../typechain-types/GatekeeperOne/GatekeeperOneAttack";

describe("GatekeeperOne", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let gatekeeperOne: GatekeeperOne;
  let gatekeeperOneAttack: GatekeeperOneAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const GatekeeperOneFactory = await ethers.getContractFactory(
      "GatekeeperOne"
    );
    gatekeeperOne = await GatekeeperOneFactory.connect(owner).deploy();

    const GatekeeperOneAttackFactory = await ethers.getContractFactory(
      "GatekeeperOneAttack"
    );
    gatekeeperOneAttack = await GatekeeperOneAttackFactory.connect(
      attacker
    ).deploy(gatekeeperOne.address);
  });

  describe("Make it past the gatekeeper and register as an entrant.", function () {
    it("Should enter", async function () {
      const [lowerGasBrute, upperGasBrute] = [700, 800];
      const success = await gatekeeperOneAttack.enterGate(
        lowerGasBrute,
        upperGasBrute
      );
      const receipt = await success.wait();

      if (receipt.status === 0) {
        expect(success).to.equal(true);
      }
    });
  });
});
