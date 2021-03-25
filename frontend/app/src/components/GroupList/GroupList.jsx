import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Container } from "./GroupList.elements";

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

  // TODO: Try making the search into its own component (as its also being used in App.js)

  return (
    <div>
      <br />
      <h2>Here's all our groups:</h2>
      <br />
      <button onClick={handleCreateGroupButton}>Create your own group</button>
      <br />
      <br />
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
      <button className="button-small no-shadow ml-10" onClick={resetFilters}>
        Clear search
      </button>
      <Container>
        {groups.length !== 0
          ? filterGroups(groups).map(group => {
              return <GroupCard group={group} />;
            })
          : ""}
      </Container>
    </div>
  );
};

export default GroupList;
