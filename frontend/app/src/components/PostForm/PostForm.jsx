import React, { useState } from "react";

import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPost } from "../../reducers/postsReducer";

import { FormContainer, FormField } from "../shared/Form.elements";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [groupQuery, setGroupQuery] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const groups = useSelector(state => state.groups).map(group => {
    return {
      value: group.groupName.toLowerCase(),
      label: group.groupName.toLowerCase(),
      id: group.id
    };
  });

  const handleSetTitle = e => {
    setTitle(e.target.value);
  };

  const handleSetGroupQuery = option => {
    setGroupQuery(option);
  };

  const handleSetContent = e => {
    setContent(e.target.value);
  };

  const addPost = e => {
    e.preventDefault();
    const data = { title, groupID: groupQuery.id, content };
    dispatch(createPost(data));
    history.push(`/groups/${groupQuery.label}`);
  };

  return (
    <FormContainer>
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
    </FormContainer>
  );
};

export default PostForm;

// options={[
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
//   { value: "participate", label: "participate" },
//   { value: "discriminate", label: "discriminate" },
//   { value: "communication", label: "communication" },
//   { value: "revolutionary", label: "revolutionary" },
//   { value: "disturbance", label: "disturbance" },
//   { value: "acquisition", label: "acquisition" },
//   { value: "strikebreaker", label: "strikebreaker" },
//   { value: "achievement", label: "achievement" },
//   { value: "sympathetic", label: "sympathetic" },
//   { value: "constituency", label: "constituency" },
//   { value: "preparation", label: "preparation" },
//   { value: "responsibility", label: "responsibility" },
//   { value: "miscarriage", label: "miscarriage" },
//   { value: "credibility", label: "credibility" },
//   { value: "improvement", label: "improvement" },
//   { value: "contraction", label: "contraction" },
//   { value: "conversation", label: "conversation" },
//   { value: "conservation", label: "conservation" },
//   { value: "replacement", label: "replacement" },
//   { value: "circumstance", label: "circumstance" }
// ]}
