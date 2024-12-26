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
const commentRouter = require("./interfaces/routes/commentRouter");
const stripeRouter = require("./interfaces/routes/stripeRouter");
const chatRouter = require("./interfaces/routes/chatRouter");
const meetingRouter = require("./interfaces/routes/meetingRouter");
const notificationRouter = require("./interfaces/routes/notificationRouter");
const fileUploadRouter = require("./interfaces/routes/fileUploadRouter");
const upload = require("./shared/utils/multer");
require("dotenv").config()


const app = express();

const allowedOrigin = process.env.WEB_APP_ORIGIN;
var corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  "/api/v1/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeRouter
);

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(verifyJwtToken);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/module", moduleRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/meeting", meetingRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/upload", fileUploadRouter);
app.use('/api/v1/comment', commentRouter)
app.use(errorHandlerMiddleware);
module.exports = app;
