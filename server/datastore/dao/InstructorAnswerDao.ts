import { InstructorAnswer } from "@greenboard/shared";

export interface instructorAnswerDao {
  createInstructorAnswer(InstructorAnswer: InstructorAnswer): Promise<void>;
  getInstructorAnswerById(
    AnswerId: string
  ): Promise<InstructorAnswer | undefined>;
  listInstructorAnswerByPostId(questionId: string): Promise<InstructorAnswer[]>;
}
