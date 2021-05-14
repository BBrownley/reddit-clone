import React from "react";

import { GroupInfo as Container } from "./GroupInfo.elements";

const GroupInfo = ({ group }) => {

  return (
    <Container>
      <div className="group-info-main">
        <h1>{group.group_name}</h1>
        <p>{group.subscribers} subscribers</p>
        <p className="group-desc">{group.blurb}</p>
      </div>
    </Container>
  );
};

export default GroupInfo;
