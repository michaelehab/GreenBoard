import { StudentQuestion, UserDataAndPost } from "@greenboard/shared";
export interface StuQuestionDao {
  createStuQuestion(StudentQuestion: StudentQuestion): Promise<void>;
  getStdQuestionById(
    StudentQuestionId: string
  ): Promise<UserDataAndPost | undefined>;
  listStuQuestionByCourseId(courseId: string): Promise<UserDataAndPost[]>;
}
