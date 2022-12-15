import { StudentQuestion } from "@greenboard/shared";
export interface StuQuestionDao {
  createStuQuestion(StudentQuestion: StudentQuestion): Promise<void>;
  getstuQuestionById(
    StudentQuestionid: string
  ): Promise<StudentQuestion | undefined>;
  listStuQuestionBycourseId(courseId: string): Promise<StudentQuestion[]>;
}
