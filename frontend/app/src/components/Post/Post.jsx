import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import { initializeVotes, addVote } from "../../reducers/userPostVotesReducer";
import { initializePosts, removePost } from "../../reducers/postsReducer";

import {
  Post as Container,
  VoteContainer,
  Content,
  PostOptions
} from "../PostList/PostList.elements";

import FontAwesome from "react-fontawesome";
import PostHeader from "../shared/PostHeader";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleUpvotePost = async postID => {
    await dispatch(addVote(postID, 1));

    dispatch(initializeVotes());
    dispatch(initializePosts());
  };

  const handleDownvotePost = async postID => {
    await dispatch(addVote(postID, -1));

    dispatch(initializeVotes());
    dispatch(initializePosts());
  };

  const handleDeletePost = async postId => {
    dispatch(removePost(postId));
  };

  return (
    <Container key={post.postID}>
      <VoteContainer>
        <FontAwesome
          name="plus-square"
          className="upvote"
          onClick={() => handleUpvotePost(post.postID)}
          style={post.vote === 1 ? { color: "blue" } : {}} // Refactor this later
        />
        <span>{post.score}</span>
        <FontAwesome
          name="minus-square"
          className="downvote"
          onClick={() => handleDownvotePost(post.postID)}
          style={post.vote === -1 ? { color: "red" } : {}} // Refactor this later
        />
      </VoteContainer>
      <div>
        <PostHeader
          postLink={`/groups/${post.groupName.toLowerCase()}/${post.postID}`}
          title={post.title}
          postAge={moment(post.createdAt).fromNow()}
          groupLink={`/groups/${post.groupName.toLowerCase()}`}
          groupName={post.groupName}
          author={post.username}
        />

        <Content>{post.content}</Content>
        <PostOptions>
          <span>
            {/* <FontAwesome name="comments" /> {post.comments.length} comments */}
          </span>
          <span className={Math.random() > 0.5 ? "favorite-active" : ""}>
            <FontAwesome name="heart" className="fa-heart" /> {post.followers} 0
            followers
          </span>
          <span>{post.postID}</span>
          <span>
            {user && user.userPosts.includes(post.postID) ? (
              <span onClick={() => handleDeletePost(post.postID)}>
                <FontAwesome name="trash" /> Delete
              </span>
            ) : (
              ""
            )}
            Are you sure?
            <span>Yes</span>
            <span>No</span>
          </span>
        </PostOptions>
      </div>
    </Container>
  );
};

export default Post;
