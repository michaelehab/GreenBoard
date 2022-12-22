import { Announcement } from "@greenboard/shared";

export interface AnnouncementDao {
  createAnnouncement(announcement: Announcement): Promise<void>;
  getAnnouncementById(
    announcementId: string
  ): Promise<Announcement | undefined>;
  listAnnouncementsOfCollegeByCollegeId(
    collegeId: string
  ): Promise<Announcement[]>;
  listAnnouncementsOfSchoolBySchoolId(
    schoolId: string
  ): Promise<Announcement[]>;
  listAnnouncementsOfDepartmentByDepartmentId(
    departmentId: string
  ): Promise<Announcement[]>;
}
