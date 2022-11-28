import { task } from "hardhat/config";

export default task("balance", "Show balance on account")
  .addParam("contract", "The contract's address")
  .addParam("account", "Address of account to transfer to")
  .setAction(async ({ contract, account }, hre) => {
    const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
    const myERC20 = await MyERC20.attach(contract);
    const balanceOf = await myERC20.balanceOf(account);
    console.log(balanceOf);
  });
