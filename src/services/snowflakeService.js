import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';
dotenv.config();

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: 'COMPUTE_WH',
});

connection.connect((err) => {
  if (err) console.error('Snowflake connection error:', err);
  else console.log('Connected to Snowflake!');
});

// Execute SQL helper
function execSQL(query) {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    });
  });
}

const roleExists = async (role) => {
  const sql = `SHOW ROLES LIKE '${role}'`;
  const rows = await execSQL(sql);
  return rows.length > 0;
};

const ALLOWED_ROLES = ['PUBLIC', 'DEV_ROLE', 'ANALYST_ROLE'];

const createRole = async (role) => {
  const sql = `CREATE ROLE IF NOT EXISTS "${role}"`;
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

  const exits = await roleExists(role);

  if (!exits) {
    await createRole(role);
  }

  const grantRole = `
    GRANT ROLE "${role}" TO USER "${username}";
  `;

  await execSQL(grantRole);

  return true;
};

export const resetPassword = async (username) => {
  const newPass = 'Reset@' + Math.floor(Math.random() * 90000 + 10000);

  const sql = `
    ALTER USER "${username}" 
    SET PASSWORD='${newPass}', MUST_CHANGE_PASSWORD=TRUE;
  `;

  await execSQL(sql);
  return newPass;
};
