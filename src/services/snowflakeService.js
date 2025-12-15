import { execSQL } from './sqlHelper.js';
import { ALLOWED_ROLES, roleExists, createRole } from './roleService.js';
import { generatePassword } from '../utils/passwordUtil.js';

const logOperation = async (username, role, operation) => {
  const sql = `
    INSERT INTO SNOWFLAKE_LEARNING_DB.SLACK_APP.user_operations_log
    (username, role, operation)
    VALUES ('${username}', '${role}', '${operation}');
  `;
  await execSQL(sql);
};

export const onboardUser = async (username, role) => {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error('Invalid role specified.');
  }

  const createUser = `
    CREATE USER IF NOT EXISTS "${username}"
    PASSWORD = 'Temp@123'
    MUST_CHANGE_PASSWORD = TRUE;
  `;

  await execSQL(createUser);

  const exists = await roleExists(role);
  if (!exists) {
    await createRole(role);
  }

  const grantRole = `GRANT ROLE "${role}" TO USER "${username}";`;
  await execSQL(grantRole);
  await logOperation(username, role, 'ONBOARD_USER');

  return true;
};

export const resetPassword = async (username) => {
  const newPass = generatePassword();

  const sql = `
    ALTER USER "${username}" 
    SET PASSWORD='${newPass}', MUST_CHANGE_PASSWORD=TRUE;
  `;
  await execSQL(sql);
  await logOperation(username, null, 'RESET_PASSWORD');
  return newPass;
};
