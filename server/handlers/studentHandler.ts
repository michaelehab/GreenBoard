import { ExpressHandler } from "../types";
import {
  Student,
  SignInRequest,
  StudentSignInResponse,
  StudentSignUpRequest,
  StudentSignUpResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";
import { signJwt } from "../auth";

export const SignUpStudent: ExpressHandler<
  StudentSignUpRequest,
  StudentSignUpResponse
> = async (req, res) => {
  const { email, firstName, lastName, password, phone, level, departmentId } =
    req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !phone ||
    !password ||
    !level ||
    !departmentId
  ) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingStudent = await db.getStudentByEmail(email);

  if (existingStudent) {
    return res
      .status(403)
      .send({ error: "Student with this email already exists!" });
  }

  const student: Student = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phone,
    firstName,
    lastName,
    password: getPasswordHashed(password),
    level,
    departmentId,
    joinedAt: new Date(),
  };

  await db.createStudent(student);

  return res.status(200).send({
    jwt: signJwt({ userId: student.id, role: "STUDENT" }),
  });
};

export const SignInStudent: ExpressHandler<
  SignInRequest,
  StudentSignInResponse
> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingStudent = await db.getStudentByEmail(email);

  if (
    !existingStudent ||
    existingStudent.password !== getPasswordHashed(password)
  ) {
    return res.status(403).send({ error: "Invalid Credentials" });
  }

  return res.status(200).send({
    student: {
      id: existingStudent.id,
      email: existingStudent.email,
      firstName: existingStudent.firstName,
      lastName: existingStudent.lastName,
      level: existingStudent.level,
      departmentId: existingStudent.departmentId,
      phone: existingStudent.phone,
    },
    jwt: signJwt({ userId: existingStudent.id, role: "STUDENT" }),
  });
};