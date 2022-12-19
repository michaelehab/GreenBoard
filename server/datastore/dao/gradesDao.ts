import { Grade, GradeWithName } from "@greenboard/shared";

export interface GradesDao {
  createGrade(grade: Grade): Promise<void>;
  getGrade(studentId: string, quizId: string): Promise<Grade | undefined>;
  getStudentGradesWithNameByCourseId(
    studentId: string,
    courseId: string
  ): Promise<GradeWithName[]>;
  getQuizGradesWithNameById(quizId: string): Promise<GradeWithName[]>;
  getStudentGradeWithName(
    studentId: string,
    quizId: string
  ): Promise<GradeWithName | undefined>;
}
