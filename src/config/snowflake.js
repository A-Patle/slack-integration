import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';
dotenv.config();

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((err) => {
  if (err) console.error('Snowflake connection error:', err);
  else console.log('Connected to Snowflake!');
});

export default connection;
