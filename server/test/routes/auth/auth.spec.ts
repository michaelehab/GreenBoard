import request from "supertest";

import createServer from "../../../server";
const app = createServer();

describe("auth routes", function () {
  it("/auth responds with 200", function (done) {
    request(app).get("/api/v1/auth").expect(200, done);
  });
});
