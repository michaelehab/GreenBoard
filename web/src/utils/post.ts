import {
  CreatePostRequest,
  CreateCoursePostResponse,
  CreateStudentQuestionResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function createPost(
  title: string,
  url: string,
  content: string,
  courseId: string | undefined
) {
  await callEndpoint<CreatePostRequest, CreateCoursePostResponse>(
    `/courses/${courseId}/posts`,
    "POST",
    false,
    {
      title,
      content,
      url,
    }
  );
}

export async function createStudentQuestion(
  title: string,
  url: string,
  content: string,
  courseId: string | undefined
) {
  await callEndpoint<CreatePostRequest, CreateStudentQuestionResponse>(
    `/courses/${courseId}/questions`,
    "POST",
    false,
    {
      title,
      content,
      url,
    }
  );
}
