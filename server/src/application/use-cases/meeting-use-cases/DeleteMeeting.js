class DeleteMeeting {
  constructor(meetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute(id) {
    return await this.meetingRepository.delete(id);
  }
}

module.exports = DeleteMeeting;
