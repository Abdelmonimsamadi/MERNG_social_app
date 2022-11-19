import React from "react";
import { Button, Card, Grid, Image, Icon, Label } from "semantic-ui-react";
import moment from "moment";

const Post = ({ post }) => {
  const dateInMili = Number(post.createdAt);
  return (
    <Grid.Column>
      <Card fluid>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
          />
          <Card.Header>{post.title.slice(0, 10)}</Card.Header>
          <Card.Meta>{moment(dateInMili).fromNow()}</Card.Meta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div style={{ display: "flex" }}>
            <Button as="div" labelPosition="right">
              <Button basic color="green">
                <Icon name="like" />
                Like
              </Button>
              <Label as="a" color="green" pointing="left">
                2,048
              </Label>
            </Button>
            <Button as="div" labelPosition="right">
              <Button basic color="blue">
                <Icon name="comments" />
                Like
              </Button>
              <Label as="a" color="blue" pointing="left">
                2,048
              </Label>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
};

export default Post;
