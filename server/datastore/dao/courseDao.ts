import { Course, CourseData } from "@greenboard/shared";

export interface CourseDao {
  createCourse(course: Course): Promise<void>;
  getCourseByCode(courseCode: string): Promise<Course | undefined>;
  getCourseById(id: string): Promise<Course | undefined>;
  listEnrolledCourse(userId: string): Promise<CourseData[]>;
  listAvailableCourses(
    userId: string,
    departmentId: string
  ): Promise<CourseData[]>;
}
