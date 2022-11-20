import { CollegeSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";

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
  });

  it("Tries adding the same college again -- /api/v1/college/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send(college)
      .expect(403);
  });

  it("Sends an empty object -- /api/v1/college/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/college/signup")
      .send({})
      .expect(400);
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
  });
});
