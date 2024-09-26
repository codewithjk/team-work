const {
  CreateMeeting,
  ListAllMeeting,
  GetMeeting,
  UpdateMeeting,
  DeleteMeeting,
} = require("../../application/use-cases/meeting-use-cases");
const {
  ListAllProject,
} = require("../../application/use-cases/project-use-cases");

const MeetingRepositoryImpl = require("../../infrastructure/database/repositories/meetingRepositoryImpl");
const ProjectRepositoryImpl = require("../../infrastructure/database/repositories/projectRepositoryImpl");

// projects
const projectRepository = new ProjectRepositoryImpl();
const listAllProjectUseCase = new ListAllProject(projectRepository);

const meetingRepository = new MeetingRepositoryImpl();

const creatMeetingUseCase = new CreateMeeting(meetingRepository);
const listAllMeetingUseCase = new ListAllMeeting(meetingRepository);
const getMeetingUsecase = new GetMeeting(meetingRepository);
const updateMeetingUsecase = new UpdateMeeting(meetingRepository);
const deleteMeetingUsecase = new DeleteMeeting(meetingRepository);

class MeetingController {
  async createMeeting(req, res) {
    try {
      const newMeeting = await creatMeetingUseCase.execute(req.body);
      console.log(newMeeting);
      res.status(200).json({ message: "successful", meeting: newMeeting });
    } catch (error) {
      console.log("Error from controller : ", error.message);
      res.status(400).json({ error: error.message });
    }
  }
  async getAllMeetings(req, res) {
    try {
      const userId = req.userId;
      const projectData = await listAllProjectUseCase.execute({
        filter: "true",
        ownerId: userId,
      });
      const projects = projectData.projects;
      const projectIds = projects.map((pro) => pro._id);

      const { search, filter, page = 1, limit = 10 } = req.query;
      const { meetings, totalPages } = await listAllMeetingUseCase.execute({
        search,
        filter,
        page,
        limit,
        projectIds,
      });

      res.status(200).json({
        meetings,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch meetings", message: error.message });
    }
  }

  async getMeetingById(req, res) {
    try {
      const id = req.params.meetingId;
      const meeting = await getMeetingUsecase.execute(id);
      res.status(200).json({ message: "successful", meeting });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateMeetingById(req, res) {
    try {
      const meeting = req.body;
      const id = req.params.meetingId;
      await updateMeetingUsecase.execute(id, meeting);
      res.status(200).json({ message: "successful", meeting });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update meeting", message: error.message });
    }
  }
  async deleteMeetingById(req, res) {
    try {
      const id = req.params.meetingId;
      await deleteMeetingUsecase.execute(id);
      res.status(200).json({ message: "successful" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete meeting", message: error.message });
    }
  }
}

module.exports = MeetingController;
