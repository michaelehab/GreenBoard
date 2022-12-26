import { PostComment, UserDataAndComment } from "@greenboard/shared";

export interface PostCommentDao {
  createPostComment(PostComment: PostComment): Promise<void>;
  getPostCommentById(postCommentId: string): Promise<UserDataAndComment | undefined>;
  listPostCommentsByPostId(PostId: string): Promise<UserDataAndComment[]>;
}
