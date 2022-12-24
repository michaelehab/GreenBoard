import { Router } from "express";
import {
  CreatePostComment,
  ListPostComments,
  GetPostComment,
} from "../handlers/postCommentsHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/posts/:postId/comments", CreatePostComment);
router.get("/:courseId/posts/:postId/comments", ListPostComments);
router.get("/:courseId/posts/:postId/comments/:commentId", GetPostComment);

export default router;
