import { Router } from "express";
import { CreateQuiz, getQuiz } from "../handlers/quizHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
import { SubmitQuiz } from "../handlers/gradeHandler";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/quiz", CreateQuiz);
router.get("/:courseId/quiz/:quizId", getQuiz);
router.post("/:courseId/quiz/:quizId", SubmitQuiz);

export default router;
