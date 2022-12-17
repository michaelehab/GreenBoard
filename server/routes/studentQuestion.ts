import { Router } from "express";
import {
  CreateStudentQuestion,
  ListStudentQuestions,
  GetStudentQuestion
} from "../handlers/stdQuestionHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import instructorAnswer from "./instructorAnswer";
const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.use(instructorAnswer);
router.post("/:courseId/question", CreateStudentQuestion);
router.get("/:courseId/question", ListStudentQuestions);
router.get("/:courseId/question/:studentQuestionId", GetStudentQuestion);

export default router;
