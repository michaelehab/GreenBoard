import { Router } from "express";
import {
  createInstructorAnswer,
  getInstructorAnswer,
  ListInstructorAnswer,
} from "../handlers/InstructorAnswerHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/question/:questionId/answer", createInstructorAnswer);
router.get("/:courseId/question/:questionId/answer", ListInstructorAnswer);
router.get(
  "/:courseId/question/:questionId/answer/:answerId",
  getInstructorAnswer
);

export default router;
