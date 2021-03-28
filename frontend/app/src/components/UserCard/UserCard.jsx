import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Container, ProfileImage, InboxLink } from "./UserCard.elements";

const StyledLink = styled(Link)`
  color: #4385f5;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export default function UserCard({ username, handleLogout }) {
  return (
    <div>
      <Container>
        <div>
          <ProfileImage
            src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
            alt=""
          />
        </div>
        <div>
          <p>
            <strong>Signed in as {username}</strong>
          </p>
          <InboxLink to="/inbox">
            Inbox<span>1</span>
          </InboxLink>
          <StyledLink onClick={handleLogout}>Logout</StyledLink>
        </div>
      </Container>
    </div>
  );
}
