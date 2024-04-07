require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_URL_KEY, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: API_URL_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
