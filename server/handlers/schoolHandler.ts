import { ExpressHandler } from "../types";
import {
  College,
  CollegeSignUpRequest,
  CollegeSignUpResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";

export const SignUpSchool: ExpressHandler<
  CollegeSignUpRequest,
  CollegeSignUpResponse
> = async (req, res) => {
  const { email, foundedAt, location, name, phone, adminPassword } = req.body;
  if (!email || !foundedAt || !location || !name || !phone || !adminPassword) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingCollege = await db.getCollegeByEmail(email);

  if (existingCollege) {
    return res.status(403).send({ error: "User already exists!" });
  }

  const college: College = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    phone,
    adminPassword,
    foundedAt,
    name,
    location,
  };
  await db.createCollege(college);
  return res.sendStatus(200);
};
