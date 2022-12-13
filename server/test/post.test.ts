import {
  CourseEnrollRequest,
  CreateCourseRequest,
  CreatePostRequest,
} from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR2,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_STUDENT,
  SEED_STUDENT2,
  SEED_STUDENT_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Posts tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let coursePostId: string;
  let studentQuestionId: string;
  let studentNotInCourseAuthHeader: object;
  let instructorNotInCourseAuthHeader: object;

  const coursePost: CreatePostRequest = {
    title: "First Post title",
    url: "https://www.google.com",
    content: "This is a post content",
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

    studentNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/student/signin",
      SEED_STUDENT2.email,
      SEED_STUDENT_PASSWORD
    );

    instructorNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/instructor/signin",
      SEED_INSTRUCTOR2.email,
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

    it("Create a new course post as instructor in course -- POST /api/v1/course/:id/post returns 200", async () => {
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

    it("Create a new course post as instructor in course invalid url -- POST /api/v1/course/:id/post returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send({
          title: "First Post title",
          url: "www.google",
          content: "This is a post content",
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as instructor not in course -- POST /api/v1/course/:id/post returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/post`)
        .send(coursePost)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
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

    it("Create a new course post with missing field as instructor in course -- POST /api/v1/course/:id/post returns 400", async () => {
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

    it("Get Course Posts as student in course-- GET /api/v1/course/:id/post returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.posts).toHaveLength(1);
      expect(result.body.posts[0].title).toBe(coursePost.title);
      expect(result.body.posts[0].url).toBe(coursePost.url);
    });

    it("Get Course Posts as student not in course -- GET /api/v1/course/:id/post returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as student invalid course -- GET /api/v1/course/:id/post returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/invalidCourseId/post`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as instructor in course -- GET /api/v1/course/:id/post returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.posts).toHaveLength(1);
      expect(result.body.posts[0].title).toBe(coursePost.title);
      expect(result.body.posts[0].url).toBe(coursePost.url);
    });

    it("Get Course Posts as instructor not in course -- GET /api/v1/course/:id/post returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as instructor invalid course -- GET /api/v1/course/:id/post returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/InvalidCourseId/post`)
        .set(instructorNotInCourseAuthHeader)
        .expect(404);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Specific Course Post as student in course -- GET /api/v1/course/:id/post/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/${coursePostId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.post.title).toBe(coursePost.title);
      expect(result.body.post.url).toBe(coursePost.url);
    });
    it("Get Specific Course Post as student not in course -- GET /api/v1/course/:id/post/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/${coursePostId}`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Get Specific Course Post as instructor in course -- GET /api/v1/course/:id/post/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/${coursePostId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.post.title).toBe(coursePost.title);
      expect(result.body.post.url).toBe(coursePost.url);
    });
    it("Get Specific Course Post as instructor not in course -- GET /api/v1/course/:id/post/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/${coursePostId}`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Get Specific Course Post as unauthorized -- GET /api/v1/course/:id/post/:id returns 401", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/${coursePostId}`)
        .expect(401);
      expect(result.body.post).toBeUndefined();
    });
  });

  describe("Creating Students Questions", () => {
    it("Create a new student question as a student in course -- POST /api/v1/course/:id/question returns 200", async () => {
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

    it("Create a new student question as a student in course invalid url -- POST /api/v1/course/:id/question returns 400", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as a student not in course -- POST /api/v1/course/:id/question returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .set(studentNotInCourseAuthHeader)
        .expect(200);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as instructor -- POST /api/v1/course/:id/question returns 403", async () => {
      const result = await client
        .post(`/api/v1/course/${SEED_COURSE.id}/question`)
        .send(coursePost)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Send empty object as student in course -- POST /api/v1/course/:id/question returns 400", async () => {
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

    it("Create a new student question with missing field as student in course -- POST /api/v1/course/:id/question returns 400", async () => {
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

    it("Get Students Questions as student in course-- GET /api/v1/course/:id/question returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.questions).toHaveLength(1);
      expect(result.body.questions[0].title).toBe(coursePost.title);
      expect(result.body.questions[0].url).toBe(coursePost.url);
    });

    it("Get Students Questions as student not in course -- GET /api/v1/course/:id/question returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as student invalid course -- GET /api/v1/course/:id/question returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(studentNotInCourseAuthHeader)
        .expect(404);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as instructor in course -- GET /api/v1/course/:id/question returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.questions).toHaveLength(1);
      expect(result.body.questions[0].title).toBe(coursePost.title);
      expect(result.body.questions[0].url).toBe(coursePost.url);
    });
    it("Get Students Questions as instructor not in course -- GET /api/v1/course/:id/question returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as instructor with invalid course -- GET /api/v1/course/:id/question returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question`)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Specific Student Question as student in course -- GET /api/v1/course/:id/question/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question/${studentQuestionId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.question.title).toBe(coursePost.title);
      expect(result.body.question.url).toBe(coursePost.url);
    });
    it("Get Specific Student Question as student not in course -- GET /api/v1/course/:id/question/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question/${studentQuestionId}`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Get Specific Student Question as instructor in course -- GET /api/v1/course/:id/question/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question/${studentQuestionId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.question.title).toBe(coursePost.title);
      expect(result.body.question.url).toBe(coursePost.url);
    });
    it("Get Specific Student Question as instructor not in course -- GET /api/v1/course/:id/question/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question/${studentQuestionId}`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Get Specific Student Question as unauthorized -- GET /api/v1/course/:id/question/:id returns 401", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/question/${studentQuestionId}`)
        .expect(401);
      expect(result.body.question).toBeUndefined();
    });
  });
});
