import { College, School } from "@greenboard/shared";

export const SEED_COLLEGES: College[] = [
  {
    name: "College1",
    location: "Location1",
    phone: "Phone1",
    email: "Email1",
    adminPassword: "AdminPassword1",
    foundedAt: 2022,
    id: "COLLEGE001",
  },
];

export const SEED_SCHOOLS: School[] = [
  {
    id: "SCHOOL001",
    name: "School1",
    phone: "Phone1",
    email: "Email1",
    adminPassword: "AdminPassword1",
    collegeId: "COLLEGE001",
  },
];
