import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";

import { GroupInfo as Container } from "./GroupInfo.elements";

import groupService from "../../services/groups";

const GroupInfo = () => {
  const [group, setGroup] = useState({});

  const groupMatch = useRouteMatch("/groups/:groupName");
   

  useEffect(() => {
    const fetchGroup = async groupName => {
      const data = await groupService.getGroupByName(groupName);
      setGroup(data);
    };
    fetchGroup(groupMatch.params.groupName);
  }, []);

  return (
    <Container>
      <div className="group-info-main">
        <h1>{group.group_name}</h1>
        <p>0 subscribers</p>
        <p className="group-desc">{group.blurb}</p>
      </div>
    </Container>
  );
};

export default GroupInfo;
