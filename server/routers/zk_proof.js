require("dotenv").config({ path: "../env" });
const express = require("express");
const snarkjs = require("snarkjs");
const fs = require("fs");

const router = express.Router();

router.post("/gen/running", async (req, res) => {
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

    const vKey = JSON.parse(
      fs.readFileSync("./circom2contract/running/verification_key.json")
    );
    const result = await snarkjs.plonk.verify(vKey, publicSignals, proof);
    console.log("Verification: ", result);

    const calldataBlob = await snarkjs.plonk.exportSolidityCallData(
      proof,
      publicSignals
    );
    const calldata = calldataBlob.split("][");

    let proofHex = JSON.parse(calldata[0] + "]");
    let signalsHex = JSON.parse("[" + calldata[1]);

    res.send({
      proof: proof,
      proofHex: proofHex,
      publicSignals: publicSignals,
      publicSignalsHex: signalsHex,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/gen/sleeping", async (req, res) => {
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

    const vKey = JSON.parse(
      fs.readFileSync("./circom2contract/sleeping/verification_key.json")
    );
    const result = await snarkjs.plonk.verify(vKey, publicSignals, proof);
    console.log("Verification: ", result);

    const calldataBlob = await snarkjs.plonk.exportSolidityCallData(
      proof,
      publicSignals
    );
    const calldata = calldataBlob.split("][");

    let proofHex = JSON.parse(calldata[0] + "]");
    let signalsHex = JSON.parse("[" + calldata[1]);

    res.send({
      proof: proof,
      proofHex: proofHex,
      publicSignals: publicSignals,
      publicSignalsHex: signalsHex,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
