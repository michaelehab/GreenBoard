import jwt from "jsonwebtoken";
import { getJwtExpiry, getJwtSecret } from "./utils";

export const signJwt = (obj: any): string => {
  return jwt.sign(obj, getJwtSecret(), {
    expiresIn: getJwtExpiry(),
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};
