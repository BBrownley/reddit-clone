import React from "react";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";

import Post from "./Post/Post";

const Container = styled.div`
  /* display: flex; */
`;

const ProfileInfo = styled.div`
  text-align: center;
  line-height: 2;
  img {
    height: 150px;
  }
`;

const UserHistory = styled.div`
  flex: 1;
`;


export default function Sandbox() {
  const posts = [
    {
      score: 1,
      title: "dsfgdsfg",
      createdAt: "2021-02-27T04:29:50.000Z",
      postID: 212,
      groupName: "Sports",
      groupID: 3,
      username: "user1337",
      user_id: 25,
      content: "dsfgdsfgsdfg"
    },
    {
      score: 1,
      title: "fgdh",
      createdAt: "2021-02-26T21:18:28.000Z",
      postID: 211,
      groupName: "Sports",
      groupID: 3,
      username: "user1337",
      user_id: 25,
      content: "dfghfgdh"
    },
    {
      score: 1,
      title: "comments",
      createdAt: "2021-02-23T05:01:59.000Z",
      postID: 210,
      groupName: "Health",
      groupID: 5,
      username: "user1337",
      user_id: 25,
      content: "retgserg"
    },
    {
      score: 1,
      title: "dsfgdsfg",
      createdAt: "2021-02-23T05:00:48.000Z",
      postID: 209,
      groupName: "Clothing",
      groupID: 4,
      username: "user1337",
      user_id: 25,
      content: "dfsgdfsg"
    },
    {
      score: 1,
      title: "fgdhdfh",
      createdAt: "2021-02-21T03:25:49.000Z",
      postID: 207,
      groupName: "Clothing",
      groupID: 4,
      username: "user1337",
      user_id: 25,
      content: "fdghdfgh"
    },
    {
      score: 1,
      title: "srfgerg",
      createdAt: "2021-02-21T02:46:34.000Z",
      postID: 206,
      groupName: "mysecondgroup2",
      groupID: 22,
      username: "user1337",
      user_id: 25,
      content: "resgserg"
    }
  ];

  return (
    <div>
      <h1>Sandbox</h1>
      <Container>
        <ProfileInfo>
          <img
            src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
            alt=""
          />
          <h2>Mark Ellis</h2>
          <p>Posts: 0</p>
          <p>Comments: 0</p>
          <p>Account created: Jan 1 2021</p>
          <button>Send message</button>
        </ProfileInfo>
        <UserHistory>
          <br/>
          {posts.map(post => (
            <Post post={post} />
          ))}
        </UserHistory>
      </Container>
    </div>
  );
}
