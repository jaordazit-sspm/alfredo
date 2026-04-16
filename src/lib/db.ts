import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'develop',
  password: 'develop1',
  database: 'tienda',
});