import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PostList from "./components/PostList";

import postService from "./services/posts";

const Wrapper = styled.div`
  max-width: 1260px;
  margin: auto;
  background-color: white;
  min-height: 100vh;
  padding: 10px;
`;

const Body = styled.div`
  background-color: #eff0f2;
  color: #333;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  min-height: 100vh;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
`;

const Branding = styled.h1`
  margin: 0;
  padding: 10px 0;
`;

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    const posts = await postService.getAll();
    setPosts(posts);
  }, []);

  return (
    <Body>
      <div className="App">
        <Wrapper>
          <Branding>Hello! ^_^</Branding>
          <PostList posts={posts} />
        </Wrapper>
      </div>
    </Body>
  );
};

export default App;
