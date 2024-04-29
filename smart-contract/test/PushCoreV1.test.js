// const {
//   loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("PushCoreV1", function () {
//   async function deployContractAndSetupVariable() {
//     const [owner, user1, user2, user3] = await ethers.getSigners();

//     const RunTaskVerifier = await ethers.getContractFactory("RunPlonkVerifier");
//     const runTaskVerifier = await RunTaskVerifier.deploy();

//     const SleepTaskVerifier = await ethers.getContractFactory("SleepPlonkVerifier");
//     const sleepTaskVerifier = await SleepTaskVerifier.deploy();
//     console.log("verifier address:", runTaskVerifier.address, sleepTaskVerifier.address);

//     const PushCoreV1 = await ethers.getContractFactory("PushCoreV1");
//     const pushCoreV1 = await PushCoreV1.deploy(runTaskVerifier.address, sleepTaskVerifier.address);
    
//     return { pushCoreV1, owner, user1, user2, user3 };
//   }
//   describe("Deployment and Connection", function () {
//     it("Deploy: should set the contract owner correctly", async function () {
//       const { pushCoreV1, owner, otherAccount } = await loadFixture(
//         deployContractAndSetupVariable
//       );
//       expect(await pushCoreV1.owner()).to.equal(owner.address);
//     });

//     it('hello(): should return "hello world"', async function () {
//       const { pushCoreV1, owner, otherAccount } = await loadFixture(
//         deployContractAndSetupVariable
//       );
//       expect(await pushCoreV1.hello("hello world")).to.equal("hello world");
//     });
//   });

//   describe("Task", function () {
//     it("postTask: should successfully post task", async function () {
//       const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
//         deployContractAndSetupVariable
//       );
//       let task1 = {
//         beneficiary: user1.address, // assuming `otherAccount` is the intended beneficiary
//         activity: 1, // Example activity type, uint8
//         numTimes: 5, // Example number of times, uint16
//         totalTimes: 5, // Example number of times, uint16
//         condition1: 16, // Total times the task should be done, uint16
//         condition2: 6, // Distance parameter, uint16 (could be meters, for example)
//         reward: ethers.parseEther("1"), // Reward for completing the task, uint256
//         startTime: Math.floor(Date.now() / 1000), // Start time in Unix timestamp, uint256
//         endTime: Math.floor(Date.now() / 1000) + 86400,
//       };

//       const txResponse = await postTaskToSmartContract(pushCoreV1, task1);
//       const txReceipt = await txResponse.wait();
//       // console.log(txReceipt);
//       expect(txResponse)
//         .to.emit(pushCoreV1, "TaskPosted")
//         .withArgs(task1.beneficiary, task1.reward);
//     });

//     it("viewTask: should successully see one task", async function () {
//       const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
//         deployContractAndSetupVariable
//       );
//       let task1 = {
//         beneficiary: user1.address,
//         activity: 1,
//         numTimes: 5,
//         totalTimes: 5,
//         condition1: 10,
//         condition2: 6,
//         reward: ethers.parseEther("1"), // Reward for completing the task, uint256
//         startTime: Math.floor(Date.now() / 1000), // Start time in Unix timestamp, uint256
//         endTime: Math.floor(Date.now() / 1000) + 86400,
//       };

//       const postResponse = await postTaskToSmartContract(pushCoreV1, task1);

//       const tasks = await pushCoreV1.viewTasks(false);

//       verifyTaskFromSmartContract(tasks[0], owner, task1);
//     });
//   });
// });

// async function postTaskToSmartContract(contract, task) {
//   return await contract.postTask(
//     task.beneficiary, // assuming beneficiary is the first parameter expected
//     task.activity,
//     task.numTimes,
//     task.totalTimes,
//     task.condition1,
//     task.condition2,
//     task.reward,
//     task.startTime,
//     task.endTime,
//     { value: ethers.parseEther("1.0") } // Include if the function expects ether to be sent
//   );
// }

// function verifyTaskFromSmartContract(taskReceived, owner, targetTask) {
//   expect(taskReceived[1]).to.equal(owner.address);
//   expect(taskReceived[2]).to.equal(targetTask.beneficiary);
//   expect(BigInt(taskReceived[3])).to.equal(BigInt(targetTask.activity));
//   expect(BigInt(taskReceived[4])).to.equal(targetTask.numTimes);
//   expect(BigInt(taskReceived[5])).to.equal(targetTask.totalTimes);
//   expect(BigInt(taskReceived[6])).to.equal(targetTask.condition1);
//   expect(BigInt(taskReceived[7])).to.equal(targetTask.condition2);
//   expect(taskReceived[8].toString()).to.equal(targetTask.reward.toString());
//   expect(BigInt(taskReceived[9])).to.equal(targetTask.startTime);
//   expect(BigInt(taskReceived[10])).to.equal(targetTask.endTime);
// }
