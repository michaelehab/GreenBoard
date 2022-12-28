import { Router } from "express";
import {
  SignUpInstructor,
  SignInInstructor,
  UpdateInstructor,
  GetInstructorById,
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
router.get("/:instructorId", GetInstructorById);

export default router;
