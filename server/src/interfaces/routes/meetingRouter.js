const express = require("express");
const MeetingController = require("../controllers/meetingController");

const router = express.Router();

const meetingController = new MeetingController();

router
  .route("/")
  .get(meetingController.getAllMeetings)
  .post(meetingController.createMeeting);

router
  .route("/:meetingId")
  .get(meetingController.getMeetingById)
  .put(meetingController.updateMeetingById)
  .delete(meetingController.deleteMeetingById);

module.exports = router;
