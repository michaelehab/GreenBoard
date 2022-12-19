import { ExpressHandlerWithParams } from "../types";
import {
  Announcement,
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
  Department,
  GetAnnouncementRequest,
  GetAnnouncementResponse,
  ListAnnouncementsRequest,
  ListAnnouncementsResponse,
} from "@greenboard/shared";
import { db } from "../datastore";
import crypto from "crypto";

export const createAnnouncement: ExpressHandlerWithParams<
  {},
  CreateAnnouncementRequest,
  CreateAnnouncementResponse
> = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send({ error: "All fields are required" });
  }
  if (res.locals.role === "Instructor" || res.locals.role === "STUDENT") {
    return res.status(403).send({ error: "User can't create announcement" });
  }

  let collegeId = null,
    schoolId = null,
    departmentId = null,
    school,
    department;
  if (res.locals.role === "COLLEGE") {
    collegeId = res.locals.collegeId;
  } else if (res.locals.role === "DEPARTMENT") {
    departmentId = res.locals.departmentId;
    department = await db.getDepartmentById(departmentId);
    if (department) {
      schoolId = department.schoolId;
      school = await db.getSchoolById(department.schoolId);
      if (school) collegeId = school.collegeId;
    }
  } else if (res.locals.role === "SCHOOL") {
    schoolId = res.locals.schoolId;
    school = await db.getSchoolById(schoolId);
    if (school) {
      collegeId = school.collegeId;
    }
  }

  const announcement: Announcement = {
    id: crypto.randomBytes(20).toString("hex"),
    title,
    content,
    postedAt: Date.now(),
    departmentId: departmentId,
    schoolId: schoolId,
    collegeId: collegeId,
  };

  await db.createAnnouncement(announcement);
  return res.status(200).send({ announcement: announcement });
};

export const ListAnnouncements: ExpressHandlerWithParams<
  {},
  ListAnnouncementsRequest,
  ListAnnouncementsResponse
> = async (req, res) => {};

export const getAnnouncementById: ExpressHandlerWithParams<
  { announcementId: string },
  GetAnnouncementRequest,
  GetAnnouncementResponse
> = async (req, res) => {
  if (!req.params.announcementId) {
    return res.status(400).send({ error: "announcementId is required" });
  }

  const existingUser = await db.getUserById(res.locals.userId);
  if (!existingUser) {
    return res.status(404).send({ error: "User is not found" });
  }

  const announcement = await db.getAnnouncementById(req.params.announcementId);
  if (!announcement) {
    return res.status(404).send({ error: "Announcement not found" });
  }

  return res.status(200).send({
    announcement: announcement,
  });
};
