import { Router } from "express";
import {
  ChangeDepartmentPassword,
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
router.put("/password", ChangeDepartmentPassword);

export default router;
