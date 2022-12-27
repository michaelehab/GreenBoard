import { CollegeSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { getAuthToken, getTestServer } from "./testUtils";

describe("College tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

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

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid college -- POST /api/v1/college/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send(college)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same college again -- POST /api/v1/college/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send(college)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- POST /api/v1/college/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signup with a missing field -- POST /api/v1/college/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/college/signup")
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

  it("Signs in with valid credentials -- POST /api/v1/college/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/college/signin")
      .send({
        email: college.email,
        password: college.adminPassword,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.college.name).toEqual(college.name);
    expect(result.body.college.email).toEqual(college.email);
  });

  it("Signs in with invalid password -- POST /api/v1/college/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/college/signin")
      .send({
        email: college.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.college).toBeUndefined();
  });

  it("Signs in with invalid email -- POST /api/v1/college/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/college/signin")
      .send({
        email: "WrongEmail",
        password: college.adminPassword,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.college).toBeUndefined();
  });
  it("Gets college profile by id -- GET /api/v1/college/profile expects 200", async () => {
    const result = await client
      .get("/api/v1/college/profile")
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
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

  it("Gets college profile by id as unauthorized-- GET /api/v1/college/profile expects 401", async () => {
    const result = await client.get("/api/v1/college/profile").expect(401);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college name -- PUT /api/v1/college/update returns 200", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        name: newName,
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
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

  it("Updates signed in college not signed in -- PUT /api/v1/college/update returns 403", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        name: newName,
      })
      .expect(401);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college name with empty -- PUT /api/v1/college/update returns 400", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        name: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
          college.email,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college email -- PUT /api/v1/college/update returns 200", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
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

  it("Updates signed in college email with empty -- PUT /api/v1/college/update returns 400", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        email: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });

  it("Updates signed in college phone -- PUT /api/v1/college/update returns 200", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        phone: newPhone,
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
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

  it("Updates signed in college phone with empty -- PUT /api/v1/college/update returns 400", async () => {
    const result = await client
      .put("/api/v1/college/update")
      .send({
        phone: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/college/signin",
          newEmail,
          college.adminPassword
        )
      )
      .expect(400);
    expect(result.body.college).toBeUndefined();
  });
});
