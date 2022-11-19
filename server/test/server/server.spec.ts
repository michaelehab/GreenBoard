import { assert, expect } from "chai";
import request from "supertest";

import createServer from "../../server";
const app = createServer();

describe("server checks", function () {
  it("Server is up and running", function () {
    return request(app)
      .get("/healthz")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        assert(response.status, "OK");
      });
  });
});
