import { ExpressHandler } from "../types";
import {
  CreateCourseRequest,
  CreateCourseResponse,
  CourseEnrollRequest,
  CourseEnrollResponse,
  Course,
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
