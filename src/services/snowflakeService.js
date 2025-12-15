import { execSQL } from './sqlHelper.js';
import { ALLOWED_ROLES, roleExists, createRole } from './roleService.js';
import { generatePassword } from '../utils/passwordUtil.js';

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

  const grantRole = `GRANT ROLE "${role}" TO USER "${username}"`;
  await execSQL(grantRole);

  return true;
};

export const resetPassword = async (username) => {
  const newPass = generatePassword();

  const sql = `
    ALTER USER "${username}" 
    SET PASSWORD='${newPass}', MUST_CHANGE_PASSWORD=TRUE;
  `;

  await execSQL(sql);
  return newPass;
};
