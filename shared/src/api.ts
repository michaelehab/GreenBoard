import { type } from "os";
import { College, Student } from "./types";

// Auth APIs
export type StudentSignUpRequest = Pick<
  Student,
  | "email"
  | "firstName"
  | "lastName"
  | "password"
  | "phone"
  | "level"
  | "departmentId"
>;

export type StudentSignUpResponse = Pick<
  Student,
  "email" | "firstName" | "lastName" | "phone" | "id" | "level" | "departmentId"
>;

// College APIs
export type CollegeSignUpRequest = Pick<
  College,
  "email" | "foundedAt" | "location" | "name" | "phone" | "adminPassword"
>;
export interface CollegeSignUpResponse {}
