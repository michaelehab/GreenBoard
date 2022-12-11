import { Department } from "@greenboard/shared";

export interface DepartmentDao {
  createDepartment(department: Department): Promise<void>;
  getDepartmentById(id: string): Promise<Department | undefined>;
  getDepartmentByEmail(email: string): Promise<Department | undefined>;
  updateDepartment(department: Department): Promise<void>;
}
