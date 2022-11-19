import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useQuery } from "@apollo/client";
import Card from "../components/Card";
import PostInput from "../components/PostInput";
import { AuthContext } from "../context/auth";
import { postsQuery } from "../utils/grahql";

const PostTest = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(postsQuery);
  let content;
  if (loading)
    content = (
      <Col xs={12} sm={12} lg={12}>
        <h1> Please wait a second till heroku start the backend server</h1>
      </Col>
    );
  if (error)
    content = (
      <Col xs={12} sm={12} lg={12}>
        <h1>{JSON.stringify(error)}</h1>
      </Col>
    );
  if (data)
    content = data?.posts?.map((post, i) => (
      <Col key={i} className="p-2">
        <Card post={post} />
      </Col>
    ));
  return (
    <Row xs={1} sm={2} lg={3}>
      <Col xs={12} sm={12} lg={12} className="mb-3">
        {user ? <PostInput user={user} /> : <h2>Please login to add post</h2>}
      </Col>
      {content}
    </Row>
  );
};

export default PostTest;
