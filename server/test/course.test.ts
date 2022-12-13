import {
  CourseEnrollRequest,
  CreateCourseRequest,
  CreatePostRequest,
} from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_STUDENT,
  SEED_STUDENT_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Course tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let coursePostId: string;
  let studentQuestionId: string;

  const coursePost: CreatePostRequest = {
    title: "First Post title",
    url: "https://www.google.com",
    content: "This is a post content",
    courseId: SEED_COURSE.id,
  };

  beforeAll(async () => {
    client = await getTestServer();

    studentAuthHeader = await getAuthToken(
      "/api/v1/student/signin",
      SEED_STUDENT.email,
      SEED_STUDENT_PASSWORD
    );

    instructorAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR.email,
      SEED_INSTRUCTOR_PASSWORD
    );
  });

  describe("Creating Course Posts", () => {
    it("Create a new course post as a student -- POST /api/v1/course/:id/post returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send(coursePost)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as instructor -- POST /api/v1/course/:id/post returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send(coursePost)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.post).toBeDefined();
      expect(result.body.post.title).toEqual(coursePost.title);
      expect(result.body.post.url).toEqual(coursePost.url);
      expect(result.body.post.content).toEqual(coursePost.content);

      coursePostId = result.body.post.id;
    });

    it("Send empty object as instructor -- POST /api/v1/course/:id/post returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as unauthorized -- POST /api/v1/course/:id/post returns 401", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send(coursePost)
        .expect(401);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post with missing field as instructor -- POST /api/v1/course/:id/post returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send({
          title: "this is a title",
          content: "content",
          courseId: SEED_COURSE.id,
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it(
      "Get Course Posts as student in course-- GET /api/v1/course/:id/post returns 200"
    );
    it(
      "Get Course Posts as student not in course -- GET /api/v1/course/:id/post/:id returns 403"
    );

    it(
      "Get Course Posts as instructor in course -- GET /api/v1/course/:id/post returns 200"
    );
    it(
      "Get Course Posts as instructor not in course -- GET /api/v1/course/:id/post returns 403"
    );

    it(
      "Get Specific Course Post as student in course -- GET /api/v1/course/:id/post/:id returns 200"
    );
    it(
      "Get Specific Course Post as student not in course -- GET /api/v1/course/:id/post/:id returns 403"
    );

    it(
      "Get Specific Course Post as instructor in course -- GET /api/v1/course/:id/post/:id returns 200"
    );
    it(
      "Get Specific Course Post as instructor not in course -- GET /api/v1/course/:id/post/:id returns 403"
    );

    it(
      "Get Specific Course Post as unauthorized -- GET /api/v1/course/:id/post/:id returns 401"
    );
  });

  describe("Creating Students Questions", () => {
    it("Create a new student question as a student -- POST /api/v1/course/:id/question returns 200", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.question).toBeDefined();
      expect(result.body.question.title).toEqual(coursePost.title);
      expect(result.body.question.url).toEqual(coursePost.url);
      expect(result.body.question.content).toEqual(coursePost.content);
      expect(result.body.question).toBeUndefined();

      studentQuestionId = result.body.question.id;
    });

    it("Create a new student question as instructor -- POST /api/v1/course/:id/question returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Send empty object as student -- POST /api/v1/course/:id/question returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send({})
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as unauthorized -- POST /api/v1/course/:id/question returns 401", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .expect(401);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question with missing field as student -- POST /api/v1/course/:id/question returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send({
          title: "this is a title",
          content: "content",
          courseId: SEED_COURSE.id,
        })
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });
  });
});
