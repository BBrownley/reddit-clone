import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import commentsService from "../../services/comments";

import { Container } from "./Comment.elements";

export default function Comment(props) {
  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");

  const match = useRouteMatch("/groups/:groupName/:groupId");

  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(
        props.comment.comment_id
      );
      setChildren(children);
    };
    fetchChildren();
  }, []);

  console.log(props.handleSubmitComment);

  return (
    <Container>
      <div className="user">{props.comment.username}</div>
      <div className="content">{props.comment.content}</div>
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
          <button
            onClick={() =>
              props.handleSubmitComment(
                currentUser,
                newComment,
                match.params.groupId,
                props.comment.comment_id,
                true,
                children,
                setChildren
              )
            }
          >
            Send
          </button>
          <a onClick={() => setReplying(false)}>Cancel</a>
        </div>
      )}
      {children.map(childComment => (
        <Comment
          comment={childComment}
          handleSubmitComment={props.handleSubmitComment}
        />
      ))}
    </Container>
  );
}
