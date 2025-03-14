const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const notFound = require("./middlewares/notFound");

const app = express();

// parser
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("server is working");
});

// Global Error handler middleware
app.use(globalErrorHandler);

// not found middleware
app.use(notFound);

module.exports = app;
