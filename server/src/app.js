const express = require("express");
const authRouter = require("./interfaces/routes/authRouter");
const errorHandlerMiddleware = require("./interfaces/middlewares/errorHandlerMiddleware");
const cors = require("cors");
const app = express();

// const allowedOrigin = process.env.WEB_APP_ORIGIN;
// var corsOptions = {
//   origin: allowedOrigin,
//   optionsSuccessStatus: 200,
// };
app.use(cors());

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(errorHandlerMiddleware);

module.exports = app;
