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
router.post("/:courseId/post/:postId/comment", CreatePostComment);
router.get("/:courseId/post/:postId/comment", ListPostComments);
router.get("/:courseId/post/:postId/comment/:commentId", GetPostComment);

export default router;
