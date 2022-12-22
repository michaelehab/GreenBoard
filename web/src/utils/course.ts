import {
  CourseEnrollRequest,
  CourseEnrollResponse,
  CreateCourseRequest,
  CreateCourseResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function createCourse(
  courseCode: string,
  name: string,
  password: string
) {
  const res = await callEndpoint<CreateCourseRequest, CreateCourseResponse>(
    "/course/",
    "POST",
    false,
    {
      courseCode,
      name,
      password,
    }
  );
}

export async function joinCourse(courseId: string, password: string) {
  const res = await callEndpoint<CourseEnrollRequest, CourseEnrollResponse>(
    "/course/join",
    "POST",
    false,
    {
      courseId,
      password,
    }
  );
}
