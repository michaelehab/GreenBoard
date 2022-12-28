import { SchoolSignUpRequest } from "@greenboard/shared";
import supertest from "supertest";
import { SEED_COLLEGE, SEED_INSTRUCTOR, SEED_INSTRUCTOR_PASSWORD } from "../datastore/sqldb/seeds";
import { getAuthToken, getTestServer } from "./testUtils";

describe("School tests", () => {
  let client: supertest.SuperTest<supertest.Test>;
  let schoolId:string;

  const school: SchoolSignUpRequest = {
    name: "Faculty of Engineering",
    phone: "+20123456789",
    email: "eng@cu.edu.eg",
    adminPassword: "password",
    collegeId: SEED_COLLEGE.id,
  };

  const newName = "Faculty of Arts";
  const newEmail = "newemail@email.com";
  const newPhone = "0103456789";

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Adds a new valid school -- /api/v1/school/signup returns 200", async () => {
    const result = await client
      .post("/api/v1/school/signup")
      .send(school)
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it("Tries adding the same school again -- /api/v1/school/signup returns 403", async () => {
    const result = await client
      .post("/api/v1/school/signup")
      .send(school)
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends an empty object -- /api/v1/school/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/school/signup")
      .send({})
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Sends with a missing field -- /api/v1/school/signup returns 400", async () => {
    const result = await client
      .post("/api/v1/school/signup")
      .send({
        name: "Faculty of Engineering",
        phone: "+20123456789",
        email: "eng@cu.edu.eg",
        collegeId: "abc",
      })
      .expect(400);
    expect(result.body.jwt).toBeUndefined();
  });

  it("Signs in with valid credentials -- /api/v1/school/signin returns 200", async () => {
    const result = await client
      .post("/api/v1/school/signin")
      .send({
        email: school.email,
        password: school.adminPassword,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
    expect(result.body.school.name).toEqual(school.name);
    expect(result.body.school.email).toEqual(school.email);
    schoolId=result.body.school.id;
  });

  it("Signs in with invalid password -- /api/v1/school/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/school/signin")
      .send({
        email: school.email,
        password: "WrongPassword",
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.school).toBeUndefined();
  });

  it("Signs in with invalid email -- /api/v1/school/signin returns 403", async () => {
    const result = await client
      .post("/api/v1/school/signin")
      .send({
        email: "WrongEmail",
        password: school.adminPassword,
      })
      .expect(403);
    expect(result.body.jwt).toBeUndefined();
    expect(result.body.school).toBeUndefined();
  });

  it("Gets school profile by id as school-- GET /api/v1/school/:schoolId expects 200", async () => {
    const result = await client
      .get(`/api/v1/school/${schoolId}`)
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          school.email,
          school.adminPassword
        )
      )
      .expect(200);
    expect(result.body.school).toBeDefined();
    expect(result.body.school.email).toEqual(school.email);
    expect(result.body.school.name).toEqual(school.name);
    expect(result.body.school.phone).toEqual(school.phone);
    expect(result.body.collegeName).toEqual(SEED_COLLEGE.name);
  });

  it("Gets school profile by id as instructor-- GET /api/v1/school/:schoolId expects 200", async () => {
    const result = await client
      .get(`/api/v1/school/${schoolId}`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(200);
      expect(result.body.school).toBeDefined();
      expect(result.body.school.email).toEqual(school.email);
      expect(result.body.school.name).toEqual(school.name);
      expect(result.body.school.phone).toEqual(school.phone);
      expect(result.body.collegeName).toEqual(SEED_COLLEGE.name);
  });

  it("Gets school profile by id as unauthorized-- GET /api/v1/school/:schoolId expects 401", async () => {
    const result = await client.get(`/api/v1/school/${schoolId}`).expect(401);
    expect(result.body.school).toBeUndefined();
  });

  it("Gets school profile by id as instructor with invalidSchoolId-- GET /api/v1/school/:schoolId expects 404", async () => {
    const result = await client
      .get(`/api/v1/school/invalidSchoolId`)
      .set(
        await getAuthToken(
          "/api/v1/instructor/signin",
          SEED_INSTRUCTOR.email,
          SEED_INSTRUCTOR_PASSWORD
        )
      )
      .expect(404);
    expect(result.body.school).toBeUndefined();
  });


  it("Updates signed in school name -- PUT /api/v1/school/update returns 200", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        name: newName,
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          school.email,
          school.adminPassword
        )
      )
      .expect(200);
    expect(result.body.school).toBeDefined();
    expect(result.body.school.name).toEqual(newName);
    expect(result.body.school.email).toEqual(school.email);
    expect(result.body.school.phone).toEqual(school.phone);
  });

  it("Updates signed in school not signed in -- PUT /api/v1/school/update returns 403", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        name: newName,
      })
      .expect(401);
    expect(result.body.school).toBeUndefined();
  });

  it("Updates signed in school name with empty -- PUT /api/v1/school/update returns 400", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        name: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          school.email,
          school.adminPassword
        )
      )
      .expect(400);
    expect(result.body.school).toBeUndefined();
  });

  it("Updates signed in school email -- PUT /api/v1/school/update returns 200", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        email: newEmail,
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          school.email,
          school.adminPassword
        )
      )
      .expect(200);
    expect(result.body.school).toBeDefined();
    expect(result.body.school.name).toEqual(newName);
    expect(result.body.school.email).toEqual(newEmail);
    expect(result.body.school.phone).toEqual(school.phone);
  });

  it("Updates signed in school email with empty -- PUT /api/v1/school/update returns 400", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        email: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          newEmail,
          school.adminPassword
        )
      )
      .expect(400);
    expect(result.body.school).toBeUndefined();
  });

  it("Updates signed in school phone -- PUT /api/v1/school/update returns 200", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        phone: newPhone,
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          newEmail,
          school.adminPassword
        )
      )
      .expect(200);
    expect(result.body.school).toBeDefined();
    expect(result.body.school.name).toEqual(newName);
    expect(result.body.school.email).toEqual(newEmail);
    expect(result.body.school.phone).toEqual(newPhone);
  });

  it("Updates signed in school phone with empty -- PUT /api/v1/school/update returns 400", async () => {
    const result = await client
      .put("/api/v1/school/update")
      .send({
        phone: "",
      })
      .set(
        await getAuthToken(
          "/api/v1/school/signin",
          newEmail,
          school.adminPassword
        )
      )
      .expect(400);
    expect(result.body.school).toBeUndefined();
  });
});
