import { Router } from "express";
import { SignInDepartment,SignUpDepartment,UpdateDepartment} from "../handlers/departmentHandler";
import {
    parseJwtMiddleware,
    requireJwtMiddleware,
  } from "../middlewares/authMiddleware";
const router=Router();

router.post("/signup",SignUpDepartment);
router.post("/signin",SignInDepartment);
router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.put("/update", UpdateDepartment);

export default router;