export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  joinedAt: Date;
  departmentId: string;
}

export interface Student extends User {
  level: number;
}

export interface Instructor extends User {}

export interface College {
  id: string;
  name: string;
  phone: string;
  email: string;
  adminPassword: string;
  location: string;
  foundedAt: number; // For now, to be changed
}

export interface School {
  id: string;
  name: string;
  phone: string;
  email: string;
  adminPassword: string;
  collegeId: string;
}

export interface Department {
  id: string;
  name: string;
  email: string;
  adminPassword: string;
  schoolId: string;
}
