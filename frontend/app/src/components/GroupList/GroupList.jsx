import React from "react";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setRedirectPath } from "../../reducers/redirectReducer";

const GroupList = () => {
  const groups = useSelector(state => state.groups);
  const loggedUser = useSelector(state => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleCreateGroupButton = () => {
    if (loggedUser) {
      history.push("/groups/create");
    } else {
      dispatch(setRedirectPath("/groups/create"));
      history.push({
        pathname: "/login",
        state: {
          headerMessage: "Log in to create a group",
          creatingGroup: true
        }
      });
    }
  };

  return (
    <div>
      <br />
      <h2>Here's all our groups:</h2>
      <br />
      <button onClick={handleCreateGroupButton}>Create your own group</button>
      <br />
      <br />
      {groups.map(group => {
        return (
          <div>
            <Link to={`/groups/${group.group_name.toLowerCase()}`}>
              {group.group_name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;
