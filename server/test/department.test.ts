import {
  CollegeSignUpRequest,
  DepartmentSignUpRequest,
  SchoolSignUpRequest,
} from "@greenboard/shared";
import supertest from "supertest";
import { getTestServer } from "./testServer";

describe("Department tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

  const department: DepartmentSignUpRequest = {
    name: "Computer Engineering",
    email: "cmp@eng.cu.edu.eg",
    adminPassword: "password",
    schoolId: "SCHOOL001",
  };

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid department -- /api/v1/department/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/department/signup")
      .send(department)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same department again -- /api/v1/department/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/department/signup")
      .send(department)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/department/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/department/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/department/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/department/signup")
      .send({
        name: "Computer Engineering",
        adminPassword: "password",
        schoolId: "abc",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- /api/v1/department/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/department/signin")
      .send({
        email: department.email,
        password: department.adminPassword,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.department.name).toEqual(department.name);
    expect(result.body.department.email).toEqual(department.email);
  });

  it("Signs in with invalid password -- /api/v1/department/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/department/signin")
      .send({
        email: department.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.department).toBeUndefined();
  });

  it("Signs in with invalid email -- /api/v1/department/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/department/signin")
      .send({
        email: "WrongEmail",
        password: department.adminPassword,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.department).toBeUndefined();
  });
});
