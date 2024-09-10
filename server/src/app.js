const express = require("express");
const authRouter = require("./interfaces/routes/authRouter");
const profileRouter = require("./interfaces/routes/profileRouter");
const projectRouter = require("./interfaces/routes/projectRouter");
const errorHandlerMiddleware = require("./interfaces/middlewares/errorHandlerMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJwtToken = require("./interfaces/middlewares/verifyJwtToken");
const moduleRouter = require("./interfaces/routes/moduleRouter");
const taskRouter = require("./interfaces/routes/taskRouter");
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

app.use(verifyJwtToken);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/module", moduleRouter);
app.use("/api/v1/task", taskRouter);
app.use(errorHandlerMiddleware);
module.exports = app;
