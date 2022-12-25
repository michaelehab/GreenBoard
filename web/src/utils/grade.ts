import { SubmitQuizRequest, SubmitQuizResponse } from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function submitQuiz(
  courseId: string,
  quizId: string,
  answers: string[]
) {
  await callEndpoint<SubmitQuizRequest, SubmitQuizResponse>(
    `/courses/${courseId}/quizzes/${quizId}`,
    "POST",
    true,
    {
      answers,
    }
  );
}
