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
  await callEndpoint<CreateCourseRequest, CreateCourseResponse>(
    "/courses/",
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
  await callEndpoint<CourseEnrollRequest, CourseEnrollResponse>(
    "/courses/join",
    "POST",
    false,
    {
      courseId,
      password,
    }
  );
}
