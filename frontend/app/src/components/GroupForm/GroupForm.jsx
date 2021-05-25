import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { createGroup } from "../../reducers/groupsReducer";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";
import StyledLink from "../shared/NavLink.elements";

import groupService from "../../services/groups";

const GroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [blurb, setBlurb] = useState("");
  const [formWarning, setFormWarning] = useState(null);
  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    // Clear warning on new input
    setFormWarning(null);
  }, [groupName]);

  const validateGroupName = () => {
    // Group names must be alphanumerical and have a length of at least 1
    const alphanumeric = /^[a-zA-Z0-9]*$/;
    return alphanumeric.test(groupName.trim()) && groupName.trim().length > 0;
  };

  const handleCreateGroup = async e => {
    e.preventDefault();

    if (!validateGroupName()) {
      setFormWarning(
        "Group names must be alphanumerical without spaces, and have a length of at least 1"
      );
      return;
    }

    const formData = { groupName: groupName.trim(), blurb: blurb.trim() };

    const res = await groupService.create(formData);

    if (res.error) {
      return setFormWarning(res.error);
    }

    history.push(`/groups/${res.group_name}`);
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
            <label htmlFor="blurb">Blurb/description (optional): </label>
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

          <h3 className="warning">{formWarning}</h3>

          <button type="submit" form="group-form">
            Create Group
          </button>
        </FormContainer>
      )}
    </div>
  );
};

export default GroupForm;
