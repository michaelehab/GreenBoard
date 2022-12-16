import { InstructorAnswer } from "@greenboard/shared";

export interface instructorAnswerDao {
  createInstructorAnswer(InstructorAnswer: InstructorAnswer): Promise<void>;
  getInstructorAnsweById(
    InstructorAnswerId: string
  ): Promise<InstructorAnswer | undefined>;
  listInstructorAnswerByPostId(PostId: string): Promise<InstructorAnswer[]>;
}
