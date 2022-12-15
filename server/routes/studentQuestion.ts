import { Router } from "express";
import {
  CreateStuQuestion,
  GetStudentQuestion,
  ListStudentQuestions,
} from "../handlers/stuQuestionHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/question", CreateStuQuestion);
router.get("/:courseId/question", ListStudentQuestions);
router.get("/:courseId/question/:studentQuestionId", GetStudentQuestion);

export default router;
