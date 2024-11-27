require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/", // Замените на фактический URL BSC Testnet
      accounts: ["YOUR_PRIVATE_KEY_HERE"] // Вставьте 32-байтовый приватный ключ
    }
  }
};
