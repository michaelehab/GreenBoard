import { Router } from "express";
import { CreateQuiz, getQuiz } from "../handlers/quizHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/:courseId/quiz", CreateQuiz);
router.get("/:courseId/quiz/:quizId", getQuiz);

export default router;
