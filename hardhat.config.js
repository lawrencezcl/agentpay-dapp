require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const CRONOS_TESTNET_RPC = "https://cronos-testnet.crypto.org:8545";
const CRONOS_MAINNET_RPC = "https://cronos.crypto.org:8545";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    cronosTestnet: {
      url: CRONOS_TESTNET_RPC,
      chainId: 338,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000, // 5 gwei
    },
    cronosMainnet: {
      url: CRONOS_MAINNET_RPC,
      chainId: 25,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5000000000, // 5 gwei
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      cronosTestnet: process.env.CRONOSSCAN_API_KEY || "",
      cronos: process.env.CRONOSSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};