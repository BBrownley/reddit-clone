import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import commentsService from "../../services/comments";

import { Container } from "./Comment.elements";

export default function Comment({ comment }) {
  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");

  const match = useRouteMatch("/groups/:groupName/:groupId");

  const currentUser = useSelector(state => state.user);

  /*
    Fetch children from DB where parent_id = comment.id
  */

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(
        comment.comment_id
      );
      setChildren(children);
    };
    fetchChildren();
  }, []);

  const handleReplyComment = async () => {
    const newCommentObj = await commentsService.add(
      currentUser,
      newComment,
      match.params.groupId,
      comment.comment_id
    );
    // setComments([...comments, newCommentObj]);
    // setFormOpen(false);
    setNewComment("");
  };

  return (
    <Container onClick={() => console.log(comment)}>
      <div className="user">{comment.username}</div>
      <div className="content">{comment.content}</div>
      {replying === false && (
        <div onClick={() => setReplying(true)}>
          <a className="reply">Reply</a>
        </div>
      )}
      {replying === true && (
        <div>
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button onClick={handleReplyComment}>Send</button>
          <a onClick={() => setReplying(false)}>Cancel</a>
        </div>
      )}
      {children.map(childComment => (
        <Comment comment={childComment} />
      ))}
    </Container>
  );
}
