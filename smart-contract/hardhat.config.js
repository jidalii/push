require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: true,
      optimizer: {
       enabled: true,
       runs: 200,
       details: {
        yulDetails: {
           optimizerSteps: "u",
        },
       },
      },
     },
    },
};
