import { DepartmentJwtPayload, ExpressHandler } from "../types";
import {
  Department,
  DepartmentSignUpRequest,
  DepartmentSignUpResponse,
  SignInRequest,
  DepartmentSignInResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";
import { signJwt } from "../auth";
import { getPasswordHashed } from "../utils";

export const SignUpDepartment: ExpressHandler<
  DepartmentSignUpRequest,
  DepartmentSignUpResponse
> = async (req, res) => {
  const { email, schoolId, name, adminPassword } = req.body;
  if (!email || !schoolId || !name || !adminPassword) {
    return res.status(400).send({ error: "All Fields are required!" });
  }
  const existingDepartment = await db.getDepartmentByEmail(email);

  if (existingDepartment) {
    return res.status(403).send({ error: "Department already exists!" });
  }

  const department: Department = {
    id: crypto.randomBytes(20).toString("hex"),
    email,
    schoolId,
    adminPassword: getPasswordHashed(adminPassword),
    name,
  };
  await db.createDepartment(department);

  const tokenPayload: DepartmentJwtPayload = {
    departmentId: department.id,
    role: "DEPARTMENT",
  };

  return res.status(200).send({
    jwt: signJwt(tokenPayload),
  });
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

  const tokenPayload: DepartmentJwtPayload = {
    departmentId: existingDepartment.id,
    role: "DEPARTMENT",
  };

  return res.status(200).send({
    department: {
      id: existingDepartment.id,
      email: existingDepartment.email,
      name: existingDepartment.name,
      schoolId: existingDepartment.schoolId,
    },
    jwt: signJwt({ tokenPayload }),
  });
};
