import { CourseEnrollRequest, CreateCourseRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
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

  const course: CreateCourseRequest = {
    name: "Course1",
    courseCode: "Code1",
    password: "password",
  };

  const enroll: CourseEnrollRequest = {
    courseId: "", // To be filled with the id after course creation
    password: course.password,
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

  describe("Creating Courses", () => {
    it("Create a new course as a student -- POST /api/v1/course returns 403", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course as instructor -- POST /api/v1/course/ returns 200", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.course).toBeDefined();
      expect(result.body.course.name).toEqual(course.name);
      expect(result.body.course.courseCode).toEqual(course.courseCode);

      enroll.courseId = result.body.course.id;
    });

    it("Create the same course again as instructor -- POST /api/v1/course returns 403", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send(course)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Send empty object as instructor -- POST /api/v1/course/signup returns 400", async () => {
      const result = await client
        .post("/api/v1/course/")
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
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
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.course).toBeUndefined();
    });
  });

  describe("Enroll in Course", () => {
    it("Enroll in existing course as Instructor -- POST /api/v1/course/join returns 200", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send(enroll)
        .set(instructorAuthHeader)
        .expect(200);
    });

    it("Enroll in existing course as Student wrong password -- POST /api/v1/course/join returns 400", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: enroll.courseId,
          password: "veryWrongLongPassword",
        })
        .set(studentAuthHeader)
        .expect(400);
    });

    it("Enroll in existing course as Student -- POST /api/v1/course/join returns 200", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send(enroll)
        .set(studentAuthHeader)
        .expect(200);
    });

    it("Try to enroll with invalid course as Student -- POST /api/v1/course/join returns 404", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(studentAuthHeader)
        .expect(404);
    });

    it("Try to enroll with invalid course as Instructor -- POST /api/v1/course/join returns 404", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(instructorAuthHeader)
        .expect(404);
    });

    it("Try to enroll with missing field as Student -- POST /api/v1/course/join returns 400", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
        })
        .set(studentAuthHeader)
        .expect(400);
    });

    it("Try to enroll with missing field as Instructor -- POST /api/v1/course/join returns 400", async () => {
      const result = await client
        .post("/api/v1/course/join")
        .send({
          courseId: "abcd",
        })
        .set(instructorAuthHeader)
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
