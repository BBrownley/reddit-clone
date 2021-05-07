import React, { useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeVotes as initializePostVotes,
  addVote,
  removeVote,
  switchVote
} from "../../reducers/userPostVotesReducer";
import {
  initializePosts,
  removePost,
  editPost
} from "../../reducers/postsReducer";

import {
  Post as Container,
  VoteContainer,
  VoteButton,
  Content,
  PostOptions,
  PostScore,
  CommentCountSm,
  CommentCountLg
} from "../PostList/PostList.elements";

import { FormContainer, FormField, ButtonGroup } from "../shared/Form.elements";

import FollowButton from "../FollowButton/FollowButton";

import FontAwesome from "react-fontawesome";
import PostHeader from "../shared/PostHeader";

const Post = ({ post, options, expand, viewMode }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const userPosts = useSelector(state => state.userPosts);
  const userPostVote = useSelector(state =>
    state.userPostVotes.find(vote => {
      return vote.post_id === post.postID;
    })
  );

  const history = useHistory();

  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.content);
  const [postContent, setPostContent] = useState(post.content);

  const handleVotePost = (postId, clickedValue) => {
    if (user.token === null) {
      return history.push({
        pathname: "/login",
        state: {
          headerMessage: "Log in to vote on posts",
          creatingPost: false
        }
      });
    }

    if (userPostVote) {
      // Determine whether to just remove the vote, or switch it

      if (userPostVote.vote_value !== clickedValue) {
        dispatch(switchVote(postId, clickedValue));
      } else {
        dispatch(removeVote(postId));
      }
    } else {
      dispatch(addVote(postId, clickedValue));
    }
  };

  const handleEditPost = () => {
    dispatch(editPost(post.postID, editValue));
    setPostContent(editValue);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditValue(postContent);
  };

  const handleDeletePost = async postId => {
    dispatch(removePost(postId));
    if (viewMode) {
      history.push("/");
    }
  };

  const DeleteConfirmation = () => {
    return (
      <>
        Are you sure?
        <span onClick={() => handleDeletePost(post.postID)}>Yes</span>
        <span onClick={() => setConfirmDeletion(false)}>No</span>
      </>
    );
  };

  const userOwnsPost = userPosts.find(userPost => {
    return userPost.postID === post.postID;
  });

  // TODO: Remove inline CSS
  return (
    <Container key={post.postID} expand={expand}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", width: "100%" }}>
          {options !== false && (
            <VoteContainer>
              <VoteButton upvoted={userPostVote?.vote_value === 1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-up"
                  className="upvote"
                  onClick={() => handleVotePost(post.postID, 1)}
                />
              </VoteButton>
              <PostScore>
                {userPostVote
                  ? Math.max(post.score + userPostVote.vote_value, 0)
                  : Math.max(post.score, 0)}
              </PostScore>

              <VoteButton downvoted={userPostVote?.vote_value === -1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-down"
                  className="downvote"
                  onClick={() => handleVotePost(post.postID, -1)}
                />
              </VoteButton>
            </VoteContainer>
          )}

          <div style={{ flex: 1 }}>
            <PostHeader
              postLink={`/groups/${post.groupName.toLowerCase()}/${
                post.postID
              }`}
              title={post.title}
              postAge={moment(post.created_at).fromNow()}
              groupLink={`/groups/${post.groupName.toLowerCase()}`}
              groupName={post.groupName}
              author={post.username}
              userId={post.user_id}
            />

            {editing ? (
              <FormContainer>
                <FormField>
                  <textarea
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                </FormField>
                <ButtonGroup>
                  <button onClick={handleEditPost}>Edit post</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </ButtonGroup>
              </FormContainer>
            ) : (
              <Content expand={expand}>{postContent}</Content>
            )}

            {options !== false && (
              <PostOptions>
                <div>
                  {user.token && (
                    <FollowButton followers={10} postId={post.postID} />
                  )}
                  {user && (
                    <span>
                      {userOwnsPost ? (
                        <>
                          {viewMode && editing === false && (
                            <span onClick={() => setEditing(true)}>Edit</span>
                          )}

                          <span
                            onClick={() => setConfirmDeletion(!confirmDeletion)}
                          >
                            <FontAwesome name="trash" /> Delete
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                      {confirmDeletion && <DeleteConfirmation />}
                    </span>
                  )}
                </div>
                <CommentCountLg>
                  <div>
                    <FontAwesome name="comments" className="comment-icon" />{" "}
                    {post.total_comments} Comments
                  </div>
                </CommentCountLg>
                <CommentCountSm>
                  <div>
                    <FontAwesome name="comments" className="comment-icon" />{" "}
                    {post.total_comments}
                  </div>
                </CommentCountSm>
              </PostOptions>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Post;
