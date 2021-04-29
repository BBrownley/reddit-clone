import React, { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";

import FontAwesome from "react-fontawesome";

const Container = styled.div`
  border: 1px solid black;
  display: inline-block;
  padding: 1rem;
  display: inline-flex;
`;

const ProfileImage = styled.img`
  height: 50px;
  margin-right: 1rem;
`;

const InboxLink = styled.a`
  margin-right: 2rem;
  font-weight: bold;
  color: blue;
  position: relative;
  span {
    ${props => {
      return `background-color: ${props.theme.crimson};`;
    }}
    color: white;
    padding: 0 0.5rem;
    margin-left: 0.5rem;
    border-radius: 1000px;
    font-size: .75rem;
  }
`;

export default function Sandbox() {
  return (
    <div>
      <h1>Sandbox</h1>
      <Container>
        <div>
          <ProfileImage
            src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
            alt=""
          />
        </div>
        <div>
          <p>
            <strong>Signed in as user1337</strong>
          </p>
          <InboxLink>
            Inbox<span>1</span>
          </InboxLink>
          <span>Logout</span>
        </div>
      </Container>
    </div>
  );
}
