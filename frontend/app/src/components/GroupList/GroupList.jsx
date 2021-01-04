import React from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GroupList = () => {
  const groups = useSelector(state => state.groups);

  console.log(groups);

  return (
    <div>
      <br />
      <h2>Here's all our groups:</h2>
      <br />
      {groups.map(group => {
        return (
          <div>
            <Link to={`/groups/${group.groupName.toLowerCase()}`}>
              {group.groupName}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;
