import React from "react";
import { useSelector } from "react-redux";
import { Card, GroupBlurb } from "./GroupCard.elements";
import NavLink from "../shared/NavLink.elements";
import { Button, InvisText, Container } from "../shared/Button.elements";

export default function GroupCard({ groupName, blurb }) {
  const userSubscribedGroups = useSelector(state => state.subscribedGroups);

  return (
    <Card>
      <div>
        <NavLink size={"medium"} to={`/groups/${groupName.toLowerCase()}`}>
          {groupName}
        </NavLink>
        <GroupBlurb>{blurb}</GroupBlurb>
      </div>

      {(() => {
        if (
          userSubscribedGroups.find(group => group.group_name === groupName)
        ) {
          return (
            <Button size={"fill"}>
              <InvisText>Subscribed</InvisText>
              <Container>
                <span>Subscribed</span>
                <span>Unsubscribe</span>
              </Container>
            </Button>
          );
        } else {
          return (
            <Button color={"blue"} size={"fill"}>
              <InvisText>10 subscribers</InvisText>
              <Container>
                <span>10 subscribers</span>
                <span>Subscribe</span>
              </Container>
            </Button>
          );
        }
      })()}
    </Card>
  );
}
