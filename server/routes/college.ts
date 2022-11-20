import { Router } from "express";
import { SignUpCollege } from "../handlers/collegeHandler";
const router = Router();

router.post("/signup", SignUpCollege);

export default router;
