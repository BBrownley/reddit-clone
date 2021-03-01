import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import moment from "moment";

import { initializeVotes, addVote } from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";

import FontAwesome from "react-fontawesome";

import Comments from "../Comments/Comments";

import { Post, VoteContainer, Content, PostOptions } from "./PostView.elements";

import FollowButton from "../FollowButton/FollowButton";

import PostHeader from "../shared/PostHeader";

const PostView = () => {
  const posts = useSelector(state => {
    console.log(state);
    return state.posts;
  });
  console.log(posts);
  const match = useRouteMatch("/groups/:group/:id");
  const post = match
    ? posts.find(post => post.postID.toString() === match.params.id.toString())
    : null;
  console.log(post);
  const userPostVote = useSelector(state => {
    state.userPostVotes.find(vote => {
      return vote.post_id === post.postID;
    });
  });
  const dispatch = useDispatch();

  if (!post) {
    return null;
  }

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

  const styleVoteButton = type => {
    if (userPostVote === undefined) {
      return;
    } else if (userPostVote.vote_value === 1 && type === "upvote") {
      return { color: "blue" };
    } else if (userPostVote.vote_value === -1 && type === "downvote") {
      return { color: "red" };
    }
  };

  return (
    <>
      <Post>
        <VoteContainer>
          <FontAwesome
            name="plus-square"
            className="upvote"
            onClick={() => handleUpvotePost(post.postID)}
            style={styleVoteButton("upvote")}
          />
          <span>{post.score}</span>
          <FontAwesome
            name="minus-square"
            className="downvote"
            onClick={() => handleDownvotePost(post.postID)}
            style={styleVoteButton("downvote")}
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
            {/* <FollowButton>
              <FontAwesome name="heart" className="fa-heart" /> Follow
            </FollowButton> */}
            <FollowButton followers={10}/>
          </PostOptions>
        </div>
      </Post>
      <Comments
        postId={post.postID}
        authorId={post.user_id}
        postTitle={post.title}
      />
    </>
  );
};

export default PostView;
