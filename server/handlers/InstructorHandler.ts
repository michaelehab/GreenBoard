import {
  ExpressHandler,
  ExpressHandlerWithParams,
  UserJwtPayload,
} from "../types";
import {
  Instructor,
  InstructorSignUpRequest,
  InstructorSignUpResponse,
  SignInRequest,
  InstructorSignInResponse,
  InstructorUpdateRequest,
  InstructorUpdateResponse,
  GetInstructorRequest,
  GetInstructorResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";
import { signJwt } from "../auth";
import { emit } from "process";

export const SignUpInstructor: ExpressHandler<
  InstructorSignUpRequest,
  InstructorSignUpResponse
> = async (req, res) => {
  const { email, firstName, lastName, password, phoneNumber, departmentId } =
    req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !password ||
    !departmentId
  ) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  let existingInstructor = await db.getInstructorByEmail(email);

  if (existingInstructor) {
    return res
      .status(403)
      .send({ error: "Instructor with this email already exists!" });
  }

  existingInstructor = await db.getInstructorByPhoneNumber(phoneNumber);
  if (existingInstructor) {
    return res.status(403).send({
      error: "Instructor with this phoneNumber number already exists!",
    });
  }

  const Instructor: Instructor = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phoneNumber,
    firstName,
    lastName,
    password: getPasswordHashed(password),
    departmentId,
    joinedAt: Date.now(),
  };

  await db.createInstructor(Instructor);

  const tokenPayload: UserJwtPayload = {
    userId: Instructor.id,
    role: "INSTRUCTOR",
  };

  return res.status(200).send({
    jwt: signJwt(tokenPayload),
  });
};

export const SignInInstructor: ExpressHandler<
  SignInRequest,
  InstructorSignInResponse
> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingInstructor = await db.getInstructorByEmail(email);

  if (
    !existingInstructor ||
    existingInstructor.password !== getPasswordHashed(password)
  ) {
    return res.status(403).send({ error: "Invalid Credentials" });
  }

  const tokenPayload: UserJwtPayload = {
    userId: existingInstructor.id,
    role: "INSTRUCTOR",
  };

  return res.status(200).send({
    instructor: {
      id: existingInstructor.id,
      email: existingInstructor.email,
      firstName: existingInstructor.firstName,
      lastName: existingInstructor.lastName,
      departmentId: existingInstructor.departmentId,
      phoneNumber: existingInstructor.phoneNumber,
    },
    jwt: signJwt(tokenPayload),
  });
};

export const UpdateInstructor: ExpressHandler<
  InstructorUpdateRequest,
  InstructorUpdateResponse
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

  const existingInstructor = await db.getInstructorById(res.locals.userId);

  if (!existingInstructor) {
    return res.status(404).send({ error: "Instructor not found" });
  }

  if (firstName) existingInstructor.firstName = firstName;
  if (lastName) existingInstructor.lastName = lastName;
  if (email) existingInstructor.email = email;
  if (phoneNumber) existingInstructor.phoneNumber = phoneNumber;

  await db.updateInstructorData(existingInstructor);
  return res.status(200).send({
    instructor: {
      email: existingInstructor.email,
      firstName: existingInstructor.firstName,
      lastName: existingInstructor.lastName,
      phoneNumber: existingInstructor.phoneNumber,
    },
  });
};

export const GetInstructorById: ExpressHandlerWithParams<
  { instructorId: string },
  GetInstructorRequest,
  GetInstructorResponse
> = async (req, res) => {
  if (!req.params.instructorId) {
    return res.status(400).send({ error: "insturctorId is required" });
  }
  const existingInstructor = await db.getInstructorById(
    req.params.instructorId
  );

  if (!existingInstructor) {
    return res.status(404).send({ error: "Instructor not found" });
  }
  const department = await db.getDepartmentById(
    existingInstructor.departmentId
  );
  if (!department) {
    return res.status(404).send({ error: "Instructor Department not found" });
  }
  const school = await db.getSchoolById(department.schoolId);
  if (!school) {
    return res.status(404).send({ error: "Instructor School not found" });
  }
  const college = await db.getCollegeById(school.collegeId);
  if (!college) {
    return res.status(404).send({ error: "Instructor College not found" });
  }

  return res.status(200).send({
    instructor: {
      email: existingInstructor.email,
      firstName: existingInstructor.firstName,
      lastName: existingInstructor.lastName,
      phoneNumber: existingInstructor.phoneNumber,
    },
    departmentName: department.name,
    schoolName: school.name,
    collegeName: college.name,
  });
};
