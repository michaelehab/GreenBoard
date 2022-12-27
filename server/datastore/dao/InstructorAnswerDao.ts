import { InstructorAnswer,UserDataAndComment } from "@greenboard/shared";

export interface instructorAnswerDao {
  createInstructorAnswer(InstructorAnswer: InstructorAnswer): Promise<void>;
  getInstructorAnswerById(
    AnswerId: string
  ): Promise<UserDataAndComment | undefined>;
  listInstructorAnswerByPostId(questionId: string): Promise<UserDataAndComment[]>;
}
