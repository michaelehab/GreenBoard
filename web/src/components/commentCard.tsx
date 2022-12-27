import { Avatar, Flex, Stack, Text, WrapItem } from "@chakra-ui/react";
import { format } from "timeago.js";
import { Comment, UserDataAndComment } from "@greenboard/shared";

export const CommentCard: React.FC<UserDataAndComment> = (comment) => {
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
        <Text fontSize="md">{comment.comment}</Text>
      </Flex>
      <Flex gap={3} justifyContent="space-between">
        <Stack direction="row">
          <WrapItem>
            <Avatar
              size={"xs"}
              name={`${comment.firstName} ${comment.lastName}`}
            />
          </WrapItem>
          <Text fontSize="md">
            {comment.firstName} {comment.lastName}
          </Text>
        </Stack>
        <Text>{format(comment.postedAt, "en_US")}</Text>
      </Flex>
    </Flex>
  );
};
