import { CollegeSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import {
  SEED_INSTRUCTOR,
  SEED_INSTRUCTOR_PASSWORD,
} from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("College tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let collegeId: string;

  const college: CollegeSignUpRequest = {
    name: "Cairo University",
    email: "cairouni@email.com",
    phone: "0123456789",
    location: "Cairo, Egypt",
    foundedAt: 1952,
    adminPassword: "password",
  };

  const newName = "Ain Shams University";
  const newEmail = "newemail@email.com";
  const newPhone = "0103456789";
  const newPass = "NewPassword";

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid college -- POST /api/v1/colleges/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/colleges/signup")
      .send(college)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same college again -- POST /api/v1/colleges/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/colleges/signup")
      .send(college)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- POST /api/v1/colleges/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/colleges/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signup with a missing field -- POST /api/v1/colleges/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/colleges/signup")
      .send({
        email: "cairouni@email.com",
        phone: "0123456789",
        location: "Cairo, Egypt",
        foundedAt: 1952,
        adminPassword: "password",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- POST /api/v1/colleges/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/colleges/signin")
      .send({
        email: college.email,
        password: college.adminPassword,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.college.name).toEqual(college.name);
    expect(result.body.college.email).toEqual(college.email);
    collegeId = result.body.college.id;
  });

  it("Signs in with invalid password -- POST /api/v1/colleges/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/colleges/signin")
      .send({
        email: college.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.college).toBeUndefined();
  });

  it("Signs in with invalid email -- POST /api/v1/colleges/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/colleges/signin")
      .send({
        email: "WrongEmail",
        password: college.adminPassword,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.college).toBeUndefined();
  });
  it("Gets college profile by id as college-- GET /api/v1/colleges/:collegeId expects 200", async () => {
    const result = await client
      .get(`/api/v1/colleges/${collegeId}`)
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          college.email,
          college.adminPassword
        )
      )
      .expect(200);
    expect(result.body.college).toBeDefined();
    expect(result.body.college.email).toEqual(college.email);
    expect(result.body.college.name).toEqual(college.name);
    expect(result.body.college.foundedAt).toEqual(college.foundedAt);
    expect(result.body.college.location).toEqual(college.location);
    expect(result.body.college.phone).toEqual(college.phone);
  });

  it("Gets college profile by id as instructor-- GET /api/v1/colleges/:collegeId expects 200", async () => {
    const result = await client
      .get(`/api/v1/colleges/${collegeId}`)
      .set(
        await getAuthToken(
          "/api/v1/instructors/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(200);
    expect(result.body.college).toBeDefined();
    expect(result.body.college.email).toEqual(college.email);
    expect(result.body.college.name).toEqual(college.name);
    expect(result.body.college.foundedAt).toEqual(college.foundedAt);
    expect(result.body.college.location).toEqual(college.location);
    expect(result.body.college.phone).toEqual(college.phone);
  });

  it("Gets college profile by id as unauthorized-- GET /api/v1/colleges/:collegeId expects 401", async () => {
    const result = await client
      .get(`/api/v1/colleges/${collegeId}`)
      .expect(401);
    expect(result.body.college).toBeUndefined();
  });

  it("Gets college profile by id as instructor with invalidCollegeId-- GET /api/v1/colleges/:collegeId expects 404", async () => {
    const result = await client
      .get(`/api/v1/colleges/invalidCollegeId`)
      .set(
        await getAuthToken(
          "/api/v1/instructors/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(404);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college name -- PUT /api/v1/colleges/update returns 200", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        name: newName,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          college.email,
          college.adminPassword
        )
      )
      .expect(200);
    expect(result.body.college).toBeDefined();
    expect(result.body.college.name).toEqual(newName);
    expect(result.body.college.email).toEqual(college.email);
    expect(result.body.college.phone).toEqual(college.phone);
    expect(result.body.college.location).toEqual(college.location);
  });

  it("Updates signed in college not signed in -- PUT /api/v1/colleges/update returns 403", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        name: newName,
      })
      .expect(401);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college name with empty -- PUT /api/v1/colleges/update returns 400", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        name: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          college.email,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college email -- PUT /api/v1/colleges/update returns 200", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          college.email,
          college.adminPassword
        )
      )
      .expect(200);
    expect(result.body.college).toBeDefined();
    expect(result.body.college.name).toEqual(newName);
    expect(result.body.college.email).toEqual(newEmail);
    expect(result.body.college.phone).toEqual(college.phone);
    expect(result.body.college.location).toEqual(college.location);
  });

  it("Updates signed in college email with empty -- PUT /api/v1/colleges/update returns 400", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        email: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college phone -- PUT /api/v1/colleges/update returns 200", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        phone: newPhone,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(200);
    expect(result.body.college).toBeDefined();
    expect(result.body.college.name).toEqual(newName);
    expect(result.body.college.email).toEqual(newEmail);
    expect(result.body.college.phone).toEqual(newPhone);
    expect(result.body.college.location).toEqual(college.location);
  });

  it("Updates signed in college phone with empty -- PUT /api/v1/colleges/update returns 400", async () => {
    const result = await client
      .put("/api/v1/colleges/update")
      .send({
        phone: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });

  it("Changes College Password with wrong old password -- PUT /api/v1/colleges/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/colleges/password`)
      .send({
        oldPassword: "WrongOldPassword",
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes College Password with wrong empty old password -- PUT /api/v1/colleges/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/colleges/password`)
      .send({
        oldPassword: "",
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes College Password with wrong empty new password -- PUT /api/v1/colleges/password returns 400", async () => {
    const result = await client
      .put(`/api/v1/colleges/password`)
      .send({
        oldPassword: college.adminPassword,
        newPassword: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
  });

  it("Changes College Password with right old password -- PUT /api/v1/colleges/password returns 200", async () => {
    const result = await client
      .put(`/api/v1/colleges/password`)
      .send({
        oldPassword: college.adminPassword,
        newPassword: newPass,
      })
      .set(
        await getAuthToken(
          "/api/v1/colleges/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(200);
  });
});
