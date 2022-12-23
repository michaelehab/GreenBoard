import { Text, Center, Box, Link as ChakraLink } from "@chakra-ui/react";
import { Announcement } from "@greenboard/shared";

export const AnnouncementCard: React.FC<Announcement> = (announcement) => {
  return (
    <Center>
      <Box
        maxW="6xl"
        w={["sm", "xl", "3xl"]}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
      >
        <Text fontSize="md" fontWeight="bold">
          {announcement.title}
        </Text>
      </Box>
    </Center>
  );
};
