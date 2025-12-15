# Snowflake Slack Automation

Simple project that exposes Slack commands to perform user operations in Snowflake and logs those operations to a table for audit.

## Slack commands (run from Slack)

These commands can be executed from Slack:

```
/snowflake onboard_user test_user2 DEV_ROLE    # creation
/snowflake reset_password test_user2           # reset password
```

Use the commands with your own username and role where appropriate.

## Check operational logs (run in Snowflake)

Run these SQL statements in Snowflake (use the Slack automation role first):

```
USE ROLE SLACK_AUTOMATION_ROLE;

SELECT * FROM SNOWFLAKE_LEARNING_DB.SLACK_APP.USER_OPERATIONS_LOG;
```

## Important: what Snowflake stores (in plain language)

Yes, Snowflake DOES store users, roles, and passwords — but NOT in your database tables.

- 👤 Users → stored in Snowflake account metadata
- 🔐 Passwords → stored securely & hashed, never visible
- 🎭 Roles → stored at account level
- 📊 Your table (`USER_OPERATIONS_LOG`) → stores audit logs only

This is by design.

## Where to look in this repo

- Slack route / controller: `src/routes/slackRouter.js` and `src/controllers/slackController.js`
- Snowflake configuration: `src/config/snowflake.js`
- Snowflake service: `src/services/snowflakeService.js` and `src/services/sqlHelper.js`
- Slack verification / utils: `src/utils/verifySlack.js` and `src/utils/sendSlackResponse.js`

---