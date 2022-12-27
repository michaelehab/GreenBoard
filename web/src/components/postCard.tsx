import {
  Text,
  Center,
  Box,
  Link as ChakraLink,
  Flex,
  Avatar,
  WrapItem,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { UserDataAndPost } from "@greenboard/shared";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export const PostCard: React.FC<UserDataAndPost> = (post) => {
  function getMinutesFromNow(postedAt: number) {
    const now = new Date();
    const endDate = new Date(postedAt);
    const diff = now.getTime() - endDate.getTime();
    return diff / 60000;
  }
  return (
    <Center>
      <Flex
        maxW="3xl"
        w={["sm", "xl", "3xl"]}
        h={120}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
        justifyContent="space-between"
        direction="column"
      >
        <Flex gap={2}>
          {getMinutesFromNow(post.postedAt) <= 5 && (
            <Badge borderRadius="full" px="2" colorScheme="green">
              New
            </Badge>
          )}
          <Link to={`/courses/${post.courseId}/posts/${post.id}`}>
            <Text fontSize="md" fontWeight="bold">
              {post.title}
            </Text>
          </Link>
          {post.url !== "NoLink" && (
            <ChakraLink color="#4d7e3e" href={post.url}>
              Visit Link
            </ChakraLink>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Stack direction="row">
            <WrapItem>
              <Avatar size={"xs"} name={`${post.firstName} ${post.lastName}`} />
            </WrapItem>
            <Text fontSize="md">
              {post.firstName} {post.lastName}
            </Text>
          </Stack>
          <Text color="#4d7e3e">{format(post.postedAt, "en_US")}</Text>
        </Flex>
      </Flex>
    </Center>
  );
};
