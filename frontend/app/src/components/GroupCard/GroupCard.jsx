import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import groupService from "../../services/groups";

import { CardWrapper, Card, GroupBlurb } from "./GroupCard.elements";
import NavLink from "../shared/NavLink.elements";
import { Button, InvisText, Container } from "../shared/Button.elements";

import {
  subscribeToGroup,
  unsubscribeFromGroup
} from "../../reducers/groupSubscribesReducer";

export default function GroupCard({ group }) {
  const [groupSubs, setGroupSubs] = useState(null);

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

  useEffect(() => {
    const fetchGroup = async groupName => {
      const data = await groupService.getGroupByName(groupName);
      setGroupSubs(data.subscribers);
    };
    fetchGroup(group.group_name);
  }, []);

  return (
    <CardWrapper>
      <Card>
        <div>
          <NavLink size={"medium"} to={`/groups/${group_name.toLowerCase()}`}>
            {group_name}
          </NavLink>
          <GroupBlurb>{blurb}</GroupBlurb>
        </div>

        {(() => {
          if (!loggedUser.token) return;

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
                <InvisText>{groupSubs} subscribers</InvisText>
                <Container>
                  <span>{groupSubs} subscribers</span>
                  <span>Subscribe</span>
                </Container>
              </Button>
            );
          }
        })()}
      </Card>
    </CardWrapper>
  );
}
