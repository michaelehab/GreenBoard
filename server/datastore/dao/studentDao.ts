import { Student } from "@greenboard/shared";

export interface StudentDao {
  createStudent(student: Student): Promise<void>;
  getStudentById(id: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  getStudentByPhoneNumber(phone: string): Promise<Student | undefined>;
}
