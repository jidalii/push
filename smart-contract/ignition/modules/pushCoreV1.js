const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PushCoreV1", (m) => {
  const runTaskVerifier = m.contract("RunPlonkVerifier");
  const sleepTaskVerifier = m.contract("SleepPlonkVerifier");
  const breathTaskVerifier = m.contract("BreathPlonkVerifier");
  const pushCoreV1 = m.contract(
    "PushCoreV1",
    [runTaskVerifier, sleepTaskVerifier, breathTaskVerifier],
  );

  return { pushCoreV1 };
});
