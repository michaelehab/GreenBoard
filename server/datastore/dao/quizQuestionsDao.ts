import { QuizQuestion } from "@greenboard/shared";

export interface quizQuestionsDao {
  createQuizQuestion(quizQuestion: QuizQuestion): Promise<void>;
}
