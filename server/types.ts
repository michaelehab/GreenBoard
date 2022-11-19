import { RequestHandler } from "express";

export interface UserJwtObject {
  userId: string;
  role: string; // "STUDENT" || "INSTRUCTOR"
}

export interface CollegeJwtObject {
  collegeId: string;
}

export interface SchoolJwtObject {
  schoolId: string;
}

export interface DepartmentJwtObject {
  departmentId: string;
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
