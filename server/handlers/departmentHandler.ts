import { DepartmentJwtPayload, ExpressHandler, ExpressHandlerWithParams } from "../types";
import {
  Department,
  DepartmentSignUpRequest,
  DepartmentSignUpResponse,
  SignInRequest,
  DepartmentSignInResponse,
  DepartmentUpdateRequest,
  DepartmentUpdateResponse,
  GetDepartmentRequest,
  GetDepartmentResponse
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
    jwt: signJwt( tokenPayload ),
  });
};

export const UpdateDepartment: ExpressHandler<
  DepartmentUpdateRequest,
  DepartmentUpdateResponse
> = async (req, res) => {
  const { name, email } = req.body;

  if (
    (!name || name === "") &&
    (!email || email === "") 
  ) {
    return res.status(400).send({ error: "At least one field is required" });
  }

  const existingDepartment = await db.getDepartmentById(res.locals.departmentId);

  if (!existingDepartment) {
    return res.status(404).send({ error: "Department not found" });
  }

  if (name) existingDepartment.name = name;
  if (email) existingDepartment.email = email;

  await db.updateDepartment(existingDepartment);
  return res.status(200).send({
    department: {
      id: existingDepartment.id,
      email: existingDepartment.email,
      name: existingDepartment.name,
      schoolId:existingDepartment.schoolId
    },
  });
};

export const GetDepartmentById: ExpressHandlerWithParams<
  { departmentId: string },
  GetDepartmentRequest,
  GetDepartmentResponse
> = async (req, res) => {
  if (!req.params.departmentId) {
    return res.status(400).send({ error: "departmentId is required" });
  }
  const existingDepartment = await db.getDepartmentById(req.params.departmentId);

  if (!existingDepartment) {
    return res.status(404).send({ error: "Department not found" });
  }

  const existingSchool=await db.getCollegeById(existingDepartment.schoolId);
  
  return res.status(200).send({
    department: {
      email: existingDepartment.email,
      name: existingDepartment.name,
    },
    schoolName:existingSchool?.name
  });
};

