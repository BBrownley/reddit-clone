import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import moment from "moment";

import {
  initializeVotes as initializePostVotes,
  addVote
} from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";

import { initializeVotes as initializeCommentVotes } from "../../reducers/commentVotesReducer";
import { initializeBookmarks } from "../../reducers/userBookmarksReducer";

import FontAwesome from "react-fontawesome";

import Comments from "../Comments/Comments";

// import { Post, VoteContainer, Content, PostOptions } from "./PostView.elements";

import Post from "../Post/Post";

import FollowButton from "../FollowButton/FollowButton";

import PostHeader from "../shared/PostHeader";

const PostView = () => {
  const posts = useSelector(state => {
    return state.posts;
  });

  const match = useRouteMatch("/groups/:group/:id");
  const post = match
    ? posts.find(post => post.postID.toString() === match.params.id.toString())
    : null;

  const userPostVote = useSelector(state => {
    state.userPostVotes.find(vote => {
      return vote.post_id === post.postID;
    });
  });

  const userCommentVotes = useSelector(state => {
    return state.userCommentVotes.filter(vote => (vote.post_id = post.postID));
  });

  const user = useSelector(state => state.user);

  console.log(userCommentVotes);

  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      await dispatch(initializeBookmarks(match.params.id));
      await dispatch(initializeCommentVotes());
    };
    init();
  }, [dispatch]);

  if (!post) {
    return null;
  }

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
      <Post post={post} key={post.postID} expand={true} />
      <Comments
        postId={post.postID}
        authorId={post.user_id}
        postTitle={post.title}
      />
    </>
  );
};

export default PostView;
