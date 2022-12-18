import { Grade, GradeWithName } from "@greenboard/shared";

export interface GradesDao {
  createGrade(grade: Grade): Promise<void>;
  getGrade(studentId: string, quizId: string): Promise<Grade | undefined>;
  getStudentGradesByCourseId(
    studentId: string,
    courseId: string
  ): Promise<GradeWithName[]>;
  getQuizGradesById(quizId: string): Promise<GradeWithName[]>;
}
