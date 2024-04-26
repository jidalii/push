const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// console.log("ethers:", ethers);

describe("RunVerifier", function () {
  async function deployContractAndSetupVariable() {
    const [owner, signer1] = await ethers.getSigners();

    // Deploy the Pairing library first
    const PairingLib = await ethers.getContractFactory("Pairing");
    const pairingLib = await PairingLib.deploy();
    console.log("Pairing library address: ", pairingLib.address);

    // Link the Pairing library to the RunVerifier contract
    const RunVerifier = await ethers.getContractFactory("RunVerifier", {
    //   libraries: {
    //     Pairing: pairingLib.address,
    //   },
    });

    // Deploy the RunVerifier with the linked Pairing library
    const runVerifier = await RunVerifier.deploy();

    return { runVerifier, owner, signer1 };
  }

  it("Should verify the proof", async function () {
    const { runVerifier, owner, signer1 } = await loadFixture(
      deployContractAndSetupVariable
    );
    console.log(runVerifier);
    console.log(runVerifier.address);
    const proof = {
      proof: {
        pi_a: [
          "16465543265620006719946720830701254878052426600742064328069405766666031508640",
          "6586571204985970766763377731004080670792016097777794457887585099358139549397",
          "1",
        ],
        pi_b: [
          [
            "12374692966830844137858094888260773194847038336682694473973481090285102775405",
            "1886794497263110619332307166272230014445724619148146568529681555288540330617",
          ],
          [
            "14713737186577042079385310149357715163522518285956341971323483116345156460406",
            "6132731199132306384222109218337377928120145592396499016134393227410093508002",
          ],
          ["1", "0"],
        ],
        pi_c: [
          "13009885692691485218197528397174219795982666310954017742483986221478563932740",
          "7428928368247226727376956122367162517796277652997629760833507964109588491019",
          "1",
        ],
        protocol: "groth16",
        curve: "bn128",
      },
      publicSignals: ["1606812600", "1606825200", "6", "10", "140"],
    };
    const abc = convertProof(proof.proof);
    const input = convertPublicSignals(proof.publicSignals);
    const a = abc.A;
    const b = abc.B;
    const c = abc.C;
    // console.log(a);
    // console.log(b);
    // console.log(c);
    // console.log(input);

    try {
      const result = await runVerifier.verifyProof(a, b, c, input, {
        gasLimit: 10000000000n,
      });
      console.log("Verification result:", result);
      expect(result).to.be.true;
    } catch (error) {
      console.error("Failed with error:", error);
      expect.fail("The proof verification failed with an error.");
    }
  });
});

function convertProof(proof) {
  return {
    A: convertG1Point(proof.pi_a),
    B: convertG2Point(proof.pi_b),
    C: convertG1Point(proof.pi_c),
  };
}

function convertG1Point(point) {
  return [BigInt(point[0]), BigInt(point[1])];
}

function convertG2Point(points) {
  return [
    [BigInt(points[0][0]), BigInt(points[0][1])],
    [BigInt(points[1][0]), BigInt(points[1][1])],
  ];
}

function convertPublicSignals(publicSignals) {
  // Ensure the input length is exactly 5 as expected by the smart contract.
  if (publicSignals.length !== 5) {
    throw new Error(
      "Invalid public signals length, expected exactly 5 values."
    );
  }
  return publicSignals.map((signal) => BigInt(signal));
}
