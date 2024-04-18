require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const app = express();

const prisma = new PrismaClient();

const recordRouter = require("./routers/record_router");

// 1. Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS
const corsOptions = {
  origin: "http://localhost:5173", // specify the frontend origin
  credentials: true, // allow credentials (cookies, sessions)
};

app.use(cors(corsOptions));

// 3. Connect to routers
app.use("/record", recordRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Push Dapp");
});

app.listen(8000, () => {
  console.log("Push API listening on http://localhost:8000");
});
