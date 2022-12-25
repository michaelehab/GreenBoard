import {
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function createAnnouncement(title: string, content: string) {
  await callEndpoint<CreateAnnouncementRequest, CreateAnnouncementResponse>(
    `/announcements`,
    "POST",
    false,
    {
      title,
      content,
    }
  );
}
