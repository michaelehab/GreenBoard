import supertest from "supertest";

import { getTestServer } from "./testServer";

describe("College tests", () => {
  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    client = await getTestServer();
  });

  it("Server is up and running -- /healthz returns 200", async () => {
    const result = await client.get("/healthz").expect(200);
    expect(result.body).toStrictEqual({ status: "OK" });
  });
});
