import { College } from "@greenboard/shared";

export interface CollegeDao {
  createCollege(college: College): Promise<void>;
  getCollegeById(id: string): Promise<College | undefined>;
  getCollegeByEmail(email: string): Promise<College | undefined>;
  updateCollege(college: College): Promise<void>;
}
