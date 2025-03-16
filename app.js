const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const notFound = require("./middlewares/notFound");
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cookieParser = require("cookie-parser");
const app = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("server is working");
});

// api endpoints

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

// Global Error handler middleware
app.use(globalErrorHandler);

// not found middleware
app.use(notFound);

module.exports = app;
