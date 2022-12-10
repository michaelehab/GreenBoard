import { RequestHandler, Response } from "express";

import { verifyJwt } from "../auth";
import { db } from "../datastore";

export const parseJwtMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }
  try {
    const payload = verifyJwt(token);
    if (payload.role === "COLLEGE") {
      const college = await db.getCollegeById(payload.collegeId);
      if (!college) {
        throw "College not found";
      }
      res.locals.collegeId = college.id;
    } else if (payload.role === "SCHOOL") {
      const school = await db.getSchoolById(payload.schoolId);
      if (!school) {
        throw "School not found";
      }
      res.locals.schoolId = school.id;
    } else if (payload.role === "DEPARTMENT") {
      const department = await db.getDepartmentById(payload.departmentId);
      if (!department) {
        throw "Department not found";
      }
      res.locals.departmentId = department.id;
    } else {
      const user = await db.getUserById(payload.userId);
      if (!user) {
        throw "User not found";
      }
      res.locals.userId = user.id;
    }
    res.locals.role = payload.role;
    console.log("College Id is now ", res.locals.collegeId);
    return next();
  } catch {
    return res.status(401).send({ error: "Bad Token" });
  }
};

export const requireJwtMiddleware: RequestHandler = async (req, res, next) => {
  if (
    !res.locals.collegeId &&
    !res.locals.schoolId &&
    !res.locals.departmentId &&
    !res.locals.userId
  ) {
    return res.sendStatus(401);
  }
  return next();
};
