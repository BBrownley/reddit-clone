import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSelector, useDispatch } from "react-redux";

import { initializePosts, removePost } from "../../reducers/postsReducer";

import Post from "../Post/Post";

import postListHelpers from "./helpers";

import { Container } from "./PostList.elements";

const PostList = ({ sortBy, searchBy, searchTerm, posts = undefined }) => {
  const match = useRouteMatch("/groups/:group");

  const userPostVotes = useSelector(state => state.userPostVotes);

  const increment = 20;

  const [currentIndex, setCurrentIndex] = useState(20);

  const dispatch = useDispatch();

  let postsToDisplay = useSelector(state => {
    let posts = [];

    if (!match) {
      posts = state.posts;
    } else {
      posts = state.posts.filter(post => {
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

    return posts.slice(0, currentIndex);
  });

  postsToDisplay = postListHelpers.sortPosts(
    postListHelpers.filterPosts(postsToDisplay)
  );

  const continueScroll = () => {
    setCurrentIndex(prevState => prevState + increment);
  };

  useEffect(() => {
    dispatch(initializePosts());
  }, []);

  return (
    <Container>
      <InfiniteScroll
        dataLength={currentIndex}
        next={continueScroll}
        hasMore={true}
        scrollThreshold={1}
      >
        {postsToDisplay.map(post => (
          <Post post={post} key={post.postID} />
        ))}
      </InfiniteScroll>
    </Container>
  );
};

export default PostList;
