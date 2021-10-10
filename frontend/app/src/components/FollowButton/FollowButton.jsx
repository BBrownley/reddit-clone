import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-fontawesome";

import {
  followPost,
  unfollowPost,
  initializeFollows
} from "../../reducers/userReducer";

import {
  StyledPillButton,
  InvisText,
  StyledContainer
} from "./FollowButton.elements";
export default function FollowButton({ followers, postId }) {
  const dispatch = useDispatch();
  const userPostFollows = useSelector(state => {
    return state.user.postFollows;
  });

  const follow = async () => {
    dispatch(followPost(postId));
    // dispatch(initializeFollows());
  };

  const unfollow = async () => {
    dispatch(unfollowPost(postId));
    // dispatch(initializeFollows());
  };

  return (
    <div>
      {(() => {
        if (userPostFollows !== undefined && userPostFollows.includes(postId)) {
          return (
            <StyledPillButton
              color={"pink-secondary"}
              onClick={() => unfollow()}
            >
              <InvisText>
                <FontAwesome name="heart" className="fa-heart" /> Followed
              </InvisText>
              <StyledContainer>
                <span>
                  <FontAwesome name="heart" className="fa-heart" /> Followed
                </span>
                <span>Unfollow</span>
              </StyledContainer>
            </StyledPillButton>
          );
        } else {
          return (
            <StyledPillButton color={"pink-primary"} onClick={() => follow()}>
              <InvisText>{followers} followers</InvisText>
              <StyledContainer>
                <span>{followers} followers</span>
                <span>
                  <FontAwesome name="heart" className="fa-heart" /> Follow
                </span>
              </StyledContainer>
            </StyledPillButton>
          );
        }
      })()}
    </div>
  );
}
