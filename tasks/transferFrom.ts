import { task } from "hardhat/config";

export default task(
  "transferFrom",
  "Transfer tokens from one given account to another"
)
  .addParam("contract", "The contract's address")
  .addParam("sender", "Address of account to transfer from")
  .addParam("receiver", "Address of account to transfer to")
  .addParam("amount", "Amount of tokens to send")
  .setAction(async ({ contract, sender, receiver, amount }, hre) => {
    const MyERC20 = await hre.ethers.getContractFactory("MyERC20");
    const myERC20 = await MyERC20.attach(contract);
    const transferFrom = await myERC20.transferFrom(sender, receiver, amount);
    console.log(transferFrom);
  });
