import React, { useState, useEffect } from "react";
import commentsService from "../../services/comments";

import { Container } from "./Comment.elements";

export default function Comment({ comment }) {
  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);

  /*
    Fetch children from DB where parent_id = comment.id
  */

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(comment.comment_id);
      setChildren(children);
    };
    fetchChildren();
  });

  return (
    <Container>
      <div className="user">{comment.username}</div>
      <div className="content">{comment.content}</div>
      {replying === false && (
        <div onClick={() => setReplying(true)}>
          <a className="reply">Reply</a>
        </div>
      )}
      {replying === true && (
        <div>
          <input type="text" />
          <button>Send</button>
          <a onClick={() => setReplying(false)}>Cancel</a>
        </div>
      )}
      {children.map(childComment => (
        <Comment comment={childComment} />
      ))}
    </Container>
  );
}
