class UpdateMeeting {
  constructor(meetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute(id, meeting) {
    console.log(id, meeting);
    return this.meetingRepository.update(id, meeting);
  }
}

module.exports = UpdateMeeting;