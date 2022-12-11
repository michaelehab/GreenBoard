import { Course } from "@greenboard/shared";

export interface CourseDao {
  createCourse(course: Course): Promise<void>;
  getCourseByCode(courseCode: string): Promise<Course | undefined>;
  getCourseById(id: string): Promise<Course | undefined>;
}
