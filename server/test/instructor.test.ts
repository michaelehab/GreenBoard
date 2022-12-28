import { InstructorSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { SEED_DEPARTMENT } from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Instructor tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  const newFirstName: string = "updatedFirstName";
  const newLastName: string = "updatedLastName";
  const newPhone: string = "updatedPhone";
  const newEmail: string = "Email@google.com";

  const instructor: InstructorSignUpRequest = {
    email: "test@outlook.com",
    firstName: "John",
    lastName: "Doe",
    password: "password",
    phoneNumber: "+20123456789",
    departmentId: SEED_DEPARTMENT.id,
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
        phoneNumber: "+20123456789",
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
  it("Updates signed in instructor Name -- PUT /api/v1/instructor/update returns 200", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        firstName: newFirstName,
        lastName: newLastName,
      })
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          instructor.email,
          instructor.password
        )
      )
      .expect(200);
    expect(result.body.instructor).toBeDefined();
    expect(result.body.instructor.firstName).toEqual(newFirstName);
    expect(result.body.instructor.lastName).toEqual(newLastName);
    expect(result.body.instructor.email).toEqual(instructor.email);
    expect(result.body.instructor.phoneNumber).toEqual(instructor.phoneNumber);
  });

  it("Updates signed in instructor not signed in -- PUT /api/v1/instructor/update returns 403", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        firstName: newFirstName,
      })
      .expect(401);
    expect(result.body.instructor).toBeUndefined();
  });

  it("Updates signed in instructor name with empty -- PUT /api/v1/instructor/update returns 400", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          instructor.email,
          instructor.password
        )
      )
      .expect(400);
    expect(result.body.instructor).toBeUndefined();
  });

  it("Updates signed in instructor email -- PUT /api/v1/instructor/update returns 200", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          instructor.email,
          instructor.password
        )
      )
      .expect(200);
    expect(result.body.instructor).toBeDefined();
    expect(result.body.instructor.firstName).toEqual(newFirstName);
    expect(result.body.instructor.lastName).toEqual(newLastName);
    expect(result.body.instructor.email).toEqual(newEmail);
    expect(result.body.instructor.phoneNumber).toEqual(instructor.phoneNumber);
  });

  it("Updates signed in instructor phoneNumber -- PUT /api/v1/instructor/update returns 200", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        phoneNumber: newPhone,
      })
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          newEmail,
          instructor.password
        )
      )
      .expect(200);
    expect(result.body.instructor).toBeDefined();
    expect(result.body.instructor.lastName).toEqual(newLastName);
    expect(result.body.instructor.firstName).toEqual(newFirstName);
    expect(result.body.instructor.email).toEqual(newEmail);
    expect(result.body.instructor.phoneNumber).toEqual(newPhone);
  });

  it("Updates signed in instructor phoneNumber with empty -- PUT /api/v1/instructor/update returns 400", async () => {
    const result = await client
      .put("/api/v1/instructor/update")
      .send({
        phoneNumber: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          newEmail,
          instructor.password
        )
      )
      .expect(400);
    expect(result.body.instructor).toBeUndefined();
  });
});
