require("@nomiclabs/hardhat-waffle");

const { mnemonic } = require('./secrets.json');

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    }
  },
  solidity: {
  version: "0.8.7",
  settings: {
    optimizer: {
      enabled: true
    }
  }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};