import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import moment from "moment";

import { useSelector, useDispatch } from "react-redux";

import { initializePosts, removePost } from "../../reducers/postsReducer";

import Post from "../Post/Post";

const PostList = ({ sortBy, searchBy, searchTerm, posts = undefined }) => {
  const match = useRouteMatch("/groups/:group");

  const userPostVotes = useSelector(state => state.userPostVotes);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializePosts());
  }, [posts]);

  let postsToDisplay = useSelector(state => {
    let posts = [];

    if (!match) {
      posts = state.posts;
    } else {
      posts = state.posts.filter(post => {
        // TODO: This line causes an unexpected error sometimes
        return post.groupName.toLowerCase() === match.params.group;
      });
    }

    // Map posts that user voted on to the post list
    userPostVotes.forEach(vote => {
      if (posts.filter(post => post.postID === vote.post_id)) {
        const votedPost = posts.indexOf(
          posts.find(post => post.postID === vote.post_id)
        );

        posts[votedPost] = { vote: vote.vote_value, ...posts[votedPost] };
      }
    });

    return posts;
  });

  const mapVotesToPosts = () => {
    console.log("hey");
  };

  const filterPosts = posts => {
    let result = posts.filter(post => {
      if (searchBy === "title") {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === "content") {
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post;
      }
    });

    // Filter results if search is used
    if (!!searchTerm) {
      result = result.filter(post => {
        if (searchBy === "title") {
          return post.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchBy === "content") {
          return post.content.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return post;
        }
      });
    }
    return result;
  };

  const sortPosts = posts => {
    return posts.sort((a, b) => {
      switch (sortBy) {
        case "new":
          const timestampA = moment(a.created_at);
          const timestampB = moment(b.created_at);

          return timestampA.isAfter(timestampB) ? -1 : 1;
        case "top":
          return b.score - a.score;
        case "followers":
          return b.followers - a.followers;

        // case "commentsAsc":
        //   return a.comments.length - b.comments.length;
        // case "commentsDesc":
        //   return b.comments.length - a.comments.length;
        default:
          return null;
      }
    });
  };

  // Temporary workaround from not being able to conditionally use useSelector
  if (posts !== undefined) {
    const postsAsProps = sortPosts(filterPosts(posts));
    return postsAsProps.map(post => (
      <Post post={post} key={post.postID} />
    ));
  } else {
    postsToDisplay = sortPosts(filterPosts(postsToDisplay));
    return postsToDisplay.map(post => (
      <Post post={post} key={post.postID} />
    ));
  }
};

export default PostList;
