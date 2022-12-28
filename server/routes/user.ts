import { Router } from "express";
import { ChangeUserPassword } from "../handlers/userHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/password", ChangeUserPassword);
export default router;
