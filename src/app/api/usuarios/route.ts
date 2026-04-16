import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.execute('SELECT * FROM usuarios');

  return NextResponse.json(rows);
}