import {
  CollegeSignInResponse,
  CollegeSignUpRequest,
  CollegeSignUpResponse,
  DepartmentSignInResponse,
  InstructorSignInResponse,
  SchoolSignInResponse,
  SignInRequest,
  StudentSignInResponse,
} from "@greenboard/shared";

import { callEndpoint } from "./callEndpoint";

export const LOCAL_STORAGE_JWT = "jwtToken";
export const LOCAL_STORAGE_CollegeID = "signedInCollegeID";
export const LOCAL_STORAGE_SchoolID = "signedInSchoolID";
export const LOCAL_STORAGE_DepartmentID = "signedInDepartmentID";
export const LOCAL_STORAGE_UserID = "signedInUserID";
export const LOCAL_STORAGE_ROLE = "role";

export const getLocalStorageJWT = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_JWT) || "";
};

export const getLocalStorageRole = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_ROLE) || "";
};

export const isLoggedIn = (): boolean => {
  const jwt = getLocalStorageJWT();
  return !!jwt;
};

export const isLoggedInInstructor = (): boolean => {
  const role = getLocalStorageRole();
  return role === "INSTRUCTOR";
};

export const isLoggedInStudent = (): boolean => {
  const role = getLocalStorageRole();
  return role === "STUDENT";
};

export const isLoggedInUser = (): boolean => {
  const role = getLocalStorageRole();
  return role === "INSTRUCTOR" || role === "STUDENT";
};

export const isLoggedInCollege = (): boolean => {
  const role = getLocalStorageRole();
  return role === "COLLEGE";
};

export const isLoggedInSchool = (): boolean => {
  const role = getLocalStorageRole();
  return role === "SCHOOL";
};

export const isLoggedInDepartment = (): boolean => {
  const role = getLocalStorageRole();
  return role === "DEPARTMENT";
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

export async function studentSignIn(email: string, password: string) {
  const res = await callEndpoint<SignInRequest, StudentSignInResponse>(
    "/student/signin",
    "POST",
    false,
    {
      email,
      password,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  localStorage.setItem(LOCAL_STORAGE_UserID, res.student.id);
  localStorage.setItem(LOCAL_STORAGE_ROLE, "STUDENT");
}

export async function instructorSignIn(email: string, password: string) {
  const res = await callEndpoint<SignInRequest, InstructorSignInResponse>(
    "/instructor/signin",
    "POST",
    false,
    {
      email,
      password,
    }
  );
  localStorage.setItem(LOCAL_STORAGE_JWT, res.jwt);
  localStorage.setItem(LOCAL_STORAGE_UserID, res.instructor.id);
  localStorage.setItem(LOCAL_STORAGE_ROLE, "INSTRUCTOR");
}

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
  localStorage.removeItem(LOCAL_STORAGE_DepartmentID);
  localStorage.removeItem(LOCAL_STORAGE_SchoolID);
  localStorage.removeItem(LOCAL_STORAGE_UserID);
  localStorage.removeItem(LOCAL_STORAGE_ROLE);
};
