require("dotenv").config({ path: "../env" });
const express = require("express");
const { ACTIVITIES } = require("../utils/constant");
const { validateRequirementBody } = require("../utils/schema_validator");
const { getRandomFloat, getRndInteger } = require("../utils/helper");

const router = express.Router();

router.get("/sample/:isValid", [validateRequirementBody], async (req, res) => {
  const isValid = req.param.isValid;
  const body = req.body;
  console.log(isValid);
  let healthData = {};

  if (body.activity == ACTIVITIES.MINDFULNESS) {
    pass;
  } else if (body.activity == ACTIVITIES.OUTDOOR_RUN) {
    healthData = generateRunningData(body, isValid);
  } else if (body.activity == ACTIVITIES.SLEEP) {
    healthData = generateSleepData(body, isValid);
  }
  res.send(healthData);
});

function generateSleepData(body, isValid) {
  // init return var
  let healthData = {};
  healthData["data"] = [];

  // creteria for generating sleep data
  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const [sleepHour, sleepMin] = body.condition.sleepBefore.split(":");
  const sleepLength = body.condition.sleepLength;

  let currentDate = new Date(startTime);
  let cnt = 0;
  while (currentDate <= endTime && cnt < body.numTimes) {
    // move to the next day initially
    currentDate.setDate(currentDate.getDate() + 1);

    // reset the time to midday before setting the random time
    currentDate.setHours(0, 0, 0, 0);

    // calculate an appropriate time within the day
    let hour = getRndInteger(21, Math.min(23, sleepHour));
    let minute = getRndInteger(0, Math.max(59, sleepMin));
    let second = getRndInteger(0, 59);
    let millisecond = getRndInteger(0, 999);

    // set the time, checking to ensure it doesn't overflow to the next day
    currentDate.setHours(hour, minute, second, millisecond);

    console.log(
      currentDate.toLocaleString("en-GB", { timeZone: "America/New_York" })
    );
    console.log("---------");

    let dailyData = {};
    dailyData["inBedTime"] = currentDate.getTime(); // Store timestamp in ISO format
    dailyData["sleepLength"] = getRandomFloat(sleepLength, 12, 2); // Randomly generate sleep length

    healthData["data"].push(dailyData);

    cnt++;
  }
  return healthData;
}

function generateRunningData(body, isValid) {
  // init return var
  let healthData = {};
  healthData["data"] = [];

  // creteria for generating sleep data
  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const minPaceKPH = body.condition.minPace;
  const distanceKM = body.condition.distance;

  let currentDate = new Date(startTime);
  let cnt = 0;
  while (currentDate <= endTime && cnt < body.numTimes) {
    // move to the next day initially
    currentDate.setDate(currentDate.getDate() + 1);

    // reset the time to midday before setting the random time
    currentDate.setHours(0, 0, 0, 0);

    let dailyData = {};
    dailyData["pace"] = getRandomFloat(minPaceKPH, 18, 2);
    dailyData["distance"] = getRandomFloat(distanceKM, distanceKM + 3, 2);
    dailyData["duration"] = dailyData["distance"] / dailyData["pace"];

    // calculate an appropriate time within the day
    let hour = getRndInteger(8, 23);
    let minute = getRndInteger(0, 59);
    let second = getRndInteger(0, 59);
    let millisecond = getRndInteger(0, 999);

    // set the time, checking to ensure it doesn't overflow to the next day
    currentDate.setHours(hour, minute, second, millisecond);

    console.log(
      currentDate.toLocaleString("en-GB", { timeZone: "America/New_York" })
    );
    dailyData["startTime"] = currentDate.getTime();
    console.log("---------");

    healthData["data"].push(dailyData);

    cnt++;
  }
  return healthData;
}

module.exports = router;
