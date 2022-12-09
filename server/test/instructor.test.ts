import { InstructorSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { getTestServer } from "./testServer";

describe("Instructor tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

  const instructor: InstructorSignUpRequest = {
    email: "test@outlook.com",
    firstName: "John",
    lastName: "Doe",
    password: "password",
    phone: "+20123456789",
    departmentId: "DEPT001",
  };

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid instructor -- /api/v1/instructor/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/instructor/signup")
      .send(instructor)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same instructor again -- /api/v1/instructor/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/instructor/signup")
      .send(instructor)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/instructor/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/instructor/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/instructor/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/instructor/signup")
      .send({
        email: "test@outlook.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+20123456789",
        departmentId: "DEPT001",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- /api/v1/instructor/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/instructor/signin")
      .send({
        email: instructor.email,
        password: instructor.password,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.instructor.firstName).toEqual(instructor.firstName);
    expect(result.body.instructor.email).toEqual(instructor.email);
  });

  it("Signs in with invalid password -- /api/v1/instructor/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/instructor/signin")
      .send({
        email: instructor.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.instructor).toBeUndefined();
  });

  it("Signs in with invalid email -- /api/v1/instructor/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/instructor/signin")
      .send({
        email: "WrongEmail",
        password: instructor.password,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.instructor).toBeUndefined();
  });
});
