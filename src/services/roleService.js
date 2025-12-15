import { execSQL } from './sqlHelper.js';

export const ALLOWED_ROLES = ['PUBLIC', 'DEV_ROLE', 'ANALYST_ROLE'];

export const roleExists = async (role) => {
  const sql = `SHOW ROLES LIKE '${role}'`;
  const rows = await execSQL(sql);
  return rows.length > 0;
};

export const createRole = async (role) => {
  const sql = `CREATE ROLE IF NOT EXISTS "${role}"`;
  await execSQL(sql);
};
