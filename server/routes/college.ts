import { Router } from "express";
import {
  ChangeCollegePassword,
  GetCollegeById,
  SignInCollege,
  SignUpCollege,
  UpdateCollege,
} from "../handlers/collegeHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.post("/signup", SignUpCollege);
router.post("/signin", SignInCollege);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateCollege);
router.get("/:collegeId", GetCollegeById);
router.put("/password", ChangeCollegePassword);

export default router;
