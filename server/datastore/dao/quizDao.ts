import { Quiz, QuizWithName } from "@greenboard/shared";

export interface QuizDao {
  createQuiz(quiz: Quiz): Promise<void>;
  getQuizById(id: string): Promise<Quiz | undefined>;
  getActivatedQuizzesByCourseId(courseId: string): Promise<QuizWithName[]>;
  getQuizzesByCourseId(courseId: string): Promise<QuizWithName[]>;
  toggleQuizAcivation(isActive: boolean, quizId: string): Promise<void>;
}
