import { ExpressHandler } from "../types";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  CourseEnrollRequest,
  CourseEnrollResponse,
  Course,
  Enrollment,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";

export const CreateCourse: ExpressHandler<
  CreateCourseRequest,
  CreateCourseResponse
> = async (req, res) => {
  const { name, courseCode, password } = req.body;
  if (!name || !courseCode || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingCourse = await db.getCourseByCode(courseCode);
  if (existingCourse) {
    return res.status(403).send({ error: "Course already exists!" });
  }

  const existingInstructor = await db.getInstructorById(res.locals.userId);
  if (!existingInstructor) {
    return res.status(403).send({ error: "Inavalid Credentials! " });
  }

  const newCourse: Course = {
    id: crypto.randomBytes(20).toString("hex"),
    courseCode,
    name,
    password: getPasswordHashed(password),
    departmentId: existingInstructor.departmentId,
  };

  await db.createCourse(newCourse);
  return res.status(200).send({
    course: {
      id: newCourse.id,
      name: newCourse.name,
      departmentId: newCourse.departmentId,
      courseCode: newCourse.courseCode,
    },
  });
};

export const JoinCourse: ExpressHandler<
  CourseEnrollRequest,
  CourseEnrollResponse
> = async (req, res) => {
  const { courseId, password } = req.body;
  if (!courseId || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(404).send({ error: "User not found" });
  }

  const existingEnrollment = await db.checkEnrollment(
    res.locals.userId,
    courseId
  );

  if (existingEnrollment) {
    return res.status(403).send({ error: "Already enrolled in this course" });
  }

  const existingCourse = await db.getCourseById(courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  if (existingCourse.password !== getPasswordHashed(password)) {
    return res.status(400).send({ error: "Password is wrong" });
  }

  if (
    res.locals.role === "STUDENT" &&
    existingUser.departmentId !== existingCourse.departmentId
  ) {
    return res.status(403).send({ error: "Not in the same department" });
  }

  const newEnrollment: Enrollment = {
    id: crypto.randomBytes(20).toString("hex"),
    userId: res.locals.userId,
    courseId: courseId,
  };

  await db.createEnrollment(newEnrollment);
  return res.sendStatus(200);
};
