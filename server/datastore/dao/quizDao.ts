import { Quiz, QuizTrial, QuizWithName } from "@greenboard/shared";

export interface QuizDao {
  createQuiz(quiz: Quiz): Promise<void>;
  getQuizById(id: string): Promise<Quiz | undefined>;
  logQuizTrial(studentId: string, quizId: string): Promise<void>;
  checkIfQuizTrialExist(
    studentId: string,
    quizId: string
  ): Promise<QuizTrial | undefined>;
  getActivatedQuizzesByCourseId(courseId: string): Promise<QuizWithName[]>;
  getQuizzesByCourseId(courseId: string): Promise<QuizWithName[]>;
  toggleQuizAcivation(isActive: boolean, quizId: string): Promise<void>;
}
