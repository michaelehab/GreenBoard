import request from "supertest";

import { createServer } from "../server";

let client: request.SuperTest<request.Test>;

export async function getTestServer() {
  if (!client) {
    const server = await createServer(":memory:", false);
    client = request(server);
  }

  return client;
}

// Url can be:
// /api/v1/college/signin
// /api/v1/school/signin
// /api/v1/department/signin
// /api/v1/student/signin
// /api/v1/instructor/signin
export const getAuthToken = async (
  url: string,
  email: string,
  password: string
) => {
  const result = await client.post(url).send({ email, password });
  return { Authorization: "Bearer " + result.body.jwt };
};
