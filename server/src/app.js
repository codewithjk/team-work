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
  allowedHeaders: 'Content-Type,Authorization'
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
// app.use(verifyJwtToken);
app.use("/api/v1/profile", verifyJwtToken, profileRouter);
app.use("/api/v1/project", verifyJwtToken, projectRouter);
app.use("/api/v1/module", verifyJwtToken, moduleRouter);
app.use("/api/v1/task", verifyJwtToken, taskRouter);
app.use("/api/v1/chat", verifyJwtToken, chatRouter);
app.use("/api/v1/meeting", verifyJwtToken, meetingRouter);
app.use("/api/v1/notification", verifyJwtToken, notificationRouter);
app.use("/api/v1/upload", verifyJwtToken, fileUploadRouter);
app.use('/api/v1/comment', verifyJwtToken, commentRouter)
app.use(errorHandlerMiddleware);
module.exports = app;
