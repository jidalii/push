require("@nomicfoundation/hardhat-toolbox");
require("hardhat-circom");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    evmVersion: "istanbul",
  },
  circom: {
    // (optional) Base path for input files, defaults to `./circuits/`
    inputBasePath: "./circuits",
    // (required) The final ptau file, relative to inputBasePath, from a Phase 1 ceremony
    ptau: "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau",
    // (required) Each object in this array refers to a separate circuit
    circuits: [{ name: "running" }],
  },
};
