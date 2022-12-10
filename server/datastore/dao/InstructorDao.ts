import { Instructor } from "@greenboard/shared";

export interface InstructorDao {
  createInstructor(Instructor: Instructor): Promise<void>;
  getInstructorById(id: string): Promise<Instructor | undefined>;
  getInstructorByEmail(email: string): Promise<Instructor | undefined>;
  getInstructorByPhoneNumber(phone: string): Promise<Instructor | undefined>;
}
