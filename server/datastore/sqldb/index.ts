import { User, Student, College } from "@greenboard/shared";
import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

import { DataStore } from "..";

export class SQLDataStore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb(dbPath: string) {
    this.db = await sqliteOpen({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // To keep the referential integrity
    this.db.run("PRAGMA foreign_keys = ON");

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });

    return this;
  }
  getUserById(id: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  createStudent(student: Student): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getStudentById(id: string): Promise<Student | undefined> {
    throw new Error("Method not implemented.");
  }
  getStudentByEmail(email: string): Promise<Student | undefined> {
    throw new Error("Method not implemented.");
  }
  async createCollege(college: College): Promise<void> {
    await this.db.run(
      "INSERT INTO colleges(id, name, phone, email, admin_password, location, founded_at) VALUES (?,?,?,?,?,?,?)",
      college.id,
      college.name,
      college.phone,
      college.email,
      college.adminPassword,
      college.location,
      college.foundedAt
    );
  }
  getCollegeById(id: string): Promise<College | undefined> {
    throw new Error("Method not implemented.");
  }
  async getCollegeByEmail(email: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE email = ?",
      email
    );
  }
}
