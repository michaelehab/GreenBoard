import { Department, School } from "@greenboard/shared";

export interface SchoolDao {
  createSchool(school: School): Promise<void>;
  getSchoolById(id: string): Promise<School | undefined>;
  getSchoolByEmail(email: string): Promise<School | undefined>;
  updateSchool(school: School): Promise<void>;
  changeSchoolPassword(schoolId: string, newPassword: string): Promise<void>;
}
