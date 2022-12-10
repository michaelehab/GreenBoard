import { User, Student, College, School, Department, Instructor } from "@greenboard/shared";
import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

import { DataStore } from "..";
import { SEED_COLLEGES, SEED_DEPARTMENTS, SEED_SCHOOLS } from "./seeds";

export class SQLDataStore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb(dbPath: string) {
    const { NODE_ENV } = process.env;
    try {
      this.db = await sqliteOpen({
        filename: dbPath,
        driver: sqlite3.Database,
      });
    } catch (e) {
      console.error("Failed to open database at path:", dbPath, "err:", e);
      process.exit(1);
    }

    // To keep the referential integrity
    this.db.run("PRAGMA foreign_keys = ON");

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });

    if (dbPath === ":memory:") {
      console.log("Seeding data...");

      SEED_COLLEGES.forEach(async (c) => {
        if (!(await this.getCollegeById(c.id))) await this.createCollege(c);
      });
      SEED_SCHOOLS.forEach(async (s) => {
        if (!(await this.getSchoolById(s.id))) await this.createSchool(s);
      });
      SEED_DEPARTMENTS.forEach(async (d) => {
        if (!(await this.getDepartmentById(d.id)))
          await this.createDepartment(d);
      });
    }

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users(id, firstName, lastName, email, password, phoneNumber, joinedAt, departmentId) VALUES (?,?,?,?,?,?,?,?)",
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.joinedAt,
      user.departmentId
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User>("SELECT * FROM users WHERE id = ?", id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE email = ?",
      email
    );
  }

  async createStudent(student: Student): Promise<void> {
    await this.createUser(student);

    await this.db.run(
      "INSERT INTO students(id, level) VALUES (?,?)",
      student.id,
      student.level
    );
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    let usr: User | undefined = await this.getUserById(id);
    if (!usr) return usr;
    let std: Student | undefined = await this.db.get<Student>(
      "SELECT * FROM users WHERE id = ?",
      id
    );
    if (!std) return std;
    std.firstName = usr.firstName;
    std.lastName = usr.lastName;
    std.email = usr.email;
    std.password = usr.password;
    std.phone = usr.phone;
    std.joinedAt = usr.joinedAt;
    std.departmentId = usr.departmentId;

    return std;
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    let usr: User | undefined = await this.getUserByEmail(email);
    if (!usr) return usr;
    let std: Student | undefined = await this.db.get<Student>(
      "SELECT * FROM users WHERE email = ?",
      email
    );
    if (!std) return std;
    std.firstName = usr.firstName;
    std.lastName = usr.lastName;
    std.email = usr.email;
    std.password = usr.password;
    std.phone = usr.phone;
    std.joinedAt = usr.joinedAt;
    std.departmentId = usr.departmentId;

    return std;
  }

  async createCollege(college: College): Promise<void> {
    await this.db.run(
      "INSERT INTO colleges(id, name, phone, email, adminPassword, location, foundedAt) VALUES (?,?,?,?,?,?,?)",
      college.id,
      college.name,
      college.phone,
      college.email,
      college.adminPassword,
      college.location,
      college.foundedAt
    );
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE id = ?",
      id
    );
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE email = ?",
      email
    );
  }

  async createSchool(school: School): Promise<void> {
    await this.db.run(
      "INSERT INTO schools(id, name, phone, email, adminPassword, collegeId) VALUES (?,?,?,?,?,?)",
      school.id,
      school.name,
      school.phone,
      school.email,
      school.adminPassword,
      school.collegeId
    );
  }

  async getSchoolById(id: string): Promise<School | undefined> {
    return await this.db.get<School>("SELECT * FROM schools WHERE id = ?", id);
  }

  async getSchoolByEmail(email: string): Promise<School | undefined> {
    return await this.db.get<School>(
      "SELECT * FROM schools WHERE email = ?",
      email
    );
  }

  async createDepartment(department: Department): Promise<void> {
    await this.db.run(
      "INSERT INTO departments(id, name, email, adminPassword, schoolId) VALUES (?,?,?,?,?)",
      department.id,
      department.name,
      department.email,
      department.adminPassword,
      department.schoolId
    );
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE id = ?",
      id
    );
  }

  async getDepartmentByEmail(email: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE email = ?",
      email
    );
  }



async createInstructor(instructor: Instructor): Promise<void> {
  await this.createUser(instructor);

  await this.db.run(
    "INSERT INTO Instructors(id) VALUES (?)",
    instructor.id,
  );
}

async getInstructorById(id: string): Promise<Instructor | undefined> {
  let usr: User | undefined = await this.getUserById(id);
  if (!usr) return usr;
  let ins: Instructor | undefined = await this.db.get<Instructor>(
    "SELECT * FROM users WHERE id = ?",
    id
  );
  if (!ins) return ins;
  ins.firstName = usr.firstName;
  ins.lastName = usr.lastName;
  ins.email = usr.email;
  ins.password = usr.password;
  ins.phone = usr.phone;
  ins.joinedAt = usr.joinedAt;
  ins.departmentId = usr.departmentId;

  return ins;
}

async getInstructorByEmail(email: string): Promise<Instructor | undefined> {
  let usr: User | undefined = await this.getUserByEmail(email);
  if (!usr) return usr;
  let ins: Instructor | undefined = await this.db.get<Instructor>(
    "SELECT * FROM users WHERE email = ?",
    email
  );
  if (!ins) return ins;
  ins.firstName = usr.firstName;
  ins.lastName = usr.lastName;
  ins.email = usr.email;
  ins.password = usr.password;
  ins.phone = usr.phone;
  ins.joinedAt = usr.joinedAt;
  ins.departmentId = usr.departmentId;

  return ins;
}
}