import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { createGroup } from "../../reducers/groupsReducer";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";
import StyledLink from "../shared/NavLink.elements";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [blurb, setBlurb] = useState("");
  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const history = useHistory();

  const handleCreateGroup = async e => {
    e.preventDefault();
    const formData = { groupName, blurb };

    const response = await dispatch(createGroup(formData));

    if (response) {
      history.push(`/groups/${response.group_name}`);
    }
  };

  const handleSetGroupName = e => {
    setGroupName(e.target.value);
  };

  const handleSetBlurb = e => {
    setBlurb(e.target.value);
  };

  return (
    <div>
      <div>
        {user.userId === null && (
          <>
            <h2>
              You must be logged in to create a group. Log in{" "}
              <StyledLink to="/login">here</StyledLink> or{" "}
              <StyledLink to="/">go to the home page</StyledLink>.
            </h2>
          </>
        )}
      </div>
      {user.userId && (
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
        </FormContainer>
      )}
    </div>
  );
};

export default GroupForm;
