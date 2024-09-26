class ListAllMeeting {
  constructor(meetingRepository) {
    this.meetingRepository = meetingRepository;
  }

  async execute(query) {
    return this.meetingRepository.findAll(query);
  }
}

module.exports = ListAllMeeting;
