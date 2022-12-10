import { Router } from "express";
import { SignUpInstructor, SignInInstructor } from "../handlers/InstructorHandler";
const router = Router();

router.post("/signup", SignUpInstructor);
router.post("/signin", SignInInstructor);

export default router;