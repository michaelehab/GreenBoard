import {
  Box,
  Flex,
  Center,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import {
  ListAnnouncementsRequest,
  ListAnnouncementsResponse,
} from "@greenboard/shared";
import { AnnouncementCard } from "../components/announcementCard";

export const ViewAnnouncements = () => {
  const { data: announcements } = useQuery([`viewAnnouncements`], () =>
    callEndpoint<ListAnnouncementsRequest, ListAnnouncementsResponse>(
      `/announcements`,
      "GET",
      true
    )
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  if (!announcements) {
    <p>Not Found</p>;
  }

  return (
    <Center>
      <Box>
        <Tabs align="center" colorScheme="green">
          <TabList>
            <Tab>College Announcements</Tab>
            <Tab>School Announcements</Tab>
            <Tab>Department Announcements</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Center>
                <Box>
                  <Flex direction="column">
                    {!!announcements?.collegeAnnouncements &&
                    announcements.collegeAnnouncements.length > 0 ? (
                      announcements?.collegeAnnouncements.map(
                        (announcement, i) => (
                          <AnnouncementCard key={i} {...announcement} />
                        )
                      )
                    ) : (
                      <p>No College Announcements right now</p>
                    )}
                  </Flex>
                </Box>
              </Center>
            </TabPanel>
            <TabPanel>
              <Center>
                <Box>
                  <Flex direction="column">
                    {!!announcements?.schoolAnnouncements &&
                    announcements.schoolAnnouncements.length > 0 ? (
                      announcements?.schoolAnnouncements.map(
                        (announcement, i) => (
                          <AnnouncementCard key={i} {...announcement} />
                        )
                      )
                    ) : (
                      <p>No School Announcements right now</p>
                    )}
                  </Flex>
                </Box>
              </Center>
            </TabPanel>
            <TabPanel>
              <Center>
                <Box>
                  <Flex direction="column">
                    {!!announcements?.departmentAnnouncements &&
                    announcements.departmentAnnouncements.length > 0 ? (
                      announcements?.departmentAnnouncements.map(
                        (announcement, i) => (
                          <AnnouncementCard key={i} {...announcement} />
                        )
                      )
                    ) : (
                      <p>No Department Announcements right now</p>
                    )}
                  </Flex>
                </Box>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  );
};
