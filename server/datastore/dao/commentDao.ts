import { Comment } from "@greenboard/shared";

export interface CommentDao {
  createComment(Comment: Comment): Promise<void>;
}
