import { InstructorAnswer } from "@greenboard/shared";

export interface instructorAnswerDao {
  createInstructorAnswer(InstructorAnswer: InstructorAnswer): Promise<void>;
  getInstructorAnsweById(
    AnswerId: string
  ): Promise<InstructorAnswer | undefined>;
  listInstructorAnswerByPostId(questionId: string): Promise<InstructorAnswer[]>;
}
