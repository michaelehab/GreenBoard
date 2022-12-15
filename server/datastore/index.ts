import { StudentDao } from "./dao/studentDao";
import { UserDao } from "./dao/userDao";
import { CollegeDao } from "./dao/collegeDao";
import { SchoolDao } from "./dao/schoolDao";
import { DepartmentDao } from "./dao/departmentDao";
import { SQLDataStore } from "./sqldb";
import { Instructor } from "@greenboard/shared";
import { InstructorDao } from "./dao/InstructorDao";
import { CourseDao } from "./dao/courseDao";
import { EnrollmentDao } from "./dao/enrollmentDao";
import { PostDao } from "./dao/postDao";
import { CoursePostDao } from "./dao/coursePostDao";
import { StuQuestionDao } from "./dao/stuQuestionDao";

export interface DataStore
  extends UserDao,
    StudentDao,
    CollegeDao,
    SchoolDao,
    DepartmentDao,
    InstructorDao,
    CourseDao,
    EnrollmentDao,
    PostDao,
    CoursePostDao,
    StuQuestionDao {}

export let db: DataStore;

export async function initDb(dbPath: string) {
  db = await new SQLDataStore().openDb(dbPath);
}
