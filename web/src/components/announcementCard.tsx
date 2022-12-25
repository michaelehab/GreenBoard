import { Text, Box, Heading, Flex } from "@chakra-ui/react";
import { Announcement } from "@greenboard/shared";
import { format } from "timeago.js";

export const AnnouncementCard: React.FC<Announcement> = (announcement) => {
  return (
    <Flex>
      <Box
        maxW="6xl"
        w={["sm", "xl", "3xl"]}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
      >
        <Heading fontSize="md" fontWeight="bold">
          {announcement.title}
        </Heading>
        <Text>{announcement.content}</Text>
        <Text>Posted {format(announcement.postedAt, "US")}</Text>
      </Box>
    </Flex>
  );
};
