import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Elevator } from "../typechain-types/Elevator/Elevator.sol";
import { Building } from "../typechain-types/Elevator/Building.sol:Building";

describe.only("Elevator", function () {
  let attacker: SignerWithAddress;
  let owner: SignerWithAddress;
  let elevator: Elevator;
  let building: Building;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const ElevatorFactory = await ethers.getContractFactory("Elevator");
    elevator = await ElevatorFactory.connect(owner).deploy();

    const BuildingFactory = await ethers.getContractFactory(
      "contracts/Elevator/Building.sol:Building"
    );
    building = await BuildingFactory.connect(attacker).deploy(elevator.address);
  });

  describe("Deployment", function () {
    it("Should set Top to false and floor to 0", async function () {
      expect(await elevator.connect(owner).top()).to.equal(false);
      expect(await elevator.connect(owner).floor()).to.equal(0);
    });
  });

  describe("Reach building top", function () {
    it("Should set Top to true", async function () {
      await building.connect(attacker).goToTop();
      expect(await elevator.connect(attacker).top()).to.equal(true);
    });
  });
});
