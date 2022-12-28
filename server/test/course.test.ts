import { CourseEnrollRequest, CreateCourseRequest } from "@greenboard/shared";
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

describe("Course tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let studentNotInSameDeptAuthHeader: object;
  let instructorNotInSameDeptAuthHeader: object;

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
      "/api/v1/students/signin",
      SEED_STUDENT.email,
      SEED_STUDENT_PASSWORD
    );

    instructorAuthHeader = await getAuthToken(
      "/api/v1/instructors/signin",
      SEED_INSTRUCTOR.email,
      SEED_INSTRUCTOR_PASSWORD
    );

    studentNotInSameDeptAuthHeader = await getAuthToken(
      "/api/v1/students/signin",
      SEED_STUDENT2.email,
      SEED_STUDENT_PASSWORD
    );

    instructorNotInSameDeptAuthHeader = await getAuthToken(
      "/api/v1/instructors/signin",
      SEED_INSTRUCTOR2.email,
      SEED_INSTRUCTOR_PASSWORD
    );
  });

  describe("Creating Courses", () => {
    it("Create a new course as a student -- POST /api/v1/courses returns 403", async () => {
      const result = await client
        .post("/api/v1/courses/")
        .send(course)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course as instructor -- POST /api/v1/courses/ returns 200", async () => {
      const result = await client
        .post("/api/v1/courses/")
        .send(course)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.course).toBeDefined();
      expect(result.body.course.name).toEqual(course.name);
      expect(result.body.course.courseCode).toEqual(course.courseCode);

      enroll.courseId = result.body.course.id;
    });

    it("Create the same course again as instructor -- POST /api/v1/courses returns 403", async () => {
      const result = await client
        .post("/api/v1/courses/")
        .send(course)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.course).toBeUndefined();
    });

    it("Send empty object as instructor -- POST /api/v1/courses/signup returns 400", async () => {
      const result = await client
        .post("/api/v1/courses/")
        .send({})
        .set(instructorAuthHeader)
        .expect(400);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course as unauthorized -- POST /api/v1/courses/ returns 401", async () => {
      const result = await client
        .post("/api/v1/courses/")
        .send(course)
        .expect(401);
      expect(result.body.course).toBeUndefined();
    });

    it("Create a new course with missing field as instructor -- POST /api/v1/courses/ returns 400", async () => {
      const result = await client
        .post("/api/v1/courses/")
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
    it("Enroll in existing course as Instructor (created course) in same department -- POST /api/v1/courses/join returns 403", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send(enroll)
        .set(instructorAuthHeader)
        .expect(403);
    });

    it("Enroll in existing course as Instructor not in same department -- POST /api/v1/courses/join returns 200", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send(enroll)
        .set(instructorNotInSameDeptAuthHeader)
        .expect(200);
    });

    it("Enroll in existing course as Student wrong password -- POST /api/v1/courses/join returns 400", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send({
          courseId: enroll.courseId,
          password: "veryWrongLongPassword",
        })
        .set(studentAuthHeader)
        .expect(400);
    });

    it("Enroll in existing course as Student in same department -- POST /api/v1/courses/join returns 200", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send(enroll)
        .set(studentAuthHeader)
        .expect(200);
    });

    it("Enroll in existing course as Student not in same department -- POST /api/v1/courses/join returns 403", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send(enroll)
        .set(studentNotInSameDeptAuthHeader)
        .expect(403);
    });

    it("Try to enroll with invalid course as Student -- POST /api/v1/courses/join returns 404", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(studentAuthHeader)
        .expect(404);
    });

    it("Try to enroll with invalid course as Instructor -- POST /api/v1/courses/join returns 404", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send({
          courseId: "abcd",
          password: "pass",
        })
        .set(instructorAuthHeader)
        .expect(404);
    });

    it("Try to enroll with missing field as Student -- POST /api/v1/courses/join returns 400", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send({
          courseId: "abcd",
        })
        .set(studentAuthHeader)
        .expect(400);
    });

    it("Try to enroll with missing field as Instructor -- POST /api/v1/courses/join returns 400", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send({
          courseId: "abcd",
        })
        .set(instructorAuthHeader)
        .expect(400);
    });

    it("Try to enroll in a course unauthorized -- POST /api/v1/courses/join returns 401", async () => {
      const result = await client
        .post("/api/v1/courses/join")
        .send(enroll)
        .expect(401);
    });
  });

  describe("Get Courses", () => {
    it("Get Course Data as Student in course -- GET /api/v1/courses/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}`)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.course.id).toEqual(SEED_COURSE.id);
      expect(result.body.course.courseCode).toEqual(SEED_COURSE.courseCode);
      expect(result.body.course.name).toEqual(SEED_COURSE.name);
    });

    it("Get Course Data as Student not in course -- GET /api/v1/courses/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}`)
        .set(studentNotInSameDeptAuthHeader)
        .expect(403);
    });

    it("Get Course Data as Student Wrong course -- GET /api/v1/courses/:id returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/InvalidCourseId`)
        .set(studentAuthHeader)
        .expect(404);
    });

    it("Get Course Data as Instructor in course -- GET /api/v1/courses/:id returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}`)
        .set(instructorAuthHeader)
        .expect(200);

      expect(result.body.course.id).toEqual(SEED_COURSE.id);
      expect(result.body.course.courseCode).toEqual(SEED_COURSE.courseCode);
      expect(result.body.course.name).toEqual(SEED_COURSE.name);
    });

    it("Get Course Data as Instructor not in course -- GET /api/v1/courses/:id returns 403", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}`)
        .set(instructorNotInSameDeptAuthHeader)
        .expect(403);
    });

    it("Get Course Data as Instructor Wrong course -- GET /api/v1/courses/:id returns 404", async () => {
      const result = await client
        .get(`/api/v1/courses/InvalidCourseId`)
        .set(instructorAuthHeader)
        .expect(404);
    });

    it("Get Course Data as Unauthorized -- GET /api/v1/courses/:id returns 401", async () => {
      const result = await client
        .get(`/api/v1/courses/${SEED_COURSE.id}`)
        .expect(401);
    });

    it("List Enrolled Courses as Student -- GET /api/v1/courses returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses`)
        .set(studentAuthHeader)
        .expect(200);

      expect(result.body.courses).toHaveLength(2);
      expect(result.body.courses[0].id).toEqual(SEED_COURSE.id);
      expect(result.body.courses[0].courseCode).toEqual(SEED_COURSE.courseCode);
      expect(result.body.courses[0].name).toEqual(SEED_COURSE.name);
    });

    it("List Enrolled Courses as Instructor -- GET /api/v1/courses returns 200", async () => {
      const result = await client
        .get(`/api/v1/courses`)
        .set(instructorAuthHeader)
        .expect(200);

      expect(result.body.courses).toHaveLength(2);
      expect(result.body.courses[0].id).toEqual(SEED_COURSE.id);
      expect(result.body.courses[0].courseCode).toEqual(SEED_COURSE.courseCode);
      expect(result.body.courses[0].name).toEqual(SEED_COURSE.name);
    });

    it("List Enrolled Courses as Unauthorized -- GET /api/v1/courses returns 401", async () => {
      const result = await client.get(`/api/v1/courses`).expect(401);

      expect(result.body.courses).toBeUndefined();
    });
  });
});
