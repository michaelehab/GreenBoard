import { Router } from "express";
import { SignUpSchool, SignInSchool,UpdateSchool, GetSchoolById } from "../handlers/schoolHandler";
import {
    parseJwtMiddleware,
    requireJwtMiddleware,
  } from "../middlewares/authMiddleware";
const router = Router();

router.post("/signup", SignUpSchool);
router.post("/signin", SignInSchool);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateSchool);
router.get("/:schoolId",GetSchoolById);

export default router;
