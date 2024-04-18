require("dotenv").config({ path: "../env" });
const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

const router = express.Router();

router.get("/time", async (req, res) => {
  // Get the current date and time
  const now = new Date();

  // Get epoch time for current time in seconds
  const currentEpochTime = Math.floor(now.getTime() / 1000);

  // Calculate epoch time for one week later (7 days)
  const oneWeekLaterEpochTime = currentEpochTime + 7 * 24 * 60 * 60; // 7 days, 24 hours/day, 60 minutes/hour, 60 seconds/minute

  console.log("Current Epoch Time: " + currentEpochTime);
  console.log("Epoch Time One Week Later: " + oneWeekLaterEpochTime);
});

router.post("/single", validateTaskBody, async (req, res) => {
  const body = req.body;
  const task = {
    depositor: body.depositor,
    beneficiary: body.beneficiary,
    hashCondition: body.hashCondition,
    rewards: body.rewards,
    activity: body.activity,
    numTimes: body.numTimes,
    period: body.period,
    condition: body.condition,
    startTime: new Date(body.startTime),
    endTime: new Date(body.endTime),
  };
  try {
		const postRecord = await prisma.records.create({ data: task });
		res.json(postRecord);
	} catch (error) {
		console.error('Failed to create record:', error);
		res.status(500).send('Internal Server Error');
	}
});

router.get("/", async (req, res) => {
  const depositor = req.query.depositor;
  const beneficiary = req.query.beneficiary;

  let constraints = {};
  if (depositor != null) {
    constraints["depositor"] = depositor;
  }
  if (beneficiary != null) {
    constraints["beneficiary"] = beneficiary;
  }

  const result = await prisma.records.findMany({ where: constraints });

  res.json(result);
});

function validateTaskBody(req, res, next) {
  const schema = {
    depositor: "string",
    beneficiary: "string",
    hashCondition: "string",
    rewards: "number",
    activity: "number",
    numTimes: "number",
    period: "number",
    //   condition: "json",
    startTime: "string",
    endTime: "string",
    // claimed: 'boolean',
  };

  const errors = [];

  // Check for missing or incorrect type attributes
  Object.entries(schema).forEach(([key, type]) => {
    if (!(key in req.body)) {
      errors.push(`Missing: ${key}`);
    } else if (typeof req.body[key] !== type) {
      errors.push(
        `Incorrect type for ${key}: expected ${type}, got ${typeof req.body[
          key
        ]}`
      );
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next(); // Proceed to the route handler if validation passes
}

module.exports = router;
