import { CoursePost } from "@greenboard/shared";

export interface CoursePostDao {
  createCoursePost(coursePost: CoursePost): Promise<void>;
  getCoursePostById(postId: string): Promise<CoursePost | undefined>;
  listCoursePostsByCourseId(courseId: string): Promise<CoursePost[]>;
}
