const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const notFound = require("./middlewares/notFound");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const orderRouter = require("./routes/order.route");
const paymentRouter = require("./routes/payment.route");

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
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);

// Global Error handler middleware
app.use(globalErrorHandler);

// not found middleware
app.use(notFound);

module.exports = app;
