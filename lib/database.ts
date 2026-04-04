import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("vehicle.db");

// ================= VEHICLES =================
db.prepare(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT,
    plate_number TEXT UNIQUE,
    department TEXT,
    phone TEXT,
    vehicle_type TEXT,
    vehicle_color TEXT,
    status TEXT DEFAULT 'active'
  )
`).run();

// ================= INCIDENTS =================
db.prepare(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number TEXT,
    status TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// ================= USERS =================
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'admin'
  )
`).run();

// ================= DEFAULT ADMIN =================
const existingAdmin = db
  .prepare("SELECT * FROM users WHERE username = ?")
  .get("admin");

if (!existingAdmin) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);

  db.prepare(`
    INSERT INTO users (username, password, role)
    VALUES (?, ?, ?)
  `).run("admin", hashedPassword, "admin");

  console.log("✅ Default admin created (username: admin / password: admin123)");
}

console.log("Vehicles:", db.prepare("SELECT * FROM vehicles").all());
console.log("Incidents:", db.prepare("SELECT * FROM incidents").all());
console.log("Users:", db.prepare("SELECT id, username, role FROM users").all());

export default db;