import { StudentQuestion } from "@greenboard/shared";
export interface StuQuestionDao {
    createStuQuestion(StudentQuestion: StudentQuestion): Promise<void>;
    getstuQuestionById(StudentQuestionid: string): Promise<StudentQuestion | undefined>;
    listStuQuestionByStudentId(StudentId: string): Promise<StudentQuestion[]>;
  }
  