import { task } from "hardhat/config";

export default task("transfer", "Transfer tokens to account")
  .addParam("contract", "The contract's address")
  .addParam("receiver", "Address of account to transfer to")
  .addParam("amount", "Amount of tokens to send")
  .setAction(async ({ contract, receiver, amount }, hre) => {
    const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
    const myERC20 = await MyERC20.attach(contract);
    const transfer = await myERC20.transfer(receiver, amount);
    console.log(transfer);
  });
