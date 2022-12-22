import { Text, Center, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Post } from "@greenboard/shared";

export const PostCard: React.FC<Post> = (post) => {
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
          {post.title}
        </Text>
        <Link to={post.url}>Link</Link>
      </Box>
    </Center>
  );
};
