import { Router } from "express";
import {
  createAnnouncement,
  getAnnouncementById,
  ListAnnouncements,
} from "../handlers/announcementHandler";
import {
  parseJwtMiddleware,
  requireJwtMiddleware,
} from "../middlewares/authMiddleware";
const router = Router();

router.use(parseJwtMiddleware);
router.use(requireJwtMiddleware);
router.post("/", createAnnouncement);
//router.get("/", ListAnnouncements);
//router.get("/:announcementId", getAnnouncementById);

export default router;
