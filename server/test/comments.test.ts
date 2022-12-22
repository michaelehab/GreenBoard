import {
  CourseEnrollRequest,
  CreateCommentRequest,
  CreateCourseRequest,
  CreateInstructorAnswerRequest,
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
  SEED_STUDENT_QUESTION,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Posts tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let studentNotInCourseAuthHeader: object;
  let instructorNotInCourseAuthHeader: object;
  let postCommentId: string;
  let instructorAnswerId: string;

  const postComment: CreateCommentRequest = {
    comment: "This is a post comment",
  };
  const instructorAnswer: CreateInstructorAnswerRequest = {
    comment: "This is an instructor answer",
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
    it("Create a new post comment as a student -- POST /api/v1/courses/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment).toBeDefined();
      expect(result.body.postComment.comment).toEqual(postComment.comment);
    });

    it("Create a new post comment as instructor -- POST /api/v1/courses/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment).toBeDefined();
      expect(result.body.postComment.comment).toEqual(postComment.comment);

      postCommentId = result.body.postComment.id;
    });

    it("Create a new post comment as instructor not in course -- POST /api/v1/courses/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Send empty object as instructor in course -- POST /api/v1/courses/:courseId/post/:id/comment returns 400", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Send empty object as student in course -- POST /api/v1/courses/:courseId/post/:id/comment returns 400", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send({})
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Create a new post comment as unauthorized -- POST /api/v1/courses/:courseId/post/:id/comment returns 401", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .send(postComment)
        .expect(401);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as student in course-- GET /api/v1/courses/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment).toHaveLength(2);
      expect(result.body.postComment[0].comment).toBe(postComment.comment);
    });

    it("Get Post commets as student not in course -- GET /api/v1/courses/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as student invalid post -- GET /api/v1/courses/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/post/invalidPostId/comment`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as instructor in course -- GET /api/v1/courses/:courseId/post/:id/comment returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment).toHaveLength(2);
      expect(result.body.postComment[0].comment).toBe(postComment.comment);
    });

    it("Get Posts comments as instructor not in course -- GET /api/v1/courses/:courseId/post/:id/comment returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as instructor invalid post -- GET /api/v1/courses/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/post/InvalidPostId/comment`)
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });
    it("Get Posts comments as instructor invalid course -- GET /api/v1/courses/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/invalidCourseId/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Posts comments as student invalid post -- GET /api/v1/courses/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}/post/InvalidPostId/comment`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });
    it("Get Posts comments as student invalid course -- GET /api/v1/courses/:courseId/post/:id/comment returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/invalidCourseId/post/${SEED_COURSE_POST.id}/comment`
        )
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as student in course -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.postComment.comment).toBe(postComment.comment);
    });
    it("Get Specific Post comment as student not in course -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as instructor in course -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.postComment.comment).toBe(postComment.comment);
    });
    it("Get Specific Post comment as instructor in course (wrong course) -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/InvalidCourseId/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });
    it("Get Specific Post comment as instructor in course (wrong post) -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/InvalidPostId/comment/${postCommentId}`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });
    it("Get Specific Post comment as instructor in course (wrong comment) -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/invalidCommentId`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.postComment).toBeUndefined();
    });
    it("Get Specific Post comment as instructor not in course -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.postComment).toBeUndefined();
    });

    it("Get Specific Post comment as unauthorized -- GET /api/v1/courses/:courseId/post/:id/comment/:id returns 401", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/post/${SEED_COURSE_POST.id}/comment/${postCommentId}`
        )
        .expect(401);
      expect(result.body.postComment).toBeUndefined();
    });
  });

  describe("Creating Instructor Answers", () => {
    it("Create a new instructor answer as a student -- POST /api/v1/courses/:courseId/question/:id/answer returns 403", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send(instructorAnswer)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Create a new instructor answer as instructor -- POST /api/v1/courses/:courseId/question/:id/answer returns 200", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send(instructorAnswer)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.instructorAnswer).toBeDefined();
      expect(result.body.instructorAnswer.comment).toEqual(
        instructorAnswer.comment
      );

      instructorAnswerId = result.body.instructorAnswer.id;
    });

    it("Create a new instructor answer as instructor not in course -- POST /api/v1/courses/:courseId/question/:id/answer returns 403", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send(instructorAnswer)
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Send empty object as instructor in course -- POST /api/v1/courses/:courseId/question/:id/answer returns 400", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
    });

    it("Send empty object as student in course -- POST /api/v1/courses/:courseId/question/:id/answer returns 400", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send({})
        .set(studentAuthHeader)
        .expect(400);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Create a new instructor answer as unauthorized -- POST /api/v1/courses/:courseId/question/:id/answer returns 401", async () => {
      const result = await client
        .post(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .send(instructorAnswer)
        .expect(401);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get instructor answers student in course-- GET /api/v1/courses/:courseId/question/:id/answer returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.instructorAnswer).toHaveLength(1);
      expect(result.body.instructorAnswer[0].comment).toBe(
        instructorAnswer.comment
      );
    });

    it("Get instructor answer as student not in course -- GET /api/v1/courses/:courseId/question/:id/answer returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get instructor answer as student invalid post -- GET /api/v1/courses/:courseId/question/:id/answer returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/invalidQuestionId/answer`
        )
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get instructor answer as instructor in course -- GET /api/v1/courses/:courseId/question/:id/answer returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.instructorAnswer).toHaveLength(1);
      expect(result.body.instructorAnswer[0].comment).toBe(
        instructorAnswer.comment
      );
    });

    it("Get instructor answer as instructor not in course -- GET /api/v1/courses/:courseId/question/:id/answer returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get instructor answer as instructor invalid post -- GET /api/v1/courses/:courseId/question/:id/answer returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/invalidQuestionId/answer`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
    it("Get instructor answer as instructor invalid course -- GET /api/v1/courses/:courseId/question/:id/answer returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/invalidCourseId/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get instructor answer as student invalid post -- GET /api/v1/courses/:courseId/question/:id/answer returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/invalidQuestionId/answer`
        )
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
    it("Get instructor answer as student invalid course -- GET /api/v1/courses/:courseId/question/:id/answer returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/invalidCourseId/question/${SEED_STUDENT_QUESTION.id}/answer`
        )
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get Specific instructor answer as student in course -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.instructorAnswer.comment).toBe(
        instructorAnswer.comment
      );
    });
    it("Get Specific instructor answer as student not in course -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .set(studentNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get Specific instructor answer as instructor in course -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 200", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.instructorAnswer.comment).toBe(
        instructorAnswer.comment
      );
    });
    it("Get Specific instructor answer as instructor in course (wrong course) -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/invalidCourseId/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
    it("Get Specific instructor answer as instructor in course (wrong question) -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/invalidQuestionId/answer/${instructorAnswerId}`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
    it("Get Specific instructor answer as instructor in course (wrong answer) -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 404", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/invalidAnswerId`
        )
        .set(instructorAuthHeader)
        .expect(404);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
    it("Get Specific instructor answer as instructor not in course -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 403", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .set(instructorNotInCourseAuthHeader)
        .expect(403);
      expect(result.body.instructorAnswer).toBeUndefined();
    });

    it("Get Specific instructor answer as unauthorized -- GET /api/v1/courses/:courseId/question/:id/answer/:id returns 401", async () => {
      const result = await client
        .get(
          `/api/v1/courses/${SEED_COURSE.id}/question/${SEED_STUDENT_QUESTION.id}/answer/${instructorAnswerId}`
        )
        .expect(401);
      expect(result.body.instructorAnswer).toBeUndefined();
    });
  });
});
