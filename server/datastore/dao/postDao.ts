import { Post } from "@greenboard/shared";

export interface PostDao {
  createPost(post: Post): Promise<void>;
}
