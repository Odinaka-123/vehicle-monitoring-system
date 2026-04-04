import Database from "better-sqlite3";

const db = new Database("vehicle.db");

// Create vehicles table
db.prepare(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_name TEXT,
    plate_number TEXT,
    department TEXT,
    phone TEXT,
    vehicle_type TEXT,
    vehicle_color TEXT,
    status TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number TEXT,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();
console.log("Vehicles:", db.prepare("SELECT * FROM vehicles").all());
console.log("Incidents:", db.prepare("SELECT * FROM incidents").all());

export default db;