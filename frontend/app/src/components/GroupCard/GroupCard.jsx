import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, GroupBlurb } from "./GroupCard.elements";
import NavLink from "../shared/NavLink.elements";
import { Button, InvisText, Container } from "../shared/Button.elements";

import {
  subscribeToGroup,
  unsubscribeFromGroup
} from "../../reducers/groupSubscribesReducer";

export default function GroupCard({ group }) {
  const { group_name, blurb } = group;

  const dispatch = useDispatch();

  const userSubscribedGroups = useSelector(state => state.subscribedGroups);
  const loggedUser = useSelector(state => state.user);

  const handleSubscribe = () => {
    dispatch(subscribeToGroup(group, loggedUser));
  };

  const handleUnsubscribe = () => {
    dispatch(unsubscribeFromGroup(group, loggedUser));
  };

  return (
    <Card>
      <div>
        <NavLink size={"medium"} to={`/groups/${group_name.toLowerCase()}`}>
          {group_name}
        </NavLink>
        <GroupBlurb>{blurb}</GroupBlurb>
      </div>

      {(() => {
        if (
          userSubscribedGroups.find(group => group.group_name === group_name)
        ) {
          return (
            <Button size={"fill"} onClick={handleUnsubscribe}>
              <InvisText>Subscribed</InvisText>
              <Container>
                <span>Subscribed</span>
                <span>Unsubscribe</span>
              </Container>
            </Button>
          );
        } else {
          return (
            <Button color={"blue"} size={"fill"} onClick={handleSubscribe}>
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
