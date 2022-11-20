import { Router } from "express";
import { SignInCollege, SignUpCollege } from "../handlers/collegeHandler";
const router = Router();

router.post("/signup", SignUpCollege);
router.post("/signin", SignInCollege);

export default router;
