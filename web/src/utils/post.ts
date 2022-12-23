import {
  CreatePostRequest,
  CreateCoursePostResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";
import { useParams } from "react-router-dom";

export async function createPost(
  title: string,
  url: string,
  content: string,
  courseId: string | undefined
) {
  const res = await callEndpoint<CreatePostRequest, CreateCoursePostResponse>(
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
