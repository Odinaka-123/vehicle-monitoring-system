import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_name TEXT,
      plate_number TEXT UNIQUE,
      department TEXT,
      phone TEXT,
      vehicle_type TEXT,
      vehicle_color TEXT,
      status TEXT DEFAULT 'active'
    );
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate_number TEXT,
      status TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'admin'
    );
  `);

  const existing = await db.execute({
    sql: "SELECT * FROM users WHERE username = ?",
    args: ["admin"],
  });

  if (existing.rows.length === 0) {
    const hash = bcrypt.hashSync("admin123", 10);
    await db.execute({
      sql: "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      args: ["admin", hash, "admin"],
    });
  }
}

export default db;