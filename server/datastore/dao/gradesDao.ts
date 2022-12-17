import { Grade } from "@greenboard/shared";

export interface GradesDao {
  createGrade(grade: Grade): Promise<void>;
}
