import { Enrollment } from "@greenboard/shared";

export interface EnrollmentDao {
  createEnrollment(enrollment: Enrollment): Promise<void>;
  checkEnrollment(
    userId: string,
    courseId: string
  ): Promise<Enrollment | undefined>;
}
