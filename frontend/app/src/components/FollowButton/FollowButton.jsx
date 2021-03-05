import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-fontawesome";

import {
  followPost,
  unfollowPost,
  initializeFollows
} from "../../reducers/userReducer";

import { InvisText, Container } from "./FollowButton.elements";
import { Button } from "../shared/Button.elements";

export default function FollowButton({ followers, postId }) {
  const dispatch = useDispatch();
  const userPostFollows = useSelector(state => {
    return state.user.postFollows;
  });

  const follow = async () => {
    await dispatch(followPost(postId));
    dispatch(initializeFollows());
  };

  const unfollow = async () => {
    await dispatch(unfollowPost(postId));
    dispatch(initializeFollows());
  };

  return (
    <div>
      {(() => {
        if (userPostFollows.includes(postId)) {
          return (
            <Button color={"pink-secondary"} onClick={() => unfollow()}>
              <InvisText>
                <FontAwesome name="heart" className="fa-heart" /> Followed
              </InvisText>
              <Container>
                <span>
                  <FontAwesome name="heart" className="fa-heart" /> Followed
                </span>
                <span>Unfollow</span>
              </Container>
            </Button>
          );
        } else {
          return (
            <Button color={"pink-secondary"} onClick={() => follow()}>
              <InvisText>{followers} followers</InvisText>
              <Container>
                <span>{followers} followers</span>
                <span>
                  <FontAwesome name="heart" className="fa-heart" /> Follow
                </span>
              </Container>
            </Button>
          );
        }
      })()}
    </div>
  );
}
