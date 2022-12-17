import { QuizQuestion } from "@greenboard/shared";

export interface quizQuestionsDao {
  createQuizQuestion(quizQuestion: QuizQuestion): Promise<void>;
  getQuizQuestionsByQuizId(QuizId: string): Promise<QuizQuestion[] | undefined>;
}
