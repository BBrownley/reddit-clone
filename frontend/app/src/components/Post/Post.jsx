import React, { useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import {
  initializeVotes as initializePostVotes,
  addVote
} from "../../reducers/userPostVotesReducer";
import { initializePosts, removePost } from "../../reducers/postsReducer";

import {
  Post as Container,
  VoteContainer,
  Content,
  PostOptions,
  PostScore,
  CommentCount
} from "../PostList/PostList.elements";

import FollowButton from "../FollowButton/FollowButton";

import FontAwesome from "react-fontawesome";
import PostHeader from "../shared/PostHeader";

const Post = ({ post, options }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [confirmDeletion, setConfirmDeletion] = useState(false);

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

  const handleDeletePost = async postId => {
    dispatch(removePost(postId));
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

  return (
    <Container key={post.postID}>
      <div>
        <PostHeader
          postLink={`/groups/${post.groupName.toLowerCase()}/${post.postID}`}
          title={post.title}
          postAge={moment(post.created_at).fromNow()}
          groupLink={`/groups/${post.groupName.toLowerCase()}`}
          groupName={post.groupName}
          author={post.username}
          userId={post.user_id}
        />

        <Content>{post.content}</Content>
        {options !== false && (
          <PostOptions>
            <CommentCount>
              <FontAwesome name="comments" /> {post.total_comments}
            </CommentCount>
            <VoteContainer>
              <FontAwesome
                name="arrow-circle-up"
                className="upvote"
                onClick={() => handleUpvotePost(post.postID)}
                style={post.vote === 1 ? { color: "blue" } : {}} // Refactor this later
              />
              <PostScore>{post.score}</PostScore>
              <span></span>
              <FontAwesome
                name="arrow-circle-down"
                className="downvote"
                onClick={() => handleDownvotePost(post.postID)}
                style={post.vote === -1 ? { color: "red" } : {}} // Refactor this later
              />
            </VoteContainer>
            {user.token && <FollowButton followers={10} postId={post.postID} />}
            {user && (
              <span>
                {user.userPosts && user.userPosts.includes(post.postID) ? (
                  <span onClick={() => setConfirmDeletion(!confirmDeletion)}>
                    <FontAwesome name="trash" /> Delete
                  </span>
                ) : (
                  ""
                )}
                {confirmDeletion && <DeleteConfirmation />}
              </span>
            )}
          </PostOptions>
        )}
      </div>
    </Container>
  );
};

export default Post;
