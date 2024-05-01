require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const recordRouter = require("./routers/record_router");
const healthDataRouter = require("./routers/health_data");
const zkRouter = require("./routers/zk_proof");

const PORT = 8000;

// 1. Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS
const corsOptions = {
  origin: "http://localhost:3000", // specify the frontend origin
  credentials: true, // allow credentials (cookies, sessions)
};

app.use(cors(corsOptions));

// 3. Connect to routers
app.use("/record", recordRouter);
app.use("/healthdata", healthDataRouter);
app.use("/zkproof", zkRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Push Dapp server");
});

app.listen(PORT, () => {
  console.log(`Push server listening on http://localhost:${PORT}`);
});
