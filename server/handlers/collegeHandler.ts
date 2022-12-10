import { ExpressHandler } from "../types";
import {
  College,
  SignInRequest,
  CollegeSignInResponse,
  CollegeSignUpRequest,
  CollegeSignUpResponse,
  CollegeUpdateRequest,
  CollegeUpdateResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { getPasswordHashed } from "../utils";
import { signJwt } from "../auth";

export const SignUpCollege: ExpressHandler<
  CollegeSignUpRequest,
  CollegeSignUpResponse
> = async (req, res) => {
  const { email, foundedAt, location, name, phone, adminPassword } = req.body;
  if (!email || !foundedAt || !location || !name || !phone || !adminPassword) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingCollege = await db.getCollegeByEmail(email);

  if (existingCollege) {
    return res.status(403).send({ error: "College already exists!" });
  }

  const college: College = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phone,
    adminPassword: getPasswordHashed(adminPassword),
    foundedAt,
    name,
    location,
  };
  await db.createCollege(college);

  return res.status(200).send({
    jwt: signJwt({ collegeId: college.id, role: "COLLEGE" }),
  });
};

export const SignInCollege: ExpressHandler<
  SignInRequest,
  CollegeSignInResponse
> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingCollege = await db.getCollegeByEmail(email);

  if (
    !existingCollege ||
    existingCollege.adminPassword !== getPasswordHashed(password)
  ) {
    return res.status(403).send({ error: "Invalid Credentials" });
  }

  return res.status(200).send({
    college: {
      id: existingCollege.id,
      email: existingCollege.email,
      name: existingCollege.name,
      foundedAt: existingCollege.foundedAt,
      location: existingCollege.location,
      phone: existingCollege.phone,
    },
    jwt: signJwt({ collegeId: existingCollege.id, role: "COLLEGE" }),
  });
};

export const UpdateCollege: ExpressHandler<
  CollegeUpdateRequest,
  CollegeUpdateResponse
> = async (req, res) => {
  const { name, email, phone } = req.body;

  if (
    (!name || name === "") &&
    (!email || email === "") &&
    (!phone || phone === "")
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingCollege = await db.getCollegeById(res.locals.collegeId);

  if (!existingCollege) {
    return res.status(404).send({ error: "College not found" });
  }

  if (name) existingCollege.name = name;
  if (email) existingCollege.email = email;
  if (phone) existingCollege.phone = phone;

  await db.updateCollege(existingCollege);
  return res.status(200).send({
    college: {
      id: existingCollege.id,
      email: existingCollege.email,
      name: existingCollege.name,
      foundedAt: existingCollege.foundedAt,
      location: existingCollege.location,
      phone: existingCollege.phone,
    },
  });
};
