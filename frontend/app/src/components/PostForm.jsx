import React, { useState } from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPost } from "../reducers/postsReducer";

const FormContainer = styled.div`
  /* background-color: #ccc; */
  display: block;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;

  & button {
    width: 100%;
    margin-top: 1rem;
  }
`;

const FormField = styled.div`
  /* background-color: #aaa; */
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  & input {
    font-size: 1.5rem;
    padding: 1rem;
  }
  & textarea {
    font-size: 1.5rem;
    padding: 1rem;

    width: 100%;
    min-width: 50%;
    max-width: 100%;

    height: 400px;
    min-height: 100px;
    max-height: 1000px;
  }
`;

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSetTitle = e => {
    setTitle(e.target.value);
  };

  const handleSetContent = e => {
    setContent(e.target.value);
  };

  const addPost = e => {
    e.preventDefault();
    dispatch(createPost({ title, content }));
    history.push("/groups/all");
  };

  return (
    <FormContainer>
      <form onSubmit={addPost} id="post-form">
        <FormField>
          <label for="title">Title: </label>
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
          <label for="group">Group: </label>
          <select disabled={true}>
            <option>Group A</option>
            <option>Group B</option>
            <option>Group C</option>
          </select>
        </FormField>
      </form>
      <div>
        <FormField>
          <label for="content">Content: </label>
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
    </FormContainer>
  );
};

export default PostForm;
