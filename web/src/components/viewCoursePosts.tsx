import { Box, Flex, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { callEndpoint } from "../utils/callEndpoint";
import {
  ListCoursePostsRequest,
  ListCoursePostsResponse,
} from "@greenboard/shared";
import { PostCard } from "../components/postCard";
import { NotFound } from "../pages/notFound";

export const ViewCoursePosts = () => {
  const { courseId } = useParams();

  const { data: coursePosts } = useQuery([`view${courseId}CoursePosts`], () =>
    callEndpoint<ListCoursePostsRequest, ListCoursePostsResponse>(
      `/courses/${courseId}/posts`,
      "GET",
      true
    )
  );

  if (!courseId || !coursePosts) {
    return <NotFound />;
  }

  return (
    <Center>
      <Box>
        <Flex direction="column">
          {!!coursePosts?.posts && coursePosts.posts.length > 0 ? (
            coursePosts?.posts.map((post, i) => <PostCard key={i} {...post} />)
          ) : (
            <p>No Posts right now</p>
          )}
        </Flex>
      </Box>
    </Center>
  );
};
