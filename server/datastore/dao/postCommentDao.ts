import { PostComment } from "@greenboard/shared";

export interface PostCommentDao {
  createPostComment(PostComment: PostComment): Promise<void>;
  getPostCommentById(postCommentId: string): Promise<PostComment | undefined>;
  listPostCommentsByPostId(PostId: string): Promise<PostComment[]>;
}
