const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  INVITE_EMAIL_TEMPLATE,
  ALERT_EMAIL_TEMPLATE,
  INVOICE_EMAIL_TEMPLATE
} = require("./emailTemplates.js");
const { mailtrapClient, sender } = require("./mailtrap.config.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "afb02214-f9e5-4278-b8d4-9d81dfff496b",
      template_variables: {
        company_info_name: "Team Work",
        name: name,
        company_info_address: "Brototype marad",
        company_info_city: "Kochi",
        company_info_zip_code: "671552",
        company_info_country: "India",
      },
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

const sendInviteEmail = async (email, url, projectName) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "invite a new member",
      html: INVITE_EMAIL_TEMPLATE.replace("{project_url}", url).replace(
        "{project_name}",
        projectName
      ),
      category: "invite member",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendAlertEmail = async (email, taskDetails) => {
  const { name, taskName, taskEndIn } = taskDetails;
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "⏰ You have a task to be completed by tomorrow",
      html: ALERT_EMAIL_TEMPLATE.replace("{user_name}", name).replace(
        "{task_name}",
        taskName
      ).replace("{deadline_date}", taskEndIn),
      category: "Alert",
    });
  } catch (error) {
    console.error(`Error sending  alert email`, error);
    throw new Error(`Error sending reset email: ${error}`);
  }
};


const sendInvoiceEmail = async (email, url, customerName) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Invoice of payment",
      html: INVOICE_EMAIL_TEMPLATE.replace("{customer_name}", customerName).replace(
        "{invoice_url}",
        url
      ),
      category: "Invoice",
    });
  } catch (error) {
    console.error(`Error sending invoice email`, error);
    throw new Error(`Error sending invoice email: ${error}`);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendInviteEmail,
  sendAlertEmail,
  sendInvoiceEmail
};
