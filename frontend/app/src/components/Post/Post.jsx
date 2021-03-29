import React, { useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeVotes as initializePostVotes,
  addVote
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
  CommentCount
} from "../PostList/PostList.elements";

import { FormContainer, FormField, ButtonGroup } from "../shared/Form.elements";

import FollowButton from "../FollowButton/FollowButton";

import FontAwesome from "react-fontawesome";
import PostHeader from "../shared/PostHeader";

const Post = ({ post, options, expand, viewMode }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
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

  const handleUpvotePost = async postID => {
    await dispatch(addVote(postID, 1));

    dispatch(initializePostVotes());
    dispatch(initializePosts());
  };

  const handleDownvotePost = async postID => {
    await dispatch(addVote(postID, -1));

    dispatch(initializePostVotes());
    dispatch(initializePosts());
  };

  const handleEditPost = () => {
    console.log(editValue);
    console.log(post.postID);
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

  // TODO: Remove inline CSS
  return (
    <Container key={post.postID} expand={expand}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          {options !== false && (
            <VoteContainer>
              <VoteButton upvoted={userPostVote?.vote_value === 1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-up"
                  className="upvote"
                  onClick={() => handleUpvotePost(post.postID)}
                />
              </VoteButton>
              <PostScore>{post.score}</PostScore>
              <VoteButton downvoted={userPostVote?.vote_value === -1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-down"
                  className="downvote"
                  onClick={() => handleDownvotePost(post.postID)}
                />
              </VoteButton>
            </VoteContainer>
          )}

          <div>
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
                {user.token && (
                  <FollowButton followers={10} postId={post.postID} />
                )}
                {user && (
                  <span>
                    {user.userPosts && user.userPosts.includes(post.postID) ? (
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
              </PostOptions>
            )}
          </div>
        </div>
        {options !== false && (
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <CommentCount>
              <div>
                <FontAwesome name="comments" /> {post.total_comments} Comments
              </div>
            </CommentCount>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Post;
