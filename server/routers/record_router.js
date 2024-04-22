require("dotenv").config({ path: "../env" });
const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const { validateTaskBody } = require("../utils/schema_validator");

const prisma = new PrismaClient();

const router = express.Router();

router.get("/time/:time", async (req, res) => {
  const time = new Date(req.params.time)
  // const time = new Date("2024-05-02T20:03:39.000Z")
  console.log(time.getTime());
  res.send(`${time.getTime()}`)
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
    totalTimes: body.totalTimes,
    condition: body.condition,
    startTime: new Date(body.startTime),
    endTime: new Date(body.endTime),
  };
  try {
    const postRecord = await prisma.records.create({ data: task });
    res.json(postRecord);
  } catch (error) {
    console.error("Failed to create record:", error);
    res.status(500).send("Internal Server Error");
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

module.exports = router;
