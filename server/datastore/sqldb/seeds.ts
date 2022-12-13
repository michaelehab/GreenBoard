import {
  College,
  Department,
  School,
  Instructor,
  Student,
  Course,
} from "@greenboard/shared";

export const SEED_COLLEGE_PASSWORD = "SeedCollegeAdminPassword";

export const SEED_COLLEGE: College = {
  name: "College1",
  location: "Location1",
  phone: "Phone1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_COLLEGE_PASSWORD)
  foundedAt: 2022,
  id: "COLLEGE001",
};

export const SEED_SCHOOL_PASSWORD = "SeedSchoolAdminPassword";

export const SEED_SCHOOL: School = {
  id: "SCHOOL001",
  name: "School1",
  phone: "Phone1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_SCHOOL_PASSWORD)
  collegeId: SEED_COLLEGE.id,
};

export const SEED_DEPARTMENT_PASSWORD = "SeedDepartmentAdminPassword";

export const SEED_DEPARTMENT: Department = {
  id: "DEPT001",
  name: "Department1",
  email: "Email1",
  adminPassword: "", // getPasswordHashed(SEED_DEPARTMENT_PASSWORD)
  schoolId: SEED_SCHOOL.id,
};

export const SEED_INSTRUCTOR_PASSWORD = "SeedInstructorPassword";

export const SEED_INSTRUCTOR: Instructor = {
  id: "INSTR001",
  firstName: "FName",
  lastName: "LName",
  phone: "Phone1",
  email: "Email1",
  password: "", // getPasswordHashed(SEED_INSTRUCTOR_PASSWORD)
  joinedAt: new Date(),
  departmentId: SEED_DEPARTMENT.id,
};

export const SEED_STUDENT_PASSWORD = "SeedStudentPassword";

export const SEED_STUDENT: Student = {
  id: "STD001",
  firstName: "FName1",
  lastName: "LName1",
  phone: "Phone123",
  email: "Email123",
  password: "", // getPasswordHashed(SEED_STUDENT_PASSWORD)
  joinedAt: new Date(),
  departmentId: SEED_DEPARTMENT.id,
  level: 1,
};

export const SEED_COURSE_PASSWORD = "SeedCoursePassword";

export const SEED_COURSE: Course = {
  id: "COURSE001",
  name: "CourseName",
  courseCode: "COURSECODE1",
  password: "", // getPasswordHashed(SEED_COURSE_PASSWORD)
  departmentId: SEED_DEPARTMENT.id,
};
