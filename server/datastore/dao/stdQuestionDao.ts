import { StudentQuestion } from "@greenboard/shared";
export interface StuQuestionDao {
  createStuQuestion(StudentQuestion: StudentQuestion): Promise<void>;
  getStdQuestionById(
    StudentQuestionId: string
  ): Promise<StudentQuestion | undefined>;
  listStuQuestionByCourseId(courseId: string): Promise<StudentQuestion[]>;
}
