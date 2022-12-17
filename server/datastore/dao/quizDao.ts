import { Quiz } from "@greenboard/shared";

export interface QuizDao {
  createQuiz(quiz: Quiz): Promise<void>;
  getQuizById(id: string): Promise<Quiz | undefined>;
}
