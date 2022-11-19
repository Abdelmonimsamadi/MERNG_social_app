import { useMutation } from "@apollo/client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createPostMutation, postsQuery } from "../utils/grahql";

function PostInput({ user }) {
  const initialInput = {
    title: "",
    body: "",
  };
  const [values, setValues] = useState(initialInput);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const [createPost] = useMutation(createPostMutation, {
    variables: { post: values },
    // refetchQueries: ["POSTS"],
    update(cache, { data }) {
      const newPost = data?.createPost;
      const existingPosts = cache.readQuery({
        query: postsQuery,
      });
      if (existingPosts && newPost) {
        cache.writeQuery({
          query: postsQuery,
          data: {
            posts: [newPost, ...existingPosts.posts],
          },
        });
      }
    },
    // update(cache, { data: { createPost } }) {
    //   cache.modify({
    //     fields: {
    //       posts(existingPosts = []) {
    //         const newPost = cache.writeFragment({
    //           data: createPost,
    //           fragment: gql`
    //             fragment Newpost on posts {
    //               id
    //               type
    //             }
    //           `,
    //         });
    //         return [...existingPosts, newPost];
    //       },
    //     },
    //   });
    // },
    optimisticResponse: {
      createPost: {
        __typename: "Post",
        id: "temp_id",
        title: values.title,
        body: values.body,
        user: user.id,
        name: "temp_name",
        comments: [],
        likes: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      },
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost();
    setValues(initialInput);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          onChange={handleChange}
          name="title"
          value={values.title}
          // required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Body</Form.Label>
        <Form.Control
          type="text"
          placeholder="Body"
          onChange={handleChange}
          name="body"
          value={values.body}
          // required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add post
      </Button>
    </Form>
  );
}

export default PostInput;
