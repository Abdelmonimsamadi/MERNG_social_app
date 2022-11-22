import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useState } from "react";
import { useContext } from "react";
import { Badge, Button, Card, Form, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import {
  addCommentMutation,
  deletePostMutation,
  likeMutation,
  postQuery,
  postsQuery,
} from "../utils/grahql";
import { AuthContext } from "../context/auth";

const SinglePost = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const [input, setInput] = useState("");
  const params = useParams();
  const id = params?.id;

  const { data } = useQuery(postQuery, {
    variables: { postId: id },
  });
  const post = data?.post;
  const [addComment] = useMutation(addCommentMutation, {
    variables: { postId: id, body: input },
    // refetchQueries: ["POST"],
    update(cache, { data: { addComment } }) {
      const existingPost = cache.readQuery({
        query: postQuery,
        variables: { postId: id },
      }).post;
      cache.writeQuery({
        query: postQuery,
        data: {
          post: {
            ...existingPost,
            comments: addComment,
          },
        },
      });
    },
  });

  if (post) {
    const isLiked = post.likes.find((id) => id === context.user?.id);
    var predictedLikes = isLiked
      ? post.likes.filter((id) => id !== context.user?.id)
      : [...post.likes, context.user?.id];
  }
  const [like] = useMutation(likeMutation, {
    optimisticResponse: {
      likePost: {
        ...post,
        likes: predictedLikes,
      },
    },
  });
  const [deletePost] = useMutation(deletePostMutation, {
    variables: { deletePostId: post?.id },
    update(cache) {
      const existingPosts = cache.readQuery({
        query: postsQuery,
      }).posts;
      cache.writeQuery({
        query: postsQuery,
        data: {
          posts: existingPosts.filter((item) => item.id !== post?.id),
        },
      });
    },
    optimisticResponse: {
      deletePost: {
        ...post,
      },
    },
  });
  const handleClickDelete = () => {
    if (!context.user) return navigate("login");
    deletePost();
    navigate("/");
  };
  const handleSubmit = (e) => {
    if (!context.user) return navigate("login");
    e.preventDefault();
    addComment({
      optimisticResponse: {
        addComment: [
          {
            __typename: "Comment",
            id: new Date().getTime(),
            userId: context.user?.id,
            username: context.user?.name,
            body: input,
            createdAt: new Date().toISOString(),
          },
          ...post.comments,
        ],
      },
    });
    setInput("");
  };
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const isPostOwner = context?.user?.id === post?.user;

  const dateToNumber = (date) => new Date(date).getTime();

  const sortComments = (array) => {
    return array.sort((x, y) => {
      x = dateToNumber(x.createdAt);
      y = dateToNumber(y.createdAt);
      return y - x;
    });
  };
  const sortedComments = post?.comments && sortComments([...post.comments]);
  return (
    post && (
      <>
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
                  if (!context.user) return navigate("login");
                  like({
                    variables: { id: post.id },
                  });
                }}
                variant="dark"
              >
                Like <Badge bg="secondary">{post.likes.length}</Badge>
              </Button>
              {isPostOwner && (
                <Button variant="danger" onClick={handleClickDelete}>
                  Delete
                </Button>
              )}
            </Stack>
          </Card.Body>
        </Card>
        <h3 className="my-3">Comments</h3>
        {context.user ? (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="comment">
              <Form.Label>Add comment</Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                value={input}
                required
              />
              <Form.Control.Feedback type="invalid">
                Comment must not be empty.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        ) : (
          <div className="my-4">Login to write comment !</div>
        )}

        {post.comments.length === 0 ? (
          <div>No comments</div>
        ) : (
          sortedComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}
      </>
    )
  );
};

export default SinglePost;
