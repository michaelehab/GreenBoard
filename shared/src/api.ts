import { User } from "./types";

// Auth APIs
export type UserSignUpRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "password" | "phone"
>;

export type UserSignUpResponse = Pick<
  User,
  "email" | "firstName" | "lastName" | "phone" | "id"
>;
