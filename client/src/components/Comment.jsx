import moment from "moment";
import Card from "react-bootstrap/Card";

function Comment({ comment }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>By {comment.username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {moment(comment.createdAt).fromNow()}
        </Card.Subtitle>
        <Card.Text>{comment.body}</Card.Text>
        {/* <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
      </Card.Body>
    </Card>
  );
}

export default Comment;
