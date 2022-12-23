import {
  CollegeSignInResponse,
  CollegeSignUpRequest,
  CollegeSignUpResponse,
  DepartmentSignInResponse,
  SchoolSignInResponse,
  SchoolSignUpRequest,
  SignInRequest,
} from "@greenboard/shared";

import { callEndpoint } from "./callEndpoint";

export const LOCAL_STORAGE_JWT = "jwtToken";
export const LOCAL_STORAGE_CollegeID = "signedincollegeid";
export const LOCAL_STORAGE_SchoolID = "signedinschoolid";
export const LOCAL_STORAGE_DepartmentID = "signedindepartmentid";
export const LOCAL_STORAGE_ROLE = "role";

export const getLocalStorageJWT = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_JWT) || "";
};

export const getLocalStorageCollegeId = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_CollegeID) || "";
};

export const isLoggedIn = (): boolean => {
  const jwt = getLocalStorageJWT();
  return !!jwt;
};

export async function collegeSignIn(email: string, password: string) {
  const res = await callEndpoint<SignInRequest, CollegeSignInResponse>(
    "/college/signin",
    "POST",
    false,
    {
      email,
      password,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  localStorage.setItem(LOCAL_STORAGE_CollegeID, res.college.id);
  localStorage.setItem(LOCAL_STORAGE_ROLE, "COLLEGE");
}

export async function schoolSignIn(email: string, password: string) {
  const res = await callEndpoint<SignInRequest, SchoolSignInResponse>(
    "/school/signin",
    "POST",
    false,
    {
      email,
      password,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  localStorage.setItem(LOCAL_STORAGE_SchoolID, res.school.id);
  localStorage.setItem(LOCAL_STORAGE_ROLE, "SCHOOL");
}

export async function departmentSignIn(email: string, password: string) {
  const res = await callEndpoint<SignInRequest, DepartmentSignInResponse>(
    "/department/signin",
    "POST",
    false,
    {
      email,
      password,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  localStorage.setItem(LOCAL_STORAGE_DepartmentID, res.department.id);
  localStorage.setItem(LOCAL_STORAGE_ROLE, "DEPARTMENT");
}
export const schoolSignUp = async (
  email: string,
  name: string,
  phone: string,
  collegeId: string,
  adminPassword: string
) => {
  const res = await callEndpoint<SchoolSignUpRequest, SchoolSignInResponse>(
    "/school/signup",
    "post",
    false,
    {
      email,
      name,
      phone,
      collegeId,
      adminPassword,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  collegeId = LOCAL_STORAGE_CollegeID;
};
export const collegeSignUp = async (
  email: string,
  name: string,
  phone: string,
  foundedAt: number,
  location: string,
  adminPassword: string
) => {
  const res = await callEndpoint<CollegeSignUpRequest, CollegeSignUpResponse>(
    "/college/signup",
    "post",
    false,
    {
      email,
      name,
      foundedAt,
      phone,
      location,
      adminPassword,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
};

export const signOut = () => {
  localStorage.removeItem(LOCAL_STORAGE_JWT);
  localStorage.removeItem(LOCAL_STORAGE_CollegeID);
};
