import { verifySlackToken } from "../utils/verifySlack.js";
import { sendSlackMessage } from "../utils/sendSlackResponse.js";
import { onboardUser, resetPassword } from "../services/snowflakeService.js";

export const handleSlackCommand = async (req, res) => {
  const { user_id, text, token, response_url } = req.body;

  if (!verifySlackToken(token)) {
    return sendSlackMessage(response_url, "Invalid Slack token.");
  }

  const allowed = process.env.ALLOWED_SLACK_USERS.split(",");
  if (!allowed.includes(user_id)) {
    return sendSlackMessage(response_url, "You are not authorized.");
  }

  const [operation, username, role] = text.trim().split(" ");

  try {
    if (operation === "onboard_user") {
      if (!username || !role) {
        return sendSlackMessage(response_url, "Usage: /snowflake onboard_user <username> <role>");
      }
      const result = await onboardUser(username, role);
      return sendSlackMessage(response_url, `User *${username}* onboarded with role *${role}*.`);
    }

    if (operation === "reset_password") {
      if (!username) {
        return sendSlackMessage(response_url, "Usage: /snowflake reset_password <username>");
      }
      const newPass = await resetPassword(username);
      return sendSlackMessage(response_url, `Password reset for *${username}*: \`${newPass}\``);
    }

    return sendSlackMessage(response_url, "Unknown command.");
  } catch (error) {
    console.error(error);
    return sendSlackMessage(response_url, "Something went wrong.");
  }
};
