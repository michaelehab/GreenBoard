import { ExpressHandler, SchoolJwtPayload } from "../types";
import {
  School,
  SchoolSignInResponse,
  SchoolSignUpRequest,
  SchoolSignUpResponse,
  SignInRequest,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { signJwt } from "../auth";
import { getPasswordHashed } from "../utils";

export const SignUpSchool: ExpressHandler<
  SchoolSignUpRequest,
  SchoolSignUpResponse
> = async (req, res) => {
  const { email, name, phone, adminPassword, collegeId } = req.body;
  if (!email || !name || !phone || !adminPassword || !collegeId) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingSchool = await db.getSchoolByEmail(email);

  if (existingSchool) {
    return res
      .status(403)
      .send({ error: "School with this email already exists!" });
  }

  const validCollege = await db.getCollegeById(collegeId);
  if (!validCollege) {
    return res.status(403).send({ error: "College ID is invalid!" });
  }

  const school: School = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phone,
    adminPassword: getPasswordHashed(adminPassword),
    name,
    collegeId,
  };
  await db.createSchool(school);

  const tokenPayload: SchoolJwtPayload = {
    schoolId: school.id,
    role: "SCHOOL",
  };

  return res.status(200).send({
    jwt: signJwt(tokenPayload),
  });
};

export const SignInSchool: ExpressHandler<
  SignInRequest,
  SchoolSignInResponse
> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingSchool = await db.getSchoolByEmail(email);

  if (
    !existingSchool ||
    existingSchool.adminPassword !== getPasswordHashed(password)
  ) {
    return res.status(403).send({ error: "Invalid Credentials" });
  }

  const tokenPayload: SchoolJwtPayload = {
    schoolId: existingSchool.id,
    role: "SCHOOL",
  };

  return res.status(200).send({
    school: {
      id: existingSchool.id,
      email: existingSchool.email,
      name: existingSchool.name,
      phone: existingSchool.phone,
      collegeId: existingSchool.collegeId,
    },
    jwt: signJwt(tokenPayload),
  });
};
