require('dotenv').config();
const Web3 = require('web3');
const BSC_WEB3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const POLYGON_WEB3 = new Web3('https://rpc-mumbai.maticvigil.com');

const TOKEN_ABI = [
  
];

const BSC_TOKEN_ADDRESS = "BSC_DEPLOYED_TOKEN_ADDRESS";
const POLYGON_TOKEN_ADDRESS = "POLYGON_DEPLOYED_TOKEN_ADDRESS";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BRIDGE_CONTRACT_ADDRESS = "BRIDGE_CONTRACT_ADDRESS";  

async function transferTokensAcrossChains() {
  const account = BSC_WEB3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  BSC_WEB3.eth.accounts.wallet.add(account);

  const tokenContract = new BSC_WEB3.eth.Contract(TOKEN_ABI, BSC_TOKEN_ADDRESS);

  const amountToTransfer = BSC_WEB3.utils.toWei("10", "ether"); 

  const tx = tokenContract.methods.transfer(BRIDGE_CONTRACT_ADDRESS, amountToTransfer);
  const gas = await tx.estimateGas({ from: account.address });
  const gasPrice = await BSC_WEB3.eth.getGasPrice();

  const data = tx.encodeABI();
  const txData = {
    from: account.address,
    to: BSC_TOKEN_ADDRESS,
    data,
    gas,
    gasPrice,
  };

  const receipt = await BSC_WEB3.eth.sendTransaction(txData);
  console.log("Transfer receipt:", receipt);
}

transferTokensAcrossChains()
  .then(() => console.log("Tokens transferred through bridge"))
  .catch(console.error);
