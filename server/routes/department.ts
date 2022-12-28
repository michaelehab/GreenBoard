import { Router } from "express";
import {
  GetDepartmentById,
  SignInDepartment,
  SignUpDepartment,
  UpdateDepartment,
} from "../handlers/departmentHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.post("/signup", SignUpDepartment);
router.post("/signin", SignInDepartment);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateDepartment);
router.get("/:departmentId", GetDepartmentById);

export default router;
