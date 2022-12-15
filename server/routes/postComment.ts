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
router.post("/comment", CreatePostComment);
router.get("/comment", ListPostComments);
router.get("/comment/:comment", GetPostComment);

export default router;
