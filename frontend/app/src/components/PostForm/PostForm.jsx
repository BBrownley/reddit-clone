import React, { useState, useEffect } from "react";

import groupService from "../../services/groups";

import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { createPost } from "../../reducers/postsReducer";
import { initializeVotes as initializePostVotes } from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";
import { removeNotification } from "../../reducers/notificationReducer";
import { addPostToUser } from "../../reducers/userReducer";
import { addVote } from "../../reducers/userPostVotesReducer";

import FormWarning from "../FormWarning/FormWarning";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";
import StyledLink from "../shared/NavLink.elements";

import queryString from "query-string";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(state => state.user);
  const { search } = useLocation();

  const currentGroup = queryString.parse(search).group;

  // Verify this group exists
  useEffect(() => {
    groupService.verifyGroupByName(currentGroup).then(result => {
      if (!result) {
        console.log("This group does not exist");
      }
    })
  }, []);

  // Clear notification on component unmount/view change
  useEffect(() => {
    return () => dispatch(removeNotification());
  }, [dispatch]);

  const handleSetTitle = e => {
    setTitle(e.target.value);
  };

  const handleSetGroupQuery = option => {
    setGroupQuery(option);
  };

  const handleSetContent = e => {
    setContent(e.target.value);
  };

  const addPost = async e => {
    e.preventDefault();
    const data = { title, groupID: groupQuery.id, content };

    const newPost = await dispatch(createPost(data));

    if (newPost) {
      dispatch(addVote(newPost.postID, 1));
      dispatch(initializePostVotes());
      dispatch(initializePosts());
      dispatch(addPostToUser(newPost));
      history.push(`/groups/${groupQuery.label}/${newPost.postID}`);

      // Update localStorage to reflect them adding a new post
      let user = JSON.parse(localStorage.getItem("loggedUser"));

      user = { ...user, userPosts: [...user.userPosts, newPost.postID] };
      localStorage.setItem("loggedUser", JSON.stringify(user));
    }
  };

  return (
    <>
      <div>
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
      {currentUser.userId && (
        <FormContainer>
          <FormHeader>Create a new post</FormHeader>
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
            <FormField>
              <label htmlFor="group">Group: </label>
              <Select value={groupQuery} onChange={handleSetGroupQuery} />
            </FormField>
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

            <button type="submit" form="post-form">
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
