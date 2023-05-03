const SibApiV3Sdk = require("sendinblue-apiv3");

const sendinBlueApiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.SMTPApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = sendinBlueApiKey;

const sendEmail = async (req, res) => {
  const { to, subject, message } = req.emailData;

  const sendSmtpEmail = {
    to: [{ email: to }],
    subject,
    htmlContent: `<p>${message}</p>`,
    sender: { email: "ne-pas-repondre@muentreprise.com" },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    (data) => {
      console.warn("Email sent successfully:", data);
    },
    (error) => {
      console.error("Error sending email:", error);
    }
  );

  return res;
};

module.exports = { sendEmail };
