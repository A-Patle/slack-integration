import connection from '../config/snowflake.js';

export const execSQL = (query) => {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    });
  });
};
