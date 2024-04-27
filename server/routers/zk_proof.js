require("dotenv").config({ path: "../env" });
const express = require("express");
const snarkjs = require("snarkjs");
const fs = require("fs");

const router = express.Router();

router.get("/gen/running", async (req, res) => {
  const body = req.body;
  const input = {
    startTime: body.startTime,
    endTime: body.endTime,
    pace: body.pace,
    distance: body.distance,
    heartRate: body.heartRate,
    minStartTime: body.minStartTime,
    maxEndTime: body.maxEndTime,
    minPace: body.minPace,
    minDistance: body.minDistance,
  };
  try {
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      input,
      "./circom2contract/running/running_js/running.wasm",
      "./circom2contract/running/circuit_final.zkey"
    );

    const proofArrObj = reorderDict(proof);

    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(publicSignals);

    console.log("length:", formattedProof.length);

    res.send({
      proof: proof,
      proofHex: formattedProof,
      publicSignals: publicSignals,
      publicSignalsHex: pubSignalHex,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/gen/sleeping", async (req, res) => {
  const body = req.body;
  const input = {
    startTime: body.startTime,
    endTime: body.endTime,
    sleepTime: body.sleepTime,
    sleepLength: body.sleepLength,
    minStartTime: body.minStartTime,
    maxEndTime: body.maxEndTime,
    sleepBefore: body.sleepBefore,
    minSleepLength: body.minSleepLength,
  };
  try {
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      input,
      "./circom2contract/sleeping/sleeping_js/sleeping.wasm",
      "./circom2contract/sleeping/circuit_final.zkey"
    );
    const proofArrObj = reorderDict(proof);

    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(publicSignals);

    console.log("length:", formattedProof.length);

    res.send({
      proof: proof,
      proofHex: formattedProof,
      publicSignals: publicSignals,
      publicSignalsHex: pubSignalHex,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function convertObjectToHexPadded(obj) {
  const hexArray = [];

  // Function to convert a single BigInt number to a padded hex string
  const toPaddedHexString = (bigInt) => {
    return "0x" + bigInt.toString(16).padStart(64, "0");
  };

  // Iterate over each key in the object
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    // Check if the value is an array (handle nested arrays too)
    if (Array.isArray(value)) {
      // Handle nested arrays for points like A, B, C, etc.
      if (Array.isArray(value[0])) {
        value.forEach((innerArray) => {
          innerArray.forEach((number) => {
            hexArray.push(toPaddedHexString(BigInt(number)));
          });
        });
      } else {
        // Handle flat arrays for points like eval_a, eval_b, etc.
        value.forEach((number) => {
          hexArray.push(toPaddedHexString(BigInt(number)));
        });
      }
    } else {
      // Handle single values that are not arrays
      hexArray.push(toPaddedHexString(BigInt(value)));
    }
  }

  return hexArray;
}

function convertProofToHex(proof) {
  // Helper function to convert to a 0x-prefixed hexadecimal string
  const toHex = (numStr) => {
    return "0x" + BigInt(numStr).toString(16);
  };

  // Convert the proof object, excluding the "1"s and non-numeric properties
  let convertedProof = {};
  for (let [key, value] of Object.entries(proof)) {
    if (key !== "protocol" && key !== "curve") {
      if (key.startsWith("eval_")) {
        // Convert single numeric strings directly
        convertedProof[key] = toHex(value);
      } else {
        // Convert arrays, excluding the last element "1"
        convertedProof[key] = value.slice(0, -1).map(toHex);
      }
    }
  }

  return convertedProof;
}

function reorderDict(dict) {
  dictReorder = [
    { key: "A", value: dict["A"] },
    { key: "B", value: dict["B"] },
    { key: "C", value: dict["C"] },
    { key: "Z", value: dict["Z"] },
    { key: "T1", value: dict["T1"] },
    { key: "T2", value: dict["T2"] },
    { key: "T3", value: dict["T3"] },
    { key: "Wxi", value: dict["Wxi"] },
    { key: "Wxiw", value: dict["Wxiw"] },
    { key: "eval_a", value: dict["eval_a"] },
    { key: "eval_b", value: dict["eval_b"] },
    { key: "eval_c", value: dict["eval_c"] },
    { key: "eval_s1", value: dict["eval_s1"] },
    { key: "eval_s2", value: dict["eval_s2"] },
    { key: "eval_zw", value: dict["eval_zw"] },
  ];
  result = {}
  for (let item of dictReorder) {
    result[item.key] = item.value;
  }

  return result;
}

function convertToHexPadded(pubSignals) {
  return pubSignals.map((signal) => {
    // Convert the decimal string to a BigInt
    const bigIntValue = BigInt(signal);

    // Convert BigInt to a hexadecimal string
    let hexValue = bigIntValue.toString(16);

    // Pad the hexadecimal string with leading zeros to ensure 64 characters
    // 64 characters correspond to 32 bytes or 256 bits, which is typical for Ethereum
    const paddedHex = "0x" + hexValue.padStart(64, "0");

    return paddedHex;
  });
}
module.exports = router;
