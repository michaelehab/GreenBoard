import {
  CourseEnrollRequest,
  CreateCommentRequest,
  CreateCourseRequest,
} from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE_POST,
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
  let studentNotInCourseAuthHeader: object;
  let instructorNotInCourseAuthHeader: object;
  let postCommentId: string;

  const postComment: CreateCommentRequest = {
    comment: "This is a post comment",
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

  describe("Creating Post Comments", () => {
    it("Create a new post comment as a student -- POST /api/v1/course/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .post(
          `/api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment).toBeDefined();
      expect(result.body.postComment.comment).toEqual(postComment.comment);
    });

    it("Create a new post comment as instructor -- POST /api/v1/course/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .post(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment).toBeDefined();
      expect(result.body.postComment.comment).toEqual(postComment.comment);

      postCommentId = result.body.postComment.id;
    });

    it("Create a new post comment as instructor not in course -- POST /api/v1/course/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .post(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Send empty object as instructor -- POST /api/v1/course/:courseId/post/:id/comment returns 400", async () => {
      const result = await client
        .post(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Create a new post comment as unauthorized -- POST /api/v1/course/:courseId/post/:id/comment returns 401", async () => {
      const result = await client
        .post(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .expect(401);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Create a new post comment with missing field as instructor -- POST /api/v1/course/:courseId/post/:id/comment returns 400", async () => {
      const result = await client
        .post(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send({
          postId: SEED_COURSE_POST.id,
        })
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as student in course-- GET /api/v1/course/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment).toHaveLength(1);
      expect(result.body.postComment[0].comment).toBe(postComment.comment);
    });

    it("Get Post commets as student not in course -- GET /api/v1/course/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as student invalid post -- GET /api/v1/course/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/invalidPostId/comment`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as instructor in course -- GET /api/v1/course/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment).toHaveLength(1);
      expect(result.body.postComment[0].comment).toBe(postComment.comment);
    });

    it("Get Posts comments as instructor not in course -- GET /api/v1/course/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as instructor invalid post -- GET /api/v1/course/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(`/api/v1/course/${SEED_COURSE.id}/post/InvalidPostId/comment`)
        .set(instructorNotInCourseAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as student in course -- GET /api/v1/course/:courseId/post/:id/comment/:id returns 200", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment.comment).toBe(postComment.comment);
    });
    it("Get Specific Post comment as student not in course -- GET /api/v1/course/:courseId/post/:id/comment/:id returns 403", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as instructor in course -- GET /api/v1/course/:courseId/post/:id/comment/:id returns 200", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment.comment).toBe(postComment.comment);
    });
    it("Get Specific Post comment as instructor not in course -- GET /api/v1/course/:courseId/post/:id/comment/:id returns 403", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as unauthorized -- GET /api/v1/course/:courseId/post/:id/comment/:id returns 401", async () => {
      const result = await client
        .get(
          `api/v1/course/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .expect(401);
      expect(result.body.postComment).toBeUndefined();
    });
  });
});
