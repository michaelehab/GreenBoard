import { Flex, Text } from "@chakra-ui/react";
import { format } from "timeago.js";
import { PostComment } from "@greenboard/shared";

export const CommentCard: React.FC<PostComment> = (comment) => {
  return (
    <Flex
      maxW="6xl"
      w={["sm", "lg", "3xl"]}
      m={5}
      direction="column"
      margin={5}
      boxShadow="base"
      p="6"
      rounded="md"
      bg="white"
    >
      <Flex justifyContent="space-between">
        <Text fontSize="md" fontWeight="bold">
          {comment.comment}
        </Text>
      </Flex>
      <Flex gap={3}>
        <Text>{format(comment.postedAt, "en_US")}</Text>
      </Flex>
    </Flex>
  );
};
