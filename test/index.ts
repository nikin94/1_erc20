import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { MyERC20 } from "../typechain";

let myERC20: MyERC20;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;

beforeEach(async function () {
  [owner, addr1, addr2] = await ethers.getSigners();

  const MyERC20 = await ethers.getContractFactory("MyERC20");
  myERC20 = await MyERC20.deploy();
  await myERC20.deployed();
});

describe("MyERC20", function () {
  it("Should return total supply", async function () {
    expect(await myERC20.totalSupply()).to.equal("1000000000000000000");
  });

  it("Should check balance", async function () {
    expect(await myERC20.balanceOf(owner.address)).to.equal(
      "1000000000000000000"
    );
  });

  it("Should approve and allow", async function () {
    await myERC20.approve(addr1.address, 100);
    expect(await myERC20.allowance(owner.address, addr1.address)).to.equal(100);
  });

  it("Should transfer tokens", async function () {
    await myERC20.transfer(addr1.address, 100);
    expect(await myERC20.balanceOf(owner.address)).to.deep.equal(
      BigNumber.from(1000000000000000000 - 100 + "")
    );
    expect(await myERC20.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should fail to transfer if not enough tokens", async function () {
    await expect(
      myERC20.connect(addr1).transfer(addr2.address, 150)
    ).to.be.revertedWith("not enough tokens");
  });

  it("Should allow to transfer tokens from one account to another", async function () {
    await myERC20.transfer(addr1.address, 70);
    await myERC20.connect(addr1).approve(addr2.address, 50);
    await myERC20.transferFrom(addr1.address, addr2.address, 50);
    expect(await myERC20.balanceOf(addr2.address)).to.equal(50);
    expect(await myERC20.balanceOf(addr1.address)).to.equal(20);
  });

  it("Should fail to transfer from one account to another if not enough tokens", async function () {
    await myERC20.transfer(addr1.address, 70);
    await myERC20.connect(addr1).approve(addr2.address, 50);
    await expect(
      myERC20.transferFrom(addr1.address, addr2.address, 150)
    ).to.be.revertedWith("not enough tokens");
  });

  it("Should fail to transfer from one account to another if not allowed to send this much tokens", async function () {
    await myERC20.transfer(addr1.address, 70);
    await myERC20.connect(addr1).approve(addr2.address, 50);
    await expect(
      myERC20.transferFrom(addr1.address, addr2.address, 60)
    ).to.be.revertedWith("not allowed to send this much");
  });

  it("Should mint tokens", async function () {
    await myERC20.mint(addr1.address, 100);
    expect(await myERC20.balanceOf(addr1.address)).to.equal("100");
  });

  it("Should fail to mint tokens if not owner", async function () {
    await expect(
      myERC20.connect(addr1).mint(addr1.address, 100)
    ).to.be.revertedWith("Must be the owner");
  });

  it("Should burn tokens", async function () {
    await myERC20.mint(addr1.address, 100);
    await myERC20.burn(addr1.address, 20);
    expect(await myERC20.balanceOf(addr1.address)).to.equal("80");
  });

  it("Should fail to burn if not enough tokens", async function () {
    await myERC20.mint(addr1.address, 100);
    await expect(myERC20.burn(addr1.address, 120)).to.be.revertedWith(
      "not enough tokens on balance"
    );
  });

  it("Should fail to burn if not owner", async function () {
    await expect(
      myERC20.connect(addr1).burn(addr1.address, 100)
    ).to.be.revertedWith("Must be the owner");
  });
});
