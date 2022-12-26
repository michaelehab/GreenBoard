import { CoursePost, UserDataAndPost } from "@greenboard/shared";

export interface CoursePostDao {
  createCoursePost(coursePost: CoursePost): Promise<void>;
  getCoursePostById(postId: string): Promise<UserDataAndPost | undefined>;
  listCoursePostsByCourseId(courseId: string): Promise<UserDataAndPost[]>;
}
