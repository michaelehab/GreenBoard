import { Router } from "express";
import {
  SignUpInstructor,
  SignInInstructor,
  UpdateInstructor,
} from "../handlers/InstructorHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.post("/signup", SignUpInstructor);
router.post("/signin", SignInInstructor);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateInstructor);
export default router;
