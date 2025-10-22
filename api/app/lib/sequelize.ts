import { Sequelize } from "sequelize";
import path from "node:path";
import fs from "node:fs";

let _sequelize: Sequelize | null = null;

export default function getSequelize(): Sequelize {
  if (!_sequelize) {
    // Resolve a storage path that works in both Docker and local dev
    const storagePath = process.env.SQLITE_STORAGE
      ? process.env.SQLITE_STORAGE
      : path.resolve(process.cwd(), "sqlite", "stages.sqlite");

    // Ensure the parent directory exists to avoid SQLITE_CANTOPEN
    const dir = path.dirname(storagePath);
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      /* no-op: directory may already exist or be unwritable in read-only envs */
    }

    _sequelize = new Sequelize({
      dialect: "sqlite",
      storage: storagePath,
      logging: false,
    });
  }
  return _sequelize;
}
