import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify you email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verification}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sending successfully", response);
  } catch (error) {
    console.error("Error sending verification", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendPasswordReset = async (email, resetUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset you password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetUrl}", resetUrl),
      category: "Password Reset",
    });

    console.log("Email sending successfully", response);
  } catch (error) {
    console.error("Error sending reset email", error);
    throw new Error(`Error sending password resetting email: ${error}`);
  }
};
