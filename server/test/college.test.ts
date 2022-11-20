import { CollegeSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { verifyJwt } from "../auth";
import { getTestServer } from "./testServer";

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

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid college -- /api/v1/college/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send(college)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same college again -- /api/v1/college/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send(college)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/college/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/college/signup returns 400", async () => {
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

  it("Signs in with valid credentials -- /api/v1/college/signin returns 200", async () => {
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

  it("Signs in with invalid password -- /api/v1/college/signin returns 403", async () => {
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

  it("Signs in with invalid email -- /api/v1/college/signin returns 403", async () => {
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
});
