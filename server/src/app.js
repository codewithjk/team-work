const express = require("express");
const authRouter = require("./interfaces/routes/authRouter");
const errorHandlerMiddleware = require("./interfaces/middlewares/errorHandlerMiddleware");
const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(errorHandlerMiddleware);

module.exports = app;
