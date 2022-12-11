import { StudentSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { SEED_DEPARTMENTS } from "../datastore/sqldb/seeds";
import { getTestServer } from "./testUtils";

describe("Student tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

  const student: StudentSignUpRequest = {
    email: "test@outlook.com",
    firstName: "John",
    lastName: "Doe",
    password: "password",
    phone: "+20123456789",
    level: 2,
    departmentId: SEED_DEPARTMENTS[0].id,
  };

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid student -- /api/v1/student/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/student/signup")
      .send(student)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same student again -- /api/v1/student/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/student/signup")
      .send(student)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/student/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/student/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/student/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/student/signup")
      .send({
        email: "test@outlook.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+20123456789",
        level: 2,
        departmentId: "DEPT001",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- /api/v1/student/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/student/signin")
      .send({
        email: student.email,
        password: student.password,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.student.firstName).toEqual(student.firstName);
    expect(result.body.student.email).toEqual(student.email);
  });

  it("Signs in with invalid password -- /api/v1/student/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/student/signin")
      .send({
        email: student.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.student).toBeUndefined();
  });

  it("Signs in with invalid email -- /api/v1/student/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/student/signin")
      .send({
        email: "WrongEmail",
        password: student.password,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.student).toBeUndefined();
  });
});
