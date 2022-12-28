import {
  ExpressHandler,
  ExpressHandlerWithParams,
  SchoolJwtPayload,
} from "../types";
import {
  School,
  SchoolSignInResponse,
  SchoolSignUpRequest,
  SchoolSignUpResponse,
  SignInRequest,
  SchoolUpdateRequest,
  SchoolUpdateResponse,
  GetSchoolRequest,
  GetSchoolResponse,
  SchoolChangePasswordRequest,
  SchoolChangePasswordResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { signJwt } from "../auth";
import { getPasswordHashed } from "../utils";
import { GetEffectiveTypeRootsHost } from "typescript";

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

export const UpdateSchool: ExpressHandler<
  SchoolUpdateRequest,
  SchoolUpdateResponse
> = async (req, res) => {
  const { name, email, phone } = req.body;

  if (
    (!name || name === "") &&
    (!email || email === "") &&
    (!phone || phone === "")
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingSchool = await db.getSchoolById(res.locals.schoolId);

  if (!existingSchool) {
    return res.status(404).send({ error: "School not found" });
  }

  if (name) existingSchool.name = name;
  if (email) {
    const schoolWithSameEmail = await db.getSchoolByEmail(email);
    if (schoolWithSameEmail) {
      return res.status(400).send({ error: "School with same email exists" });
    }
    existingSchool.email = email;
  }
  if (phone) existingSchool.phone = phone;

  await db.updateSchool(existingSchool);
  return res.status(200).send({
    school: {
      email: existingSchool.email,
      name: existingSchool.name,
      phone: existingSchool.phone,
      collegeId: existingSchool.collegeId,
    },
  });
};

export const GetSchoolById: ExpressHandlerWithParams<
  { schoolId: string },
  GetSchoolRequest,
  GetSchoolResponse
> = async (req, res) => {
  if (!req.params.schoolId) {
    return res.status(400).send({ error: "schoolId is required" });
  }
  const existingSchool = await db.getSchoolById(req.params.schoolId);

  if (!existingSchool) {
    return res.status(404).send({ error: "School not found" });
  }

  const existingCollege = await db.getCollegeById(existingSchool.collegeId);

  return res.status(200).send({
    school: {
      email: existingSchool.email,
      name: existingSchool.name,
      phone: existingSchool.phone,
    },
    collegeName: existingCollege?.name,
  });
};

export const ChangeSchoolPassword: ExpressHandler<
  SchoolChangePasswordRequest,
  SchoolChangePasswordResponse
> = async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  if (
    !newPassword ||
    !oldPassword ||
    newPassword === "" ||
    oldPassword === ""
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingSchool = await db.getSchoolById(res.locals.schoolId);

  if (!existingSchool) {
    return res.status(404).send({ error: "School not found" });
  }

  if (getPasswordHashed(oldPassword) !== existingSchool.adminPassword) {
    return res.status(400).send({ error: "Old Password is not correct" });
  }

  await db.changeSchoolPassword(
    existingSchool.id,
    getPasswordHashed(newPassword)
  );

  return res.sendStatus(200);
};
