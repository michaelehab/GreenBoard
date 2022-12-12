import { Router } from "express";
import { CreateCourse, JoinCourse } from "../handlers/courseHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/", CreateCourse);
router.post("/join", JoinCourse);

export default router;
