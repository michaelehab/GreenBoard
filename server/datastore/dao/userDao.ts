import { User } from "@greenboard/shared";

export interface UserDao {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
}
