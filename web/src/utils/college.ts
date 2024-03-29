import {
  CollegeUpdateRequest,
  CollegeUpdateResponse,
} from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function updateCollege(
  name: string,
  email: string,
  phone: string
) {
  await callEndpoint<CollegeUpdateRequest, CollegeUpdateResponse>(
    `/colleges/update`,
    "PUT",
    false,
    {
      name,
      email,
      phone,
    }
  );
}
