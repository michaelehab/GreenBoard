import { Grade } from "@greenboard/shared";

export interface GradesDao {
  createGrade(grade: Grade): Promise<void>;
  getGrade(studentId: string, quizId: string): Promise<Grade | undefined>;
}
