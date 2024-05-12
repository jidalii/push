const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
  verifyTaskFromSmartContract,
  postTaskToSmartContract,
  generateSleepZKProof,
} = require("./helpers/utils");

describe("PushCoreV1", function () {
  const pushCoreV1Module = buildModule("PushCoreV1", (m) => {
    const runTaskVerifier = m.contract("RunPlonkVerifier");
    const sleepTaskVerifier = m.contract("SleepPlonkVerifier");
    const breathTaskVerifier = m.contract("BreathPlonkVerifier");
    const pushCoreV1 = m.contract("PushCoreV1", [
      runTaskVerifier,
      sleepTaskVerifier,
      breathTaskVerifier,
    ]);

    return { pushCoreV1 };
  });
  async function deployPushV1CoreIgnition() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    const { pushCoreV1 } = await ignition.deploy(pushCoreV1Module, {
      defaultSender: owner.address,
    });

    return { pushCoreV1, owner, user1, user2, user3 };
  }
  describe("Deployment and Connection", function () {
    it("Deploy: should set the contract owner correctly", async function () {
      const { pushCoreV1, owner, otherAccount } = await loadFixture(
        deployPushV1CoreIgnition
      );
      expect(await pushCoreV1.owner()).to.equal(owner.address);
    });

    it('hello(): should return "hello world"', async function () {
      const { pushCoreV1, owner, otherAccount } = await loadFixture(
        deployPushV1CoreIgnition
      );
      expect(await pushCoreV1.hello("hello world")).to.equal("hello world");
    });
  });

  describe("PostTask", function () {
    let task1 = {
      beneficiary: "N/A", // assuming `otherAccount` is the intended beneficiary
      activity: 1, // Example activity type, uint8
      numTimes: 5, // Example number of times, uint16
      totalTimes: 5, // Example number of times, uint16
      condition1: 16, // Total times the task should be done, uint16
      condition2: 6, // Distance parameter, uint16 (could be meters, for example)
      reward: ethers.parseEther("1"), // Reward for completing the task, uint256
      startTime: Math.floor(Date.now() / 1000), // Start time in Unix timestamp, uint256
      endTime: Math.floor(Date.now() / 1000) + 86400,
    };

    it("Should successfully post task with event PostTask", async function () {
      const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
        deployPushV1CoreIgnition
      );
      task1.beneficiary = user1;

      const postTaskTx = await postTaskToSmartContract(
        pushCoreV1,
        task1,
        owner,
        "1.0"
      );
      const txReceipt = await postTaskTx.wait();
      await expect(postTaskTx)
        .to.emit(pushCoreV1, "PostTask")
        .withArgs(owner, task1.beneficiary, 0);
    });

    it("Should revert postTask with insufficient amount", async function () {
      const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
        deployPushV1CoreIgnition
      );

      task1.beneficiary = user2;

      await expect(postTaskToSmartContract(pushCoreV1, task1, owner, "0.8")).to
        .be.reverted;
    });

    it("Should increment event index by 1", async function () {
      const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
        deployPushV1CoreIgnition
      );

      // first task
      task1.beneficiary = user1;
      let postTaskTx = await postTaskToSmartContract(
        pushCoreV1,
        task1,
        owner,
        "1.0"
      );
      let txReceipt = await postTaskTx.wait();
      await expect(postTaskTx)
        .to.emit(pushCoreV1, "PostTask")
        .withArgs(owner, task1.beneficiary, 0);

      // second task
      task1.beneficiary = user2;
      postTaskTx = await postTaskToSmartContract(
        pushCoreV1,
        task1,
        owner,
        "1.0"
      );
      txReceipt = await postTaskTx.wait();
      await expect(postTaskTx)
        .to.emit(pushCoreV1, "PostTask")
        .withArgs(owner, task1.beneficiary, 1);
    });
  });

  describe("ViewTask", function () {
    it("viewTask: should successully see one task", async function () {
      const { pushCoreV1, owner, user1 } = await loadFixture(
        deployPushV1CoreIgnition
      );
      let task1 = {
        beneficiary: user1.address,
        activity: 1,
        numTimes: 5,
        totalTimes: 5,
        condition1: 10,
        condition2: 6,
        reward: ethers.parseEther("1"), // Reward for completing the task, uint256
        startTime: Math.floor(Date.now() / 1000), // Start time in Unix timestamp, uint256
        endTime: Math.floor(Date.now() / 1000) + 86400,
      };

      await postTaskToSmartContract(pushCoreV1, task1, owner, "1.0");

      const tasks = await pushCoreV1.viewTasks(false);

      verifyTaskFromSmartContract(tasks[0], owner, task1);
    });
  });

  describe("ClaimTask", function () {
    let task1 = {
      beneficiary: "N/A",
      activity: 1,
      numTimes: 1,
      totalTimes: 1,
      condition1: 2300,
      condition2: 700,
      reward: ethers.parseEther("1"),
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 86400,
    };
    it("Should successfully redeem sleep rewards", async function () {
      const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
        deployPushV1CoreIgnition
      );

      // post task
      submitTask(task1, pushCoreV1, owner, user1, "1.0", 0);

      // redeem task
      const healthData = {
        startTime: task1.startTime + 10,
        endTime: task1.endTime - 100,
        sleepTime: 2200,
        sleepLength: 750,
      };
      const { proofHex, signalsHex } = await generateSleepZKProof(
        task1,
        healthData,
        true
      );
      const claimTaskTx = await pushCoreV1
        .connect(user1)
        .claimReward(0, proofHex, signalsHex);

      const txReceipt = await claimTaskTx.wait();
      await expect(claimTaskTx)
        .to.emit(pushCoreV1, "ClaimReward")
        .withArgs(owner, task1.beneficiary, 0);
    });

    it("Should revert with InvalidClaimer()", async function () {
      const { pushCoreV1, owner, user1, user2, user3 } = await loadFixture(
        deployPushV1CoreIgnition
      );

      // post task
      submitTask(task1, pushCoreV1, owner, user1, "1.0", 0);

      // redeem task
      const healthData = {
        startTime: task1.startTime + 10,
        endTime: task1.endTime - 100,
        sleepTime: 2200,
        sleepLength: 750,
      };

      const { proofHex, signalsHex } = await generateSleepZKProof(
        task1,
        healthData,
        true
      );

      await expect(
        pushCoreV1.connect(user2).claimReward(0, proofHex, signalsHex)
      ).to.be.reverted;
    });
  });
});

async function submitTask(task, contract, sender, beneficiary, value, index) {
  // post task
  task.beneficiary = beneficiary;
  const postTaskTx = await postTaskToSmartContract(
    contract,
    task,
    sender,
    value
  );
  await postTaskTx.wait();
  await expect(postTaskTx)
    .to.emit(contract, "PostTask")
    .withArgs(owner, task.beneficiary, index);
}
