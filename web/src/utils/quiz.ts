import {
  CreateQuizRequest,
  CreateQuizResponse,
  QuizQuestion,
  ToggleQuizActivationRequest,
  ToggleQuizActivationResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function createQuiz(
  courseId: string,
  name: string,
  isActive: boolean,
  quizDate: Date,
  questions: Pick<
    QuizQuestion,
    | "question_number"
    | "question"
    | "choiceA"
    | "choiceB"
    | "choiceC"
    | "choiceD"
    | "rightChoice"
    | "weight"
  >[]
) {
  await callEndpoint<CreateQuizRequest, CreateQuizResponse>(
    `/courses/${courseId}/quizzes`,
    "POST",
    true,
    {
      quiz: {
        name,
        isActive,
        quizDate,
      },
      questions,
    }
  );
}

export async function toggleQuiz(courseId: string, quizId: string) {
  const res = await callEndpoint<
    ToggleQuizActivationRequest,
    ToggleQuizActivationResponse
  >(`/courses/${courseId}/quizzes/${quizId}/toggle`, "PUT", true);

  return res.isActive;
}
