const { CircomJS } = require("@zefi/circomjs");
const fs = require('fs');

const main = async () => {
  // await compileCircuits();
  await generateRunningProof();
};



async function compileCircuits() {
  const circomjs = new CircomJS();

  try {
    // Specify the path to the circuit file directly in the compile function
    const circuit = await circomjs.getCircuit("running");
    await circuit.compile();
    console.log("Circuit compiled successfully.");
  } catch (error) {
    console.error("Error compiling the circuit:", error.message);
    console.error("Detailed stack trace:", error.stack);
  } finally {
    process.exit(0);
  }
}

async function generateRunningProof() {
  const circomjs = new CircomJS();
  const circuit = circomjs.getCircuit("running");

  // important to await compilation, before running circuit.genProof()
  await circuit.compile();

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
    minHeartRate: "140",
  };

  const proof = await circuit.genProof(input);
  console.log(proof);
  const jsonProof = JSON.stringify(proof, null, 2); // Pretty print the JSON

  // Write the JSON string to a file
  fs.writeFileSync('proof.json', jsonProof);
  console.log(
    "proof verification result ----->",
    await circuit.verifyProof(proof)
  );
  process.exit(0);
}

main();
