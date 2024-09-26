class CreateMeeting {
  constructor(meetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute(meeting) {
    return await this.meetingRepository.save(meeting);
  }
}

module.exports = CreateMeeting;
