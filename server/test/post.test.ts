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
      "/api/v1/students/signin",
      SEED_STUDENT.email,
      SEED_STUDENT_PASSWORD
    );

    instructorAuthHeader = await getAuthToken(
      "/api/v1/instructors/signin",
      SEED_INSTRUCTOR.email,
      SEED_INSTRUCTOR_PASSWORD
    );

    studentNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/students/signin",
      SEED_STUDENT2.email,
      SEED_STUDENT_PASSWORD
    );

    instructorNotInCourseAuthHeader = await getAuthToken(
      "/api/v1/instructors/signin",
      SEED_INSTRUCTOR2.email,
      SEED_INSTRUCTOR_PASSWORD
    );
  });

  describe("Creating Course Posts", () => {
    it("Create a new course post as a student -- POST /api/v1/courses/:id/posts returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send(coursePost)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as instructor in course -- POST /api/v1/courses/:id/posts returns 200", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send(coursePost)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.post).toBeDefined();
      expect(result.body.post.title).toEqual(coursePost.title);
      expect(result.body.post.url).toEqual(coursePost.url);
      expect(result.body.post.content).toEqual(coursePost.content);

      coursePostId = result.body.post.id;
    });

    it("Create a new course post as instructor in course invalid url -- POST /api/v1/courses/:id/posts returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send({
          title: "First Post title",
          url: "www.google",
          content: "This is a post content",
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as instructor not in course -- POST /api/v1/courses/:id/posts returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send(coursePost)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Send empty object as instructor -- POST /api/v1/courses/:id/posts returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post as unauthorized -- POST /api/v1/courses/:id/posts returns 401", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send(coursePost)
        .expect(401);
      expect(result.body.post).toBeUndefined();
    });

    it("Create a new course post with missing field as instructor in course -- POST /api/v1/courses/:id/posts returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .send({
          title: "this is a title",
          content: "content",
          courseId: SEED_COURSE.id,
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.post).toBeUndefined();
    });

    it("Get Course Posts as student in course-- GET /api/v1/courses/:id/posts returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.posts).toHaveLength(2); // 1 Seeded + 1 tested
      expect(result.body.posts[0].title).toBe(coursePost.title);
      expect(result.body.posts[0].url).toBe(coursePost.url);
      expect(result.body.posts[0].firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.posts[0].lastName).toBe(SEED_INSTRUCTOR.lastName);
      expect(result.body.posts[1].firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.posts[1].lastName).toBe(SEED_INSTRUCTOR.lastName);
    });

    it("Get Course Posts as student not in course -- GET /api/v1/courses/:id/posts returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as student invalid course -- GET /api/v1/courses/:id/posts returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/invalidCourseId/posts`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as instructor in course -- GET /api/v1/courses/:id/posts returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.posts).toHaveLength(2); // 1 Seeded + 1 tested
      expect(result.body.posts[0].title).toBe(coursePost.title);
      expect(result.body.posts[0].url).toBe(coursePost.url);
      expect(result.body.posts[0].firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.posts[0].lastName).toBe(SEED_INSTRUCTOR.lastName);
      expect(result.body.posts[1].firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.posts[1].lastName).toBe(SEED_INSTRUCTOR.lastName);
    });

    it("Get Course Posts as instructor not in course -- GET /api/v1/courses/:id/posts returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Course Posts as instructor invalid course -- GET /api/v1/courses/:id/posts returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/InvalidCourseId/posts`)
        .set(instructorNotInCourseAuthHeader)
        .expect(404);
      expect(result.body.posts).toBeUndefined();
    });

    it("Get Specific Course Post as student in course -- GET /api/v1/courses/:id/posts/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts/${coursePostId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.post.title).toBe(coursePost.title);
      expect(result.body.post.url).toBe(coursePost.url);
      expect(result.body.post.firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.post.lastName).toBe(SEED_INSTRUCTOR.lastName);
    });
    it("Get Specific Course Post as student not in course -- GET /api/v1/courses/:id/posts/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts/${coursePostId}`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Get Specific Course Post as instructor in course -- GET /api/v1/courses/:id/posts/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts/${coursePostId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.post.title).toBe(coursePost.title);
      expect(result.body.post.url).toBe(coursePost.url);
      expect(result.body.post.firstName).toBe(SEED_INSTRUCTOR.firstName);
      expect(result.body.post.lastName).toBe(SEED_INSTRUCTOR.lastName);
    });
    it("Get Specific Course Post as instructor not in course -- GET /api/v1/courses/:id/posts/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts/${coursePostId}`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.post).toBeUndefined();
    });

    it("Get Specific Course Post as unauthorized -- GET /api/v1/courses/:id/posts/:id returns 401", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/posts/${coursePostId}`)
        .expect(401);
      expect(result.body.post).toBeUndefined();
    });
  });

  describe("Creating Students Questions", () => {
    it("Create a new student question as a student in course -- POST /api/v1/courses/:id/questions returns 200", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send(coursePost)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.question).toBeDefined();
      expect(result.body.question.title).toEqual(coursePost.title);
      expect(result.body.question.url).toEqual(coursePost.url);
      expect(result.body.question.content).toEqual(coursePost.content);

      studentQuestionId = result.body.question.id;
    });

    it("Create a new student question as a student in course invalid url -- POST /api/v1/courses/:id/questions returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send({
          title: "First Post title",
          url: "www.google",
          content: "This is a post content",
        })
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as a student not in course -- POST /api/v1/courses/:id/questions returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send(coursePost)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as instructor -- POST /api/v1/courses/:id/questions returns 403", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send(coursePost)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Send empty object as student in course -- POST /api/v1/courses/:id/questions returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send({})
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question as unauthorized -- POST /api/v1/courses/:id/questions returns 401", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send(coursePost)
        .expect(401);
      expect(result.body.question).toBeUndefined();
    });

    it("Create a new student question with missing field as student in course -- POST /api/v1/courses/:id/questions returns 400", async () => {
      const result = await client
        .post(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .send({
          title: "this is a title",
          content: "content",
          courseId: SEED_COURSE.id,
        })
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.question).toBeUndefined();
    });

    it("Get Students Questions as student in course-- GET /api/v1/courses/:id/questions returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.questions).toHaveLength(2);
      expect(result.body.questions[0].title).toBe(coursePost.title);
      expect(result.body.questions[0].url).toBe(coursePost.url);
      expect(result.body.questions[0].firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.questions[0].lastName).toBe(SEED_STUDENT.lastName);
      expect(result.body.questions[1].firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.questions[1].lastName).toBe(SEED_STUDENT.lastName);
    });

    it("Get Students Questions as student not in course -- GET /api/v1/courses/:id/questions returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as student invalid course -- GET /api/v1/courses/:id/questions returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/InvalidCourseId/questions`)
        .set(studentNotInCourseAuthHeader)
        .expect(404);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as instructor in course -- GET /api/v1/courses/:id/questions returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.questions).toHaveLength(2);
      expect(result.body.questions[0].title).toBe(coursePost.title);
      expect(result.body.questions[0].url).toBe(coursePost.url);
      expect(result.body.questions[0].firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.questions[0].lastName).toBe(SEED_STUDENT.lastName);
      expect(result.body.questions[1].firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.questions[1].lastName).toBe(SEED_STUDENT.lastName);
    });
    it("Get Students Questions as instructor not in course -- GET /api/v1/courses/:id/questions returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Students Questions as instructor with invalid course -- GET /api/v1/courses/:id/questions returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/InvalidCourseId/questions`)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.questions).toBeUndefined();
    });

    it("Get Specific Student Question as student in course -- GET /api/v1/courses/:id/questions/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions/${studentQuestionId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.question.title).toBe(coursePost.title);
      expect(result.body.question.url).toBe(coursePost.url);
      expect(result.body.question.firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.question.lastName).toBe(SEED_STUDENT.lastName);
    });
    it("Get Specific Student Question as student not in course -- GET /api/v1/courses/:id/questions/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions/${studentQuestionId}`)
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Get Specific Student Question as instructor in course -- GET /api/v1/courses/:id/questions/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions/${studentQuestionId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.question.title).toBe(coursePost.title);
      expect(result.body.question.url).toBe(coursePost.url);
      expect(result.body.question.firstName).toBe(SEED_STUDENT.firstName);
      expect(result.body.question.lastName).toBe(SEED_STUDENT.lastName);
    });
    it("Get Specific Student Question as instructor not in course -- GET /api/v1/courses/:id/questions/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions/${studentQuestionId}`)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.question).toBeUndefined();
    });

    it("Get Specific Student Question as unauthorized -- GET /api/v1/courses/:id/questions/:id returns 401", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/questions/${studentQuestionId}`)
        .expect(401);
      expect(result.body.question).toBeUndefined();
    });
  });
});
