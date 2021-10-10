import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSelector, useDispatch } from "react-redux";

import { initializePosts, removePost } from "../../reducers/postsReducer";

import Post from "../Post/Post";

import postListHelpers from "./helpers";

import { Container } from "./PostList.elements";

const PostList = ({ sortBy, searchBy, searchTerm, posts }) => {
  const match = useRouteMatch("/groups/:group");

  const userPostVotes = useSelector(state => state.userPostVotes);

  const dispatch = useDispatch();

  let postsToDisplay = posts;

  // let postsToDisplay = useSelector(state => {
  //   let posts = [];

  //   if (!match) {
  //     posts = state.posts;
  //   } else {
  //     posts = state.posts.filter(post => {
  //       return post.groupName.toLowerCase() === match.params.group;
  //     });
  //   }

  //   // Map posts that user voted on to the post list
  //   userPostVotes.forEach(vote => {
  //     if (posts.filter(post => post.postID === vote.post_id)) {
  //       const votedPost = posts.indexOf(
  //         posts.find(post => post.postID === vote.post_id)
  //       );

  //       posts[votedPost] = { vote: vote.vote_value, ...posts[votedPost] };
  //     }
  //   });

  //   return posts
  // });

  // postsToDisplay = postListHelpers.sortPosts(
  //   postListHelpers.filterPosts(postsToDisplay)
  // );

  useEffect(() => {
    dispatch(initializePosts());
  }, []);

  return (
    <Container>
      {postsToDisplay
        .filter(post => {
          if (searchBy === "title") {
            return post.title.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (searchBy === "content") {
            return post.content
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
        })
        .map((post, index) => (
          <Post post={post} key={index} />
        ))}
    </Container>
  );
};

export default PostList;
