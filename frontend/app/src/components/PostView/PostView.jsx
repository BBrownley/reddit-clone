import React, { useEffect, useState } from "react";

import LoadingMessage from "../LoadingMessage/LoadingMessage";
import NotFound from "../NotFound/NotFound";

import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { initializeVotes as initializeCommentVotes } from "../../reducers/commentVotesReducer";
import { initializeBookmarks } from "../../reducers/userBookmarksReducer";

import Comments from "../Comments/Comments";

import Post from "../Post/Post";
import postService from "../../services/posts";

const PostView = () => {
  const user = useSelector(state => state.user);

  const match = useRouteMatch("/groups/:group/:id");

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const initUser = async () => {
      await dispatch(initializeBookmarks(match.params.id));
      await dispatch(initializeCommentVotes());
    };
    if (user.token !== null) initUser();

    postService.getPostById(match.params.id).then(data => {
      // data.group_name, data.post_id must match route params otherwise route is invalid

      if (
        data.group_name.toLowerCase() === match.params.group.toLowerCase() &&
        Number(data.post_id) === Number(match.params.id)
      ) {
        setPost(data);
      }

      setLoading(false);
    });
  }, [dispatch]);

  return (
    <>
      {loading && <LoadingMessage />}
      {!post && !loading && <NotFound />}
      {post && (
        <div>
          <Post post={post} key={post.postID} expand={true} viewMode={true} />
          <Comments
            postId={post.post_id}
            submitterId={post.submitter_id}
            postTitle={post.title}
          />
        </div>
      )}
    </>
  );
};

export default PostView;
