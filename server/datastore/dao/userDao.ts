import { User } from "@greenboard/shared";

export interface UserDao {
  createUser(user: User): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhoneNumber(phone: string): Promise<User | undefined>;
  // getCollegeIdAndSchoolIdAndDepartmentIdByUserId(id: string): Promise<any>;
}
