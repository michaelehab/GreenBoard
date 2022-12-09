import { School } from "@greenboard/shared";

export interface SchoolDao {
  createSchool(school: School): Promise<void>;
  getSchoolById(id: string): Promise<School | undefined>;
  getSchoolByEmail(email: string): Promise<School | undefined>;
}
