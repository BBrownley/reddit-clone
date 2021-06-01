import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

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

import postService from "../../services/posts";
import userPostVotesService from "../../services/userPostVotes";

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

import { FormContainer, FormField } from "../shared/Form.elements";
import ButtonGroup from "../shared/ButtonGroup.elements";
import FollowButton from "../FollowButton/FollowButton";

import FontAwesome from "react-fontawesome";
import PostHeader from "../shared/PostHeader";

const Post = ({ post, options, expand, viewMode }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const userPosts = useSelector(state => state.userPosts);
  const userPostVote = useSelector(state =>
    state.userPostVotes.find(vote => {
      return vote.post_id === post.post_id;
    })
  );
  const [postScore, setPostScore] = useState(post.score);

  const history = useHistory();

  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.post_body);
  const [postContent, setPostContent] = useState(post.post_body);

  const handleVotePost = async (postId, clickedValue) => {
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
        await userPostVotesService.changePostVote(postId, clickedValue);
      } else {
        dispatch(removeVote(postId));
        await userPostVotesService.removePostVote(postId);
      }
    } else {
      dispatch(addVote(postId, clickedValue));
      await postService.vote(postId, clickedValue);
    }

    const newScore = await postService.getPostScore(postId);
    setPostScore(newScore);
  };

  const handleEditPost = () => {
    dispatch(editPost(post.post_id, editValue));
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

  const userOwnsPost = userPosts.find(userPost => {
    return userPost === post.post_id;
  });

  return (
    <Container key={post.post_id} expand={expand}>
      <div>
        <div>
          {options !== false && (
            <VoteContainer>
              <VoteButton upvoted={userPostVote?.vote_value === 1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-up"
                  className="upvote"
                  onClick={() => handleVotePost(post.post_id, 1)}
                />
              </VoteButton>
              <PostScore>{Math.max(postScore, 0)}</PostScore>

              <VoteButton downvoted={userPostVote?.vote_value === -1 ? 1 : 0}>
                <FontAwesome
                  name="arrow-circle-down"
                  className="downvote"
                  onClick={() => handleVotePost(post.post_id, -1)}
                />
              </VoteButton>
            </VoteContainer>
          )}

          <div style={{ flex: 1 }}>
            <PostHeader
              postLink={`/groups/${post.group_name.toLowerCase()}/${
                post.post_id
              }`}
              title={post.title}
              postAge={moment(post.created_at).fromNow()}
              groupLink={`/groups/${post.group_name.toLowerCase()}`}
              groupName={post.group_name}
              author={post.username}
              submitter_id={post.submitter_id}
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
                  <li onClick={handleEditPost} className="active">
                    Edit post
                  </li>
                  <li onClick={handleCancelEdit}>Cancel</li>
                </ButtonGroup>
              </FormContainer>
            ) : (
              <Content expand={expand}>{postContent}</Content>
            )}

            {options !== false && (
              <PostOptions>
                <div>
                  {user.token && (
                    <FollowButton
                      followers={post.follows}
                      postId={post.post_id}
                    />
                  )}
                  {user && (
                    <span>
                      {userOwnsPost ? (
                        <ButtonGroup>
                          {viewMode && editing === false && (
                            <li onClick={() => setEditing(true)}>Edit</li>
                          )}

                          <div className="pos-rel">
                            <li
                              onClick={() =>
                                setConfirmDeletion(!confirmDeletion)
                              }
                            >
                              <FontAwesome name="trash" /> Delete
                            </li>
                            {confirmDeletion && (
                              <DeleteConfirmation
                                confirmDelete={() =>
                                  handleDeletePost(post.post_id)
                                }
                                cancel={() => setConfirmDeletion(false)}
                              />
                            )}
                          </div>
                        </ButtonGroup>
                      ) : (
                        ""
                      )}
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
