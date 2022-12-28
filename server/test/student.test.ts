import { StudentSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_COLLEGE,
  SEED_DEPARTMENT,
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_SCHOOL,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Student tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  const newFirstName: string = "updatedFirstName";
  const newLastName: string = "updatedLastName";
  const newPhone: string = "updatedPhone";
  const newEmail: string = "Email@google.com";
  let studentId: string;

  const student: StudentSignUpRequest = {
    email: "test@outlook.com",
    firstName: "John",
    lastName: "Doe",
    password: "password",
    phoneNumber: "+20123456789",
    level: 2,
    departmentId: SEED_DEPARTMENT.id,
  };

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid student -- /api/v1/students/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/students/signup")
      .send(student)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same student again -- /api/v1/students/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/students/signup")
      .send(student)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/students/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/students/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/students/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/students/signup")
      .send({
        email: "test@outlook.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+20123456789",
        level: 2,
        departmentId: "DEPT001",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- /api/v1/students/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/students/signin")
      .send({
        email: student.email,
        password: student.password,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.student.firstName).toEqual(student.firstName);
    expect(result.body.student.email).toEqual(student.email);
    studentId = result.body.student.id;
  });

  it("Signs in with invalid password -- /api/v1/students/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/students/signin")
      .send({
        email: student.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.student).toBeUndefined();
  });

  it("Signs in with invalid email -- /api/v1/students/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/students/signin")
      .send({
        email: "WrongEmail",
        password: student.password,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.student).toBeUndefined();
  });

  it("Gets student profile by id as student-- GET /api/v1/students/:studentId expects 200", async () => {
    const result = await client
      .get(`/api/v1/students/${studentId}`)
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          student.email,
          student.password
        )
      )
      .expect(200);
    expect(result.body.student).toBeDefined();
    expect(result.body.student.email).toEqual(student.email);
    expect(result.body.student.firstName).toEqual(student.firstName);
    expect(result.body.student.lastName).toEqual(student.lastName);
    expect(result.body.student.phoneNumber).toEqual(student.phoneNumber);
    expect(result.body.departmentName).toEqual(SEED_DEPARTMENT.name);
    expect(result.body.collegeName).toEqual(SEED_COLLEGE.name);
    expect(result.body.schoolName).toEqual(SEED_SCHOOL.name);
  });

  it("Gets student profile by id as instructor-- GET /api/v1/students/:studentId expects 200", async () => {
    const result = await client
      .get(`/api/v1/students/${studentId}`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(200);
    expect(result.body.student).toBeDefined();
    expect(result.body.student.email).toEqual(student.email);
    expect(result.body.student.firstName).toEqual(student.firstName);
    expect(result.body.student.lastName).toEqual(student.lastName);
    expect(result.body.student.phoneNumber).toEqual(student.phoneNumber);
    expect(result.body.departmentName).toEqual(SEED_DEPARTMENT.name);
    expect(result.body.collegeName).toEqual(SEED_COLLEGE.name);
    expect(result.body.schoolName).toEqual(SEED_SCHOOL.name);
  });

  it("Gets student profile by id as unauthorized-- GET /api/v1/students/:studentId expects 401", async () => {
    const result = await client
      .get(`/api/v1/students/${studentId}`)
      .expect(401);
    expect(result.body.student).toBeUndefined();
  });

  it("Gets student profile by id as instructor with invalidStudentId-- GET /api/v1/students/:studentId expects 404", async () => {
    const result = await client
      .get(`/api/v1/students/invalidStudentId`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(404);
    expect(result.body.student).toBeUndefined();
  });

  it("Updates signed in student Name -- PUT /api/v1/students/update returns 200", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        firstName: newFirstName,
        lastName: newLastName,
      })
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          student.email,
          student.password
        )
      )
      .expect(200);
    expect(result.body.student).toBeDefined();
    expect(result.body.student.firstName).toEqual(newFirstName);
    expect(result.body.student.lastName).toEqual(newLastName);
    expect(result.body.student.email).toEqual(student.email);
    expect(result.body.student.phoneNumber).toEqual(student.phoneNumber);
  });

  it("Updates signed in student not signed in -- PUT /api/v1/students/update returns 403", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        firstName: newFirstName,
      })
      .expect(401);
    expect(result.body.student).toBeUndefined();
  });

  it("Updates signed in student name with empty -- PUT /api/v1/students/update returns 400", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          student.email,
          student.password
        )
      )
      .expect(400);
    expect(result.body.student).toBeUndefined();
  });

  it("Updates signed in student email -- PUT /api/v1/students/update returns 200", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          student.email,
          student.password
        )
      )
      .expect(200);
    expect(result.body.student).toBeDefined();
    expect(result.body.student.firstName).toEqual(newFirstName);
    expect(result.body.student.lastName).toEqual(newLastName);
    expect(result.body.student.email).toEqual(newEmail);
    expect(result.body.student.phoneNumber).toEqual(student.phoneNumber);
  });

  it("Updates signed in student phoneNumber -- PUT /api/v1/students/update returns 200", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        phoneNumber: newPhone,
      })
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          newEmail,
          student.password
        )
      )
      .expect(200);
    expect(result.body.student).toBeDefined();
    expect(result.body.student.lastName).toEqual(newLastName);
    expect(result.body.student.firstName).toEqual(newFirstName);
    expect(result.body.student.email).toEqual(newEmail);
    expect(result.body.student.phoneNumber).toEqual(newPhone);
  });

  it("Updates signed in student phoneNumber with empty -- PUT /api/v1/students/update returns 400", async () => {
    const result = await client
      .put("/api/v1/students/update")
      .send({
        phoneNumber: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/students/signin",
          newEmail,
          student.password
        )
      )
      .expect(400);
    expect(result.body.student).toBeUndefined();
  });
});
