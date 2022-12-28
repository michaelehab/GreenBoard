import { User, UserRegistrationData } from "@greenboard/shared";

export interface UserDao {
  createUser(user: User): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhoneNumber(phone: string): Promise<User | undefined>;
  getUserRegistrationDatabyDepartmentId(
    departmentId: string
  ): Promise<UserRegistrationData | undefined>;
  updateUserData(user: User): Promise<void>;
}
