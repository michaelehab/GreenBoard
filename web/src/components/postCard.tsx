import {
  Text,
  Center,
  Box,
  Link as ChakraLink,
  Flex,
  Avatar,
  WrapItem,
  Stack,
} from "@chakra-ui/react";
import { UserDataAndPost } from "@greenboard/shared";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import UserAvatar from "../assets/user.jpg";

export const PostCard: React.FC<UserDataAndPost> = (post) => {
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
        <Flex gap={2}>
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
      </Box>
    </Center>
  );
};
