import React from "react";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";

const Container = styled.div`
  text-align: center;
`;

export default function LoadingMessage() {
  return (
    <Container>
      <BeatLoader />
      <p>
        Loading; please wait. This may take a few seconds if the server is
        sleeping
      </p>
    </Container>
  );
}
