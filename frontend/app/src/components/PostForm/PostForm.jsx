import React, { useState, useEffect } from "react";

import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPost } from "../../reducers/postsReducer";
import { initializeVotes } from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";
import { removeNotification } from "../../reducers/notificationReducer";
import { addPostToUser } from "../../reducers/userReducer";

import Notification from "../../components/Notification/Notification";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

import postService from "../../services/posts";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const groups = useSelector(state => state.groups).map(group => {
    return {
      value: group.group_name.toLowerCase(),
      label: group.group_name.toLowerCase(),
      id: group.id
    };
  });

  // Clear notification on component unmount/view change
  useEffect(() => {
    return () => dispatch(removeNotification());
  }, []);

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

    console.log(newPost);

    if (newPost) {
      dispatch(initializeVotes());
      dispatch(initializePosts());
      dispatch(addPostToUser(newPost));
      history.push(`/groups/${groupQuery.label}/${newPost.postID}`);
    }
  };

  return (
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
          <Select
            value={groupQuery}
            onChange={handleSetGroupQuery}
            options={groups}
          />
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
      <Notification />
    </FormContainer>
  );
};

export default PostForm;
