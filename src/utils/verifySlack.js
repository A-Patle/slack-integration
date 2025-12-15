export const verifySlackToken = (token) => {
  return token === process.env.SLACK_VERIFICATION_TOKEN;
};
