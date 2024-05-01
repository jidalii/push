require("dotenv").config({ path: "../env" });
const express = require("express");
const { ACTIVITIES } = require("../utils/constant");
const crypto = require("crypto");
const { validateRequirementBody } = require("../utils/schema_validator");
const {
  getRandomFloat,
  getRndInteger,
  addDays,
  setRandomTimeWithinRange,
} = require("../utils/helper");

const router = express.Router();

router.post("/sample/:isValid", [validateRequirementBody], async (req, res) => {
  const isValid = req.param.isValid;
  const body = req.body;
  let healthData = {};

  if (body.activity == 2) {
    healthData = generateBreathData(body, isValid);
  } else if (body.activity == 0) {
    healthData = generateRunningData(body, isValid);
  } else if (body.activity == 1) {
    console.log("here");
    healthData = generateSleepData(body, isValid);
  }
  res.send(healthData);
});

function generateSleepData(body, isValid) {
  let healthData = { data: [], zk_data: {} };
  let currentDate = new Date(parseInt(body.startTime, 10));

  let [hour, minute] = body.condition.sleepBefore.split(":").map(Number);
  const sleepLength = body.condition.sleepLength;
  const endTime = new Date(parseInt(body.endTime, 10));
  console.log(currentDate);
  console.log(endTime);

  for (let i = 0; i < body.numTimes && currentDate <= endTime; i++) {
    currentDate = addDays(currentDate, 1); // Helper to move to the next day
    currentDate = setRandomTimeWithinRange(
      currentDate,
      21,
      Math.min(23, hour),
      0,
      Math.max(59, minute)
    );

    let inBedTime = currentDate;
    let randomSleepLength = getRandomFloat(sleepLength, 12, 2);
    let sleepLengthInMilliseconds = randomSleepLength * 3600 * 1000;
    let endTime = new Date(inBedTime + sleepLengthInMilliseconds);

    let dailyData = {
      inBedTime: inBedTime.getTime(),
      sleepLength: randomSleepLength,
      source: "Apple Watch",
    };
    let hours = inBedTime.getHours(); // Retrieves the hour
    let minutes = inBedTime.getMinutes(); // Retrieves the minutes

    if (i == 0) {
      let zkData = {
        startTime: currentDate.getTime().toString(),
        endTime: endTime.getTime().toString(),
        sleepTime: (hours * 100 + minutes).toString(),
        sleepLength: (randomSleepLength * 100).toString(),
      };
      let signature = signData(zkData)
      healthData.sig = signature
      healthData.zk_data = zkData;
    }
    healthData.data.push(dailyData);
    console.log(
      currentDate.toLocaleString("en-GB", { timeZone: "America/New_York" })
    );
    console.log("---------");
  }

  return healthData;
}

function generateRunningData(body, isValid) {
  let healthData = { data: [], zk_data: {} };
  const startTime = new Date(parseInt(body.startTime, 10));
  const endTime = new Date(parseInt(body.endTime, 10));
  const minPaceKPH = body.condition.minPace;
  const maxPaceKPH = 15;
  const minDistanceKM = body.condition.distance;
  const maxDistanceKM = minDistanceKM + 3;

  let currentDate = new Date(startTime);

  for (let i = 0; i < body.numTimes && currentDate <= endTime; i++) {
    let dailyStartTime = setRandomTimeWithinRange(
      addDays(currentDate, 1),
      8,
      23,
      0,
      59
    );

    // Generate random pace and distance
    let pace = getRandomFloat(minPaceKPH, maxPaceKPH, 2);
    let distance = getRandomFloat(minDistanceKM, maxDistanceKM, 2);
    let durationInHours = distance / pace;
    let durationInMs = durationInHours * 3600000;

    let dailyEndTime = new Date(dailyStartTime.getTime() + durationInMs);

    // ensure endTime does not exceed the end time limit
    if (dailyEndTime > endTime) {
      break;
    }

    const averageHeartRate = getRndInteger(110, 150);
    let dailyData = {
      sampleDetails: {
        workoutType: "Running",
        startTime: dailyStartTime.getTime(),
        endTime: dailyEndTime.getTime(),
        pace: pace,
        duration: durationInHours,
        indoorWorkout: false,
      },
      deviceDetail: {
        name: "Apple Watch",
        manufacturer: "Apple Inc.",
        model: "Watch",
      },
      relatedSamples: {
        distance: distance,
        averageHeartRate: averageHeartRate,
        totalActiveEnergy: 200,
        totalSteps: 4000,
      },
    };
    if (i == 0) {
      let zkData = {
        startTime: dailyStartTime.getTime(),
        endTime: dailyEndTime.getTime(),
        pace: pace * 100,
        distance: distance * 100,
        heartRate: averageHeartRate,
      };
      let signature = signData(zkData)
      healthData.sig = signature
      healthData.zk_data = zkData;

    }

    healthData.data.push(dailyData);
    console.log(
      dailyStartTime.toLocaleString("en-GB", { timeZone: "America/New_York" })
    );
    console.log("---------");
  }

  return healthData;
}

function generateBreathData(body, isValid) {
  let healthData = { data: [] };
  const startTime = new Date(parseInt(body.startTime, 10));
  const endTime = new Date(parseInt(body.endTime, 10));
  const numPerDay = body.condition.numPerDay;

  let currentDate = new Date(startTime);

  for (let i = 0; i < body.numTimes && currentDate <= endTime; i++) {
    console.log(
      currentDate.toLocaleString("en-GB", { timeZone: "America/New_York" })
    );
    let dailyData = [];
    for (let i = 0; i < numPerDay; i++) {
      let breathSessionStart = setRandomTimeWithinRange(
        currentDate,
        8,
        23,
        0,
        59
      );

      let breathSessionEnd = new Date(breathSessionStart.getTime() + 60000);

      dailyData.push({
        startTime: breathSessionStart.getTime(),
        endTime: breathSessionEnd.getTime(),
        source: "Apple Watch",
      });
      console.log(
        breathSessionStart.toLocaleString("en-GB", {
          timeZone: "America/New_York",
        })
      );
    }
    let sessionData = {
      date: currentDate,
      data: dailyData,
    };
    healthData.data.push(sessionData);
    currentDate = addDays(currentDate, 1); // Move to the next day
    console.log("---------");
  }

  return healthData;
}

function signData(data) {
  const dataString = JSON.stringify(data);

  // Generate an ECDSA key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "secp256k1", // Common curve used in Bitcoin and Ethereum
  });

  // Hash the data
  const hash = crypto.createHash("sha256").update(dataString).digest();

  // Sign the hash
  const signature = crypto
    .createSign("sha256")
    .update(hash)
    .sign(privateKey, "hex");

  console.log("Signature:", signature);
  return signature
}
module.exports = router;
