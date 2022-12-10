import { type } from "os";
import { College, Department, Instructor, School, Student } from "./types";

export interface SignInRequest {
  email: string;
  password: string;
}

// Student APIs
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

export interface StudentSignUpResponse {
  jwt: string;
}

export interface StudentSignInResponse {
  student: Pick<
    Student,
    | "id"
    | "email"
    | "firstName"
    | "lastName"
    | "phone"
    | "level"
    | "departmentId"
  >;
  jwt: string;
}

// Instructor APIs
export type InstructorSignUpRequest = Pick<
  Instructor,
  "email" | "firstName" | "lastName" | "password" | "phone" | "departmentId"
>;

export interface InstructorSignUpResponse {
  jwt: string;
}

export interface InstructorSignInResponse {
  instructor: Pick<
    Instructor,
    "email" | "firstName" | "lastName" | "id" | "phone" | "departmentId"
  >;
  jwt: string;
}

// College APIs
export type CollegeSignUpRequest = Pick<
  College,
  "email" | "foundedAt" | "location" | "name" | "phone" | "adminPassword"
>;
export interface CollegeSignUpResponse {
  jwt: string;
}

export interface CollegeSignInResponse {
  college: Pick<
    College,
    "id" | "email" | "foundedAt" | "location" | "name" | "phone"
  >;
  jwt: string;
}

export type CollegeUpdateRequest = Partial<College>;
export interface CollegeUpdateResponse {
  college: Pick<
    College,
    "id" | "email" | "foundedAt" | "location" | "name" | "phone"
  >;
}

export interface CollegeResetPasswordRequest {
  newPassword: string;
}
export interface CollegeResetPasswordResponse {}

// School APIs
export type SchoolSignUpRequest = Pick<
  School,
  "name" | "phone" | "adminPassword" | "email" | "collegeId"
>;

export interface SchoolSignUpResponse {
  jwt: string;
}

export interface SchoolSignInResponse {
  school: Pick<School, "id" | "email" | "name" | "phone" | "collegeId">;
  jwt: string;
}

// Department APIs
export type DepartmentSignUpRequest = Pick<
  Department,
  "name" | "adminPassword" | "email" | "schoolId"
>;

export interface DepartmentSignUpResponse {
  jwt: string;
}

export interface DepartmentSignInResponse {
  department: Pick<Department, "id" | "email" | "name" | "schoolId">;
  jwt: string;
}
