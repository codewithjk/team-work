const express = require("express");
const authRouter = require("./interfaces/routes/authRouter");
const profileRouter = require("./interfaces/routes/profileRouter");
const errorHandlerMiddleware = require("./interfaces/middlewares/errorHandlerMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const allowedOrigin = process.env.WEB_APP_ORIGIN;
var corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use(errorHandlerMiddleware);
module.exports = app;
