import { ExpressHandler, UserJwtPayload } from "../types";
import {
  Student,
  SignInRequest,
  StudentSignInResponse,
  StudentSignUpRequest,
  StudentSignUpResponse,
  StudentUpdateRequest,
  StudentUpdateResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";
import { signJwt } from "../auth";

export const SignUpStudent: ExpressHandler<
  StudentSignUpRequest,
  StudentSignUpResponse
> = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    level,
    departmentId,
  } = req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !password ||
    !level ||
    !departmentId
  ) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  let existingStudent = await db.getStudentByEmail(email);

  if (existingStudent) {
    return res
      .status(403)
      .send({ error: "Student with this email already exists!" });
  }

  existingStudent = await db.getStudentByPhoneNumber(phoneNumber);
  if (existingStudent) {
    return res
      .status(403)
      .send({ error: "Student with this phoneNumber number already exists!" });
  }

  const student: Student = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phoneNumber,
    firstName,
    lastName,
    password: getPasswordHashed(password),
    level,
    departmentId,
    joinedAt: Date.now(),
  };

  await db.createStudent(student);

  const tokenPayload: UserJwtPayload = { userId: student.id, role: "STUDENT" };

  return res.status(200).send({
    jwt: signJwt(tokenPayload),
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

  const tokenPayload: UserJwtPayload = {
    userId: existingStudent.id,
    role: "STUDENT",
  };

  return res.status(200).send({
    student: {
      id: existingStudent.id,
      email: existingStudent.email,
      firstName: existingStudent.firstName,
      lastName: existingStudent.lastName,
      level: existingStudent.level,
      departmentId: existingStudent.departmentId,
      phoneNumber: existingStudent.phoneNumber,
    },
    jwt: signJwt(tokenPayload),
  });
};

export const UpdateStudent: ExpressHandler<
  StudentUpdateRequest,
  StudentUpdateResponse
> = async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;

  if (
    (!firstName || firstName === "") &&
    (!lastName || lastName === "") &&
    (!email || email === "") &&
    (!phoneNumber || phoneNumber === "")
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingStudent = await db.getStudentById(res.locals.userId);
  if (!existingStudent) {
    return res.status(404).send({ error: "Student not found" });
  }

  if (firstName) existingStudent.firstName = firstName;
  if (lastName) existingStudent.lastName = lastName;
  if (email) existingStudent.email = email;
  if (phoneNumber) existingStudent.phoneNumber = phoneNumber;

  await db.updateStudentData(existingStudent);
  return res.status(200).send({
    student: {
      email: existingStudent.email,
      firstName: existingStudent.firstName,
      lastName: existingStudent.lastName,
      phoneNumber: existingStudent.phoneNumber,
    },
  });
};
