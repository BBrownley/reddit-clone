import React, { useState, useEffect } from "react";

import groupService from "../../services/groups";
import postService from "../../services/posts";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { initializeVotes as initializePostVotes } from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";
import { removeNotification } from "../../reducers/notificationReducer";
import { addUserPost } from "../../reducers/userPostsReducer";
import { timedToast } from "../../reducers/toastReducer";

import FormWarning from "../FormWarning/FormWarning";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";
import StyledLink from "../shared/NavLink.elements";

import queryString from "query-string";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(state => state.user);
  const { search } = useLocation();

  const currentGroup = queryString.parse(search).group;
  const [groupName, setGroupName] = useState(null);
  const [groupId, setGroupId] = useState(null);

  // Verify this group exists
  useEffect(() => {
    groupService.verifyGroupByName(currentGroup).then(result => {
      if (!result) {
        console.log("This group does not exist");
      } else {
        setGroupName(currentGroup);
        setGroupId(result);
      }
    });
  }, []);

  // Clear notification on component unmount/view change
  useEffect(() => {
    return () => dispatch(removeNotification());
  }, [dispatch]);

  const handleSetTitle = e => {
    setTitle(e.target.value);
  };

  const handleSetContent = e => {
    setContent(e.target.value);
  };

  const addPost = async e => {
    e.preventDefault();
    const data = { title, group_id: groupId, content };

    const newPost = await postService.createPost(data);

    if (newPost) {
      dispatch(initializePostVotes());
      dispatch(initializePosts());
      dispatch(addUserPost(newPost));
      history.push(`/groups/${groupName}/${newPost.post_id}`);

      // Update localStorage to reflect them adding a new post
      let user = JSON.parse(localStorage.getItem("loggedUser"));

      user = { ...user, userPosts: [...user.userPosts, newPost.post_id] };
      localStorage.setItem("loggedUser", JSON.stringify(user));
      dispatch(timedToast("Post created"));
    }
  };

  return (
    <>
      <div>
        {groupName === null && (
          <p>
            The group "{currentGroup}" does not exist.{" "}
            <StyledLink to="/groups">Browse our existing groups</StyledLink>.
          </p>
        )}
        {currentUser.userId === null && (
          <>
            <h2>
              You must be logged in to create a post.{" "}
              <StyledLink to="/login">Log in</StyledLink> or{" "}
              <StyledLink to="/">go to the home page</StyledLink>.
            </h2>
          </>
        )}
      </div>
      {currentUser.userId && !!groupName && (
        <FormContainer>
          <FormHeader>
            Create a new post for <strong>{groupName}</strong>
          </FormHeader>
          <form onSubmit={addPost} id="post-form">
            <FormField>
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="title"
                value={title}
                onChange={handleSetTitle}
              ></input>
            </FormField>
            {/* <FormField>
              <label htmlFor="group">Group: </label>
              <Select value={groupQuery} onChange={handleSetGroupQuery} />
            </FormField> */}
          </form>
          <div>
            <FormField>
              <label htmlFor="content">Content: </label>
              <div>
                <textarea
                  name="content"
                  form="post-form"
                  value={content}
                  onChange={handleSetContent}
                ></textarea>
              </div>
            </FormField>

            <button type="submit" form="post-form" className="primary">
              Create Post
            </button>
          </div>
          <FormWarning />
        </FormContainer>
      )}
    </>
  );
};

export default PostForm;
