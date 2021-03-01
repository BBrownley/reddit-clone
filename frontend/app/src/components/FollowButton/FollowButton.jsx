import React from "react";
import FontAwesome from "react-fontawesome";

import { Button, InvisText, Container } from "./FollowButton.elements";

export default function FollowButton({ followers }) {
  return (
    <Button>
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
