import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Input,
  Center,
  Text,
  Link as ChakraLink,
  AvatarGroup,
  Avatar,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { isLoggedIn, isLoggedInUser } from "../utils/auth";
import { callEndpoint } from "../utils/callEndpoint";
import { CommentCard } from "../components/commentCard";
import { NotFound } from "./notFound";
import {
  CreateCommentRequest,
  CreatePostCommentResponse,
  GetCoursePostRequest,
  GetCoursePostResponse,
  ListPostCommentRequest,
  ListPostCommentResponse,
} from "@greenboard/shared";
import { format } from "timeago.js";

export const ViewCoursePost = () => {
  const { courseId, postId } = useParams();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedInUser()) {
      navigate("/");
    }
  }, [navigate]);

  const { data: postData } = useQuery([`view${postId}post`], () =>
    callEndpoint<GetCoursePostRequest, GetCoursePostResponse>(
      `/courses/${courseId}/posts/${postId}`,
      "GET",
      true
    )
  );

  const { data: commentsData, refetch: refetchComments } = useQuery(
    [`list${postId}comments`],
    () =>
      callEndpoint<ListPostCommentRequest, ListPostCommentResponse>(
        `/courses/${courseId}/posts/${postId}/comments`,
        "GET",
        true
      )
  );

  const addComment = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      if (comment === "") {
        setError("Comment can't be empty");
      } else {
        await callEndpoint<CreateCommentRequest, CreatePostCommentResponse>(
          `/courses/${courseId}/posts/${postId}/comments`,
          "POST",
          true,
          {
            comment,
          }
        );
        setComment("");
        refetchComments();
      }
    },
    [comment, refetchComments, courseId, postId]
  );

  if (!courseId || !postData || !postId) {
    return <NotFound />;
  }

  return (
    <Center flexDirection="column">
      <Box
        maxW="6xl"
        w={["sm", "xl", "3xl"]}
        m={5}
        boxShadow="xl"
        p="6"
        rounded="md"
        bg="white"
      >
        <Stack direction="row" alignItems="center">
          <Heading as="h3" size="lg">
            {postData.post.title}
          </Heading>
          {postData.post.url !== "NoLink" && (
            <ChakraLink color="#4d7e3e" href={postData.post.url}>
              (Visit Link)
            </ChakraLink>
          )}
        </Stack>

        <Text fontSize="md">{postData.post.content}</Text>

        <Flex justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <AvatarGroup spacing="1rem">
              <Avatar bg="teal.500" size={"sm"} />
            </AvatarGroup>
            <Text fontSize="md">
              {postData.post.firstName} {postData.post.lastName}
            </Text>
          </Stack>
          <Text>{format(postData.post.postedAt, "en_US")}</Text>
        </Flex>
      </Box>
      <Flex direction="column">
        {!!commentsData && commentsData.postComment.length > 0 ? (
          commentsData.postComment.map((c, i) => <CommentCard key={i} {...c} />)
        ) : (
          <Center>No comments on this post</Center>
        )}
      </Flex>
      {isLoggedIn() && (
        <Box>
          <Flex maxW="sm" mx="auto" my={10} direction="column" gap={3}>
            <Input
              placeholder="Enter Your Comment"
              value={comment}
              variant="outline"
              onChange={(e) => setComment(e.target.value)}
            />

            <Box m="auto">
              <Button
                colorScheme="green"
                variant="solid"
                type="submit"
                display="block"
                onClick={addComment}
              >
                Add Comment
              </Button>
            </Box>

            {!!error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </Flex>
        </Box>
      )}
    </Center>
  );
};
