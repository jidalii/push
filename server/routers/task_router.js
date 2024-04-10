require("dotenv").config({ path: "../env" });
const express = require("express");
const { CID } = import("multiformats/cid");
const { ACTIVITIES, PERIOD } = require("../utils/constant");
const { createHelia } = import("helia");
const { json } = import("@helia/json");

const router = express.Router();

router.get(
  "/check-data",
  [validateCheckTaskBody, validateTimePeriod],
  async (req, res) => {
    res.status(200).json({message: "data is correct"})
  }
);

router.post("/", validateTaskBody, async (req, res) => {
  const body = req.body
  const helia = await createHelia()
  const j = json(helia)

  const task = {
	depositor: body.depositor,
	beneficiary: body.beneficiary,
	amount: body.amount,
	activity: body.activity,
	period: body.period,
	target: body.target,
	startTime: body.startTime,
	endTime: body.endTime,
	// claimed: 'boolean',
  }
  const cid = await j.add(task);
  const cid_str = cid.toString();

  await prisma.cid.create({
    data: {
		depositor: body.depositor,
		beneficiary: body.beneficiary,
		cid: cid_str,
		claimed: false
    },
  })
})

router.get("/task/:address", validateQueryBody, async (req, res) => {
	let role
	if (req.body.role == 0) {
		role = "depositor"
		
	} else {
		role = "beneficiary"
	}
	let query = {}
	query[where]
	const tasks = await prisma.cid.findMany({
		where: {
			[role]: req.body.address,
		  },
	})
	const cidFromDb = CID.parse(user.cid)

	const content = await j.get(cidFromDb)
	res.send({
	cid: cidFromDb,
	content: content,
	user: user,
	});
})

// check wether request body does have the json with all the required attributes
function validateCheckTaskBody(req, res, next) {
  const schema = {
    // depositor: 'string',
    // beneficiary: 'string',
    amount: "number",
    activity: "number",
    period: "number",
    target: "number",
    startTime: "number",
    endTime: "number",
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

function validateTaskBody(req, res, next) {
	const schema = {
	  depositor: 'string',
	  beneficiary: 'string',
	  amount: "number",
	  activity: "number",
	  period: "number",
	  target: "number",
	  startTime: "number",
	  endTime: "number",
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

function validateQueryBody(req, res, next) {
	const schema = {
		address: 'string',
		role: "number"
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

function validateTimePeriod(req, res, next) {
  let oneDayMS = 24 * 60 * 60 * 1000;
  const body = req.body;
  switch (body.period) {
    case PERIOD.C1D:
      if (body.endTime - body.startTime < oneDayMS) {
        return res.status(400).json("invalid endTime");
      }
      break;
    case PERIOD.C7D:
      if (body.endTime - body.startTime < 7 * oneDayMS) {
        return res.status(400).json("invalid endTime");
      }
      break;
    case PERIOD.C15D:
      if (body.endTime - body.startTime < 15 * oneDayMS) {
        return res.status(400).json("invalid endTime");
      }
      break;
  }

  next();
}

module.exports = router;
