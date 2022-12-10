import { ExpressHandler } from "../types";
import {
 Instructor,
 InstructorSignUpRequest,
 InstructorSignUpResponse,
 SignInRequest,
 InstructorSignInResponse
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";
import { signJwt } from "../auth";

export const SignUpInstructor: ExpressHandler<
  InstructorSignUpRequest,
  InstructorSignUpResponse
> = async (req, res) => {
  const { email, firstName, lastName, password, phone, departmentId } =
    req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !phone ||
    !password ||
    !departmentId
  ) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingInstructor = await db.getInstructorByEmail(email); 

  if (existingInstructor) {
    return res
      .status(403)
      .send({ error: "Instructor with this email already exists!" });
  }

  const Instructor: Instructor = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phone,
    firstName,
    lastName,
    password: getPasswordHashed(password),
    departmentId,
    joinedAt: new Date(),
  };

  await db.createInstructor(Instructor);

  return res.status(200).send({
    jwt: signJwt({ userId: Instructor.id, role: "Instructor" }),
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

  return res.status(200).send({
    instructor: {
      id: existingInstructor.id,
      email: existingInstructor.email,
      firstName: existingInstructor.firstName,
      lastName: existingInstructor.lastName,
      departmentId: existingInstructor.departmentId,
      phone: existingInstructor.phone,
    },
    jwt: signJwt({ userId: existingInstructor.id, role: "Instructor" }),
  });
};
