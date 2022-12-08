import { StudentDao } from "./dao/studentDao";
import { UserDao } from "./dao/userDao";
import { CollegeDao } from "./dao/collegeDao";
import { SchoolDao } from "./dao/schoolDao";
import { SQLDataStore } from "./sqldb";

export interface DataStore extends UserDao, StudentDao, CollegeDao, SchoolDao {}

export let db: DataStore;

export async function initDb(dbPath: string) {
  db = await new SQLDataStore().openDb(dbPath);
}
