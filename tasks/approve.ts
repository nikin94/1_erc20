import { task } from "hardhat/config";

export default task("approve", "Approve to transfer tokens from account")
  .addParam("contract", "The contract's address")
  .addParam("spender", "Address of account to allow to transfer")
  .addParam("amount", "Amount of tokens to allow")
  .setAction(async ({ contract, spender, amount }, hre) => {
    const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
    const myERC20 = await MyERC20.attach(contract);
    const approve = await myERC20.approve(spender, amount);
    console.log(approve);
  });
