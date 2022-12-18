import { CreateAnnouncementRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COURSE,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR2,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_STUDENT,
  SEED_STUDENT2,
  SEED_STUDENT_PASSWORD,
  SEED_COLLEGE,
  SEED_DEPARTMENT,
  SEED_SCHOOL,
  SEED_COLLEGE_PASSWORD,
  SEED_DEPARTMENT_PASSWORD,
  SEED_SCHOOL_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Announcements tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let studentAuthHeader: object;
  let instructorAuthHeader: object;
  let collegeAuthHeader: object;
  let departmentAuthHeader: object;
  let schoolAuthHeader: object;
  let announcementId: string;

  const announcement: CreateAnnouncementRequest = {
    title: "First Announcement title",
    content: "This is an announcement content",
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

    collegeAuthHeader = await getAuthToken(
      "/api/v1/college/signin",
      SEED_COLLEGE.email,
      SEED_COLLEGE_PASSWORD
    );

    schoolAuthHeader = await getAuthToken(
      "/api/v1/school/signin",
      SEED_SCHOOL.email,
      SEED_SCHOOL_PASSWORD
    );

    departmentAuthHeader = await getAuthToken(
      "/api/v1/department/signin",
      SEED_DEPARTMENT.email,
      SEED_DEPARTMENT_PASSWORD
    );
  });

  describe("Creating Announcements", () => {
    it("Create a new announcement as a student -- POST /api/v1/announcements returns 403", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .set(studentAuthHeader)
        .expect(403);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Create a new announcement as an insturctor -- POST /api/v1/announcements returns 403", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .set(instructorAuthHeader)
        .expect(403);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Create a new announcement as a college -- POST /api/v1/announcements returns 200", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .set(collegeAuthHeader)
        .expect(200);
      expect(result.body.announcement).toBeDefined();
      expect(result.body.announcement.title).toEqual(announcement.title);
      expect(result.body.announcement.content).toEqual(announcement.content);
      announcementId = result.body.announcement.id;
    });
    it("Create a new announcement as a school -- POST /api/v1/announcements returns 200", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .set(schoolAuthHeader)
        .expect(200);
      expect(result.body.announcement).toBeDefined();
      expect(result.body.announcement.title).toEqual(announcement.title);
      expect(result.body.announcement.content).toEqual(announcement.content);
    });
    it("Create a new announcement as a department -- POST /api/v1/announcements returns 200", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .set(departmentAuthHeader)
        .expect(200);
      expect(result.body.announcement).toBeDefined();
      expect(result.body.announcement.title).toEqual(announcement.title);
      expect(result.body.announcement.content).toEqual(announcement.content);
    });

    it("Send empty object as department -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({})
        .set(departmentAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });
    it("Send empty object as school -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({})
        .set(schoolAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Send empty object as college -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({})
        .set(collegeAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Create a new announcement as unauthorized -- POST /api/v1/announcements returns 401", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send(announcement)
        .expect(401);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Create a new announcement with missing field as college -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({
          title: "this is a title",
        })
        .set(collegeAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });
    it("Create a new announcement with missing field as school -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({
          title: "this is a title",
        })
        .set(schoolAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });
    it("Create a new announcement with missing field as department -- POST /api/v1/announcements returns 400", async () => {
      const result = await client
        .post(`/api/v1/announcements`)
        .send({
          title: "this is a title",
        })
        .set(departmentAuthHeader)
        .expect(400);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Get announcements as student in college-- GET /api/v1/announcements returns 200", async () => {
      const result = await client
        .get(`/api/v1/announcements`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.announcement).toHaveLength(3);
      expect(result.body.announcement[0].title).toBe(announcement.title);
      expect(result.body.announcement[0].content).toBe(announcement.content);
    });
    it("Get announcements as instructor in college-- GET /api/v1/announcements returns 200", async () => {
      const result = await client
        .get(`/api/v1/announcements`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.announcement).toHaveLength(3);
      expect(result.body.announcement[0].title).toBe(announcement.title);
      expect(result.body.announcement[0].content).toBe(announcement.content);
    });

    it("Get announcements as instructor in college-- GET /api/v1/announcements returns 200", async () => {
      const result = await client
        .get(`/api/v1/announcements/${announcementId}`)
        .set(instructorAuthHeader)
        .expect(200);
      expect(result.body.announcement).toBeDefined();
      expect(result.body.announcement.title).toBe(announcement.title);
      expect(result.body.announcement.content).toBe(announcement.content);
    });
    it("Get announcements as student in college-- GET /api/v1/announcements returns 200", async () => {
      const result = await client
        .get(`/api/v1/announcements/${announcementId}`)
        .set(studentAuthHeader)
        .expect(200);
      expect(result.body.announcement).toBeDefined();
      expect(result.body.announcement.title).toBe(announcement.title);
      expect(result.body.announcement.content).toBe(announcement.content);
    });

    it("Get Specific announcement as unauthorized -- GET /api/v1/announcements returns 401", async () => {
      const result = await client
        .get(`/api/v1/announcements/${announcementId}`)
        .expect(401);
      expect(result.body.announcement).toBeUndefined();
    });

    it("Get specific announcement as student invalid announcementId -- GET /api/v1/announcements returns 404", async () => {
      const result = await client
        .get(`/api/v1/announcements/invalidAnnouncementId`)
        .set(studentAuthHeader)
        .expect(404);
      expect(result.body.announcement).toBeUndefined();
    });
  });
});
