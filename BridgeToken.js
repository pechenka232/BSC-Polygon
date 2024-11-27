require("dotenv").config();
const Web3 = require("web3");

const bscWeb3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const polygonWeb3 = new Web3("https://rpc-mumbai.maticvigil.com");

const CrossChainTokenABI = require("./build/contracts/CrossChainToken.json").abi;
const BridgeContractABI = require("./build/contracts/BridgeContract.json").abi;

const bscPrivateKey = process.env.PRIVATE_KEY;
const polygonPrivateKey = process.env.PRIVATE_KEY;

// BSC addresses
const bscTokenAddress = "адрес_контракта_на_BSC";
const bscBridgeAddress = "адрес_моста_на_BSC";

// Polygon addresses
const polygonBridgeAddress = "адрес_моста_на_Polygon";

async function bridgeTokens(amount) {
  const account = bscWeb3.eth.accounts.privateKeyToAccount(bscPrivateKey);
  bscWeb3.eth.accounts.wallet.add(account);

  const bscBridgeContract = new bscWeb3.eth.Contract(BridgeContractABI, bscBridgeAddress);

  // Lock tokens on BSC
  const tx = bscBridgeContract.methods.lockTokens(amount);
  const gas = await tx.estimateGas({ from: account.address });
  const data = tx.encodeABI();
  const nonce = await bscWeb3.eth.getTransactionCount(account.address);

  const txData = {
    from: account.address,
    to: bscBridgeAddress,
    data,
    gas,
    nonce,
    chainId: 97 // BSC Testnet
  };

  const signedTx = await bscWeb3.eth.accounts.signTransaction(txData, bscPrivateKey);
  await bscWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Locked ${amount} tokens on BSC`);

  // Unlock tokens on Polygon
  const polygonAccount = polygonWeb3.eth.accounts.privateKeyToAccount(polygonPrivateKey);
  polygonWeb3.eth.accounts.wallet.add(polygonAccount);

  const polygonBridgeContract = new polygonWeb3.eth.Contract(BridgeContractABI, polygonBridgeAddress);

  const unlockTx = polygonBridgeContract.methods.unlockTokens(account.address, amount);
  const unlockGas = await unlockTx.estimateGas({ from: polygonAccount.address });
  const unlockData = unlockTx.encodeABI();
  const unlockNonce = await polygonWeb3.eth.getTransactionCount(polygonAccount.address);

  const unlockTxData = {
    from: polygonAccount.address,
    to: polygonBridgeAddress,
    data: unlockData,
    gas: unlockGas,
    nonce: unlockNonce,
    chainId: 80001 // Polygon Mumbai Testnet
  };

  const signedUnlockTx = await polygonWeb3.eth.accounts.signTransaction(unlockTxData, polygonPrivateKey);
  await polygonWeb3.eth.sendSignedTransaction(signedUnlockTx.rawTransaction);

  console.log(`Unlocked ${amount} tokens on Polygon`);
}

bridgeTokens(100);
