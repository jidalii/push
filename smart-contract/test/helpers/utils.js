const { ethers } = require("hardhat");

async function deployPushV1Core() {
  const [owner, user1, user2, user3] = await ethers.getSigners();
  // console.log("signer: ", owner.address);

  // deploy run task verifier
  const runTaskVerifierAddress = await deployTaskVerifier("Run");
  // console.log(`runTaskVerifier address: ${runTaskVerifierAddress}`);

  // deploy sleep task verifier
  const sleepTaskVerifierAddress = await deployTaskVerifier("Sleep");
  // console.log(`sleepTaskVerifier address: ${sleepTaskVerifierAddress}`);

  // deploy breath task verifier
  const breathTaskVerifierAddress = await deployTaskVerifier("Breath");
  // console.log(`breathTaskVerifier address: ${breathTaskVerifierAddress}`);

  const PushCoreV1 = await ethers.getContractFactory("PushCoreV1");
  const pushCoreV1 = await PushCoreV1.deploy(
    runTaskVerifierAddress,
    sleepTaskVerifierAddress,
    breathTaskVerifierAddress
  );

  return { pushCoreV1, owner, user1 };
}


function verifyTaskFromSmartContract(taskReceived, owner, targetTask) {
  expect(taskReceived[1]).to.equal(owner.address);
  expect(taskReceived[2]).to.equal(targetTask.beneficiary);
  expect(BigInt(taskReceived[3])).to.equal(BigInt(targetTask.activity));
  expect(BigInt(taskReceived[4])).to.equal(targetTask.numTimes);
  expect(BigInt(taskReceived[5])).to.equal(targetTask.totalTimes);
  expect(BigInt(taskReceived[6])).to.equal(targetTask.condition1);
  expect(BigInt(taskReceived[7])).to.equal(targetTask.condition2);
  expect(taskReceived[8].toString()).to.equal(targetTask.reward.toString());
  expect(BigInt(taskReceived[9])).to.equal(targetTask.startTime);
  expect(BigInt(taskReceived[10])).to.equal(targetTask.endTime);
}

async function deployTaskVerifier(activity) {
  const contractName = `${activity}PlonkVerifier`;
  const TaskVerifier = await ethers.getContractFactory(contractName);
  const taskVerifier = await TaskVerifier.deploy();

  await taskVerifier.waitForDeployment();

  return taskVerifier.target;
}

module.exports = {
  deployPushV1Core,
  deployTaskVerifier,
  verifyTaskFromSmartContract,
};
