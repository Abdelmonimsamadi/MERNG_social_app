import moment from "moment";
import Card from "react-bootstrap/Card";

function Comment({ comment }) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-start align-items-center position-relative">
            <img
              className="rounded-circle shadow-1-strong me-3"
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
              alt="avatar"
              width="60"
              height="60"
            />
            <div>
              <h6 className="fw-bold text-primary mb-1">{comment.username}</h6>
              <p className="text-muted small mb-0">
                {moment(comment.createdAt).fromNow()}
              </p>
            </div>
          </div>

          <p className="mt-3 mb-4 pb-2">{comment.body}</p>
          <div
            className="btn btn-danger"
            style={{
              display: "block",
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
          >
            Delete
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
