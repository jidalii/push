const fs = require("fs");
const snarkjs = require("snarkjs");

const main = async () => {
  // await compileCircuits();
  await generateRunningProof();
};

async function generateRunningProof() {
  const input = {
    startTime: "1606814400",
    endTime: "1606821600",
    pace: "7",
    distance: "15",
    heartRate: "150",
    minStartTime: "1606812600",
    maxEndTime: "1606825200",
    minPace: "6",
    minDistance: "10",
  };

  const { proof, publicSignals } = await snarkjs.plonk.fullProve(
    input,
    "./circom2contract/running_js/running.wasm",
    "./circom2contract/circuit_final.zkey"
  );

  console.log("Proof: ");
  console.log(JSON.stringify(proof, null, 1));

  const vKey = JSON.parse(fs.readFileSync("./circom2contract/verification_key.json"));

  const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }
  process.exit(0);
}

main();
