const { Pulse } = require('@pulsecron/pulse');
const { sendAlertEmail } = require('../mailtrap/emails');
require("dotenv").config()


const mongoConnectionString = process.env.MONGODB_URI;
const pulse = new Pulse({
    db: { address: mongoConnectionString, collection: 'cronjob' },
    defaultConcurrency: 4,
    maxConcurrency: 4,
    processEvery: '10 seconds',
    resumeOnRestart: true
});



pulse.define('send email', async (job, done) => {
    const { email, name, taskName, taskEndIn } = job.attrs.data;

    try {
        await sendAlertEmail(email, { name, taskName, taskEndIn })
        console.log(`Email sent to ${email}`);
        done();
    } catch (error) {
        console.error(`Failed to send email to ${email}`, error);
        done(error);
    }
}, { shouldSaveResult: true });

pulse.on('success', (job) => {
    console.log(`Job <${job?.attrs?.name}> succeeded`);
});

pulse.on('fail', (error, job) => {
    console.log(`Job <${job?.attrs?.name}> failed:`, error);
});





module.exports = pulse;