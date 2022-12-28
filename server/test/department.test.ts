import {
  CollegeSignUpRequest,
  DepartmentSignUpRequest,
  SchoolSignUpRequest,
} from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_SCHOOL,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("Department tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let departmentId: string;

  const department: DepartmentSignUpRequest = {
    name: "Computer Engineering",
    email: "cmp@eng.cu.edu.eg",
    adminPassword: "password",
    schoolId: SEED_SCHOOL.id,
  };

  const newName = "Electronics";
  const newEmail = "newemail@email.com";
  const newPass = "NewPassword";

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
    departmentId = result.body.department.id;
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

  it("Gets department profile by id as department-- GET /api/v1/department/:departmentId expects 200", async () => {
    const result = await client
      .get(`/api/v1/department/${departmentId}`)
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          department.email,
          department.adminPassword
        )
      )
      .expect(200);
    expect(result.body.department).toBeDefined();
    expect(result.body.department.email).toEqual(department.email);
    expect(result.body.department.name).toEqual(department.name);
    expect(result.body.schoolName).toEqual(SEED_SCHOOL.name);
  });

  it("Gets department profile by id as instructor-- GET /api/v1/department/:departmentId expects 200", async () => {
    const result = await client
      .get(`/api/v1/department/${departmentId}`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(200);
    expect(result.body.department).toBeDefined();
    expect(result.body.department.email).toEqual(department.email);
    expect(result.body.department.name).toEqual(department.name);
    expect(result.body.schoolName).toEqual(SEED_SCHOOL.name);
  });

  it("Gets department profile by id as unauthorized-- GET /api/v1/department/:departmentId expects 401", async () => {
    const result = await client
      .get(`/api/v1/department/${departmentId}`)
      .expect(401);
    expect(result.body.department).toBeUndefined();
  });

  it("Gets department profile by id as instructor with invalidDepartmentId-- GET /api/v1/department/:departmentId expects 404", async () => {
    const result = await client
      .get(`/api/v1/department/invalidDepartmentId`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(404);
    expect(result.body.department).toBeUndefined();
  });

  it("Updates signed in department name -- PUT /api/v1/department/update returns 200", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        name: newName,
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          department.email,
          department.adminPassword
        )
      )
      .expect(200);
    expect(result.body.department).toBeDefined();
    expect(result.body.department.name).toEqual(newName);
    expect(result.body.department.email).toEqual(department.email);
  });

  it("Updates signed in department not signed in -- PUT /api/v1/department/update returns 403", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        name: newName,
      })
      .expect(401);
    expect(result.body.department).toBeUndefined();
  });

  it("Updates signed in department name with empty -- PUT /api/v1/department/update returns 400", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        name: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          department.email,
          department.adminPassword
        )
      )
      .expect(400);
    expect(result.body.department).toBeUndefined();
  });

  it("Updates signed in department email -- PUT /api/v1/department/update returns 200", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          department.email,
          department.adminPassword
        )
      )
      .expect(200);
    expect(result.body.department).toBeDefined();
    expect(result.body.department.name).toEqual(newName);
    expect(result.body.department.email).toEqual(newEmail);
  });

  it("Updates signed in department email with empty -- PUT /api/v1/department/update returns 400", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        email: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(400);
    expect(result.body.department).toBeUndefined();
  });

  it("Updates signed in department phone with empty -- PUT /api/v1/department/update returns 400", async () => {
    const result = await client
      .put("/api/v1/department/update")
      .send({
        phone: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(400);
    expect(result.body.department).toBeUndefined();
  });

  it("Changes department Password with wrong old password -- PUT /api/v1/department/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/department/password`)
      .send({
        oldPassword: "WrongOldPassword",
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes department Password with wrong empty old password -- PUT /api/v1/department/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/department/password`)
      .send({
        oldPassword: "",
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes department Password with wrong empty new password -- PUT /api/v1/department/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/department/password`)
      .send({
        oldPassword: department.adminPassword,
        newPassword: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes department Password with right old password -- PUT /api/v1/department/password returns 200", async () => {
    const result = await client
      .put(`/api/v1/department/password`)
      .send({
        oldPassword: department.adminPassword,
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/department/signin",
          newEmail,
          department.adminPassword
        )
      )
      .expect(200);
  });
});
