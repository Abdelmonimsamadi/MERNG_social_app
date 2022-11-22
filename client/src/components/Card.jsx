import moment from "moment";
import React from "react";
import Card from "react-bootstrap/Card";
import { Button, Badge, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { deletePostMutation, likeMutation, postsQuery } from "../utils/grahql";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/client";

const CardPost = ({ post }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPostOwner = user?.id === post.user;
  const isLiked = post.likes.find((id) => id === user?.id);
  const predictedLikes = isLiked
    ? post.likes.filter((id) => id !== user.id)
    : [...post.likes, user?.id];
  const [like] = useMutation(likeMutation, {
    optimisticResponse: {
      likePost: {
        ...post,
        likes: predictedLikes,
      },
    },
  });
  const [deletePost] = useMutation(deletePostMutation, {
    variables: { deletePostId: post.id },
    // refetchQueries: ["POSTS"],
    update: (cache, { data }) => {
      const deletedPost = data?.deletePost;
      const existingPosts = cache.readQuery({
        query: postsQuery,
      });
      if (existingPosts && deletedPost) {
        cache.writeQuery({
          query: postsQuery,
          data: {
            posts: existingPosts.posts.filter(
              (item) => item.id !== deletedPost.id
            ),
          },
        });
      }
    },
    optimisticResponse: {
      deletePost: {
        ...post,
      },
    },
  });
  return (
    <Card>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {moment(Number(post.createdAt)).fromNow()}
        </Card.Subtitle>
        <Card.Text>{post.body}</Card.Text>
        <Stack direction="horizontal" className="gap-1">
          <Button
            onClick={() => {
              if (!user) return navigate("/login");
              like({
                variables: { id: post.id },
              });
            }}
            variant="dark"
          >
            Like <Badge bg="secondary">{post.likes.length}</Badge>
          </Button>
          <Button variant="primary" as={Link} to={`post/${post.id}`}>
            Comments <Badge bg="secondary">{post.comments.length}</Badge>
          </Button>
          {isPostOwner && (
            <Button
              variant="danger"
              onClick={() => {
                if (!user) return navigate("login");
                deletePost();
              }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default CardPost;
