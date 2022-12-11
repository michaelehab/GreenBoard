import { CourseEnrollRequest, CreateCourseRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSES,
  SEED_INSTRUCTORS,
  SEED_STUDENTS,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Course tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

  const course: CreateCourseRequest = {
    name: "Course1",
    courseCode: "Code1",
    password: "password",
  };

  const enroll: CourseEnrollRequest = {
    courseId: SEED_COURSES[0].id,
    password: SEED_COURSES[0].password,
  };

  beforeAll(async () => {
    client = await getTestServer();
  });

  describe("Creating Courses", () => {
    it("Create a new course as a student -- POST /api/v1/college returns 403", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_STUDENTS[0].email,
            SEED_STUDENTS[0].password
          )
        )
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course as instructor -- POST /api/v1/course/ returns 200", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(200);
      expect(result.body.course).toBeDefined();
      expect(result.body.course.name).toEqual(course.name);
      expect(result.body.course.courseCode).toEqual(course.courseCode);
    });

    it("Create the same course again as instructor -- POST /api/v1/college returns 403", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Send empty object as instructor -- POST /api/v1/college/signup returns 400", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send({})
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(200);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course as unauthorized -- POST /api/v1/course/ returns 401", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .expect(401);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course with missing field as instructor -- POST /api/v1/course/ returns 400", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send({
          name: "Course1",
          password: "password",
        })
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(400);
      expect(result.body.course).toBeUndefined();
    });
  });

  describe("Enroll in Course", () => {
    it("Enroll in existing course as Instructor -- POST /api/v1/course/join returns 200", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send(enroll)
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(200);
    });

    it("Enroll in existing course as Student -- POST /api/v1/course/join returns 200", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send(enroll)
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_STUDENTS[0].email,
            SEED_STUDENTS[0].password
          )
        )
        .expect(200);
    });

    it("Try to enroll with invalid course as Student -- POST /api/v1/course/join returns 404", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_STUDENTS[0].email,
            SEED_STUDENTS[0].password
          )
        )
        .expect(404);
    });

    it("Try to enroll with invalid course as Instructor -- POST /api/v1/course/join returns 404", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(404);
    });

    it("Try to enroll with missing field as Student -- POST /api/v1/course/join returns 400", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
        })
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_STUDENTS[0].email,
            SEED_STUDENTS[0].password
          )
        )
        .expect(400);
    });

    it("Try to enroll with missing field as Instructor -- POST /api/v1/course/join returns 400", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
        })
        .set(
          await getAuthToken(
            "/api/v1/college/signin",
            SEED_INSTRUCTORS[0].email,
            SEED_INSTRUCTORS[0].password
          )
        )
        .expect(400);
    });

    it("Try to enroll in a course unauthorized -- POST /api/v1/course/join returns 401", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send(enroll)
        .expect(401);
    });
  });
});
