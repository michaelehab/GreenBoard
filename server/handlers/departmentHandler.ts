import { ExpressHandler } from "../types";
import {
  Department,
  DepartmentSignUpRequest,
  DepartmentSignUpResponse,
  SignInRequest,
  DepartmentSignInResponse
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { signJwt } from "../auth";
import { getPasswordHashed } from "../utils";

export const SignUpDepartment: ExpressHandler<
  DepartmentSignUpRequest,
  DepartmentSignUpResponse
> = async (req, res) => {
  const { email, name, schoolId, adminPassword } = req.body;
  if (!email || !schoolId|| !name ||!adminPassword) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingDepartment = await db.getDepartmentByEmail(email);

  if (existingDepartment) {
    return res.status(403).send({ error: "User already exists!" });
  }

  const department: Department = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    adminPassword,
    schoolId,
    name,
  };
  await db.createDepartment(department);
  return res.sendStatus(200);
};

export const SignInDepartment: ExpressHandler<
  SignInRequest,
  DepartmentSignInResponse
> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingDepartment = await db.getDepartmentByEmail(email);

  if (
    !existingDepartment ||
    existingDepartment.adminPassword !== getPasswordHashed(password)
  ) {
    return res.status(403).send({ error: "Invalid Credentials" });
  }

  return res.status(200).send({
    department: {
      id: existingDepartment.id,
      email: existingDepartment.email,
      name: existingDepartment.name,
      schoolId: existingDepartment.schoolId,
    },
    jwt: signJwt({ schoolId: existingDepartment.id }),
  });
};

