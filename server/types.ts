import { RequestHandler } from "express";

export interface UserJwtPayload {
  userId: string;
  role: string; // "STUDENT" || "INSTRUCTOR"
}

export interface CollegeJwtPayload {
  collegeId: string;
  role: string; // "COLLEGE"
}

export interface SchoolJwtPayload {
  schoolId: string;
  role: string; // "SCHOOL"
}

export interface DepartmentJwtPayload {
  departmentId: string;
  role: string; // "DEPARTMENT"
}

export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;

type WithError<T> = T & { error: string };

export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<WithError<Res>>,
  Partial<Req>,
  any
>;
