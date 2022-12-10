import { Router } from "express";
import {
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

export default router;
