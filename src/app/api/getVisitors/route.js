import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './database.db',
  driver: sqlite3.Database,
});

export async function GET() {
  const db = await dbPromise;

  // Fetch all visitors from the database
  const visitors = await db.all('SELECT * FROM visitors ORDER BY timestamp DESC');

  return new Response(JSON.stringify(visitors), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
