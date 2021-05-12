import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import FontAwesome from "react-fontawesome";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Container, GroupListHeader } from "./GroupList.elements";

import GroupCard from "../GroupCard/GroupCard";

import { setRedirectPath } from "../../reducers/redirectReducer";

const GroupList = () => {
  const [searchBy, setSearchBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const groups = useSelector(state => state.groups);
  const loggedUser = useSelector(state => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleCreateGroupButton = () => {
    if (loggedUser) {
      history.push("/creategroup");
    } else {
      dispatch(setRedirectPath("/creategroup"));
      history.push({
        pathname: "/login",
        state: {
          headerMessage: "Log in to create a group",
          creatingGroup: true
        }
      });
    }
  };

  const resetFilters = () => {
    setSearchBy("name");
    setSearchTerm("");
  };

  const filterGroups = groups => {
    let result = groups.filter(group => {
      if (searchBy === "name") {
        return group.group_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchBy === "blurb") {
        return group.blurb.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return group;
      }
    });
    return result;
  };

  return (
    <div>
      <GroupListHeader>
        <button onClick={handleCreateGroupButton} className="create-group-button"> <FontAwesome name="users" className="fa-users" />Create your own group</button>
        <div>
          <strong>
            Search groups by{" "}
            <select
              name="searchOption"
              id="search-option"
              onChange={e => setSearchBy(e.target.value)}
              value={searchBy}
            >
              <option value="name">Name</option>
              <option value="blurb">Blurb</option>
            </select>
            :{" "}
          </strong>
          <input
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
          ></input>

          <button
            className="button-small no-shadow ml-10"
            onClick={resetFilters}
          >
            Clear search
          </button>
        </div>
      </GroupListHeader>
      <Container>
        {groups.length !== 0
          ? filterGroups(groups).map((group, index) => {
              return <GroupCard group={group} key={index} />;
            })
          : ""}
      </Container>
    </div>
  );
};

export default GroupList;
