import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { createGroup } from "../../reducers/groupsReducer";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [blurb, setBlurb] = useState("");

  const dispatch = useDispatch();

  const handleCreateGroup = e => {
    e.preventDefault();
    const formData = { groupName, blurb };
    console.log(formData);
    dispatch(createGroup(formData));
  };

  const handleSetGroupName = e => {
    setGroupName(e.target.value);
  };

  const handleSetBlurb = e => {
    setBlurb(e.target.value);
  };

  return (
    <FormContainer>
      <FormHeader>Create your own group</FormHeader>
      <form id="group-form" onSubmit={handleCreateGroup}>
        <FormField>
          <label htmlFor="group-name">Group name:</label>
          <input
            type="text"
            id="group-name"
            name="groupName"
            value={groupName}
            onChange={handleSetGroupName}
          ></input>
        </FormField>
      </form>

      <FormField>
        <label htmlFor="blurb">Blurb/description: </label>
        <div>
          <textarea
            name="blurb"
            id="blurb"
            form="group-form"
            value={blurb}
            onChange={handleSetBlurb}
            placeholder="What would you like others to know about your group?"
          ></textarea>
        </div>
      </FormField>

      <button type="submit" form="group-form">
        Create Group
      </button>
      {/* <Notification /> */}
    </FormContainer>
  );
};

export default GroupForm;
