const { MailtrapClient } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const mailtrapClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
module.exports = { mailtrapClient, sender };
