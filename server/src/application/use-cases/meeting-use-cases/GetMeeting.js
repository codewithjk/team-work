class GetMeeting {
  constructor(meetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute(meetingId) {
    return await this.meetingRepository.findById(meetingId);
  }
}

module.exports = GetMeeting;
