import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";

import NavLink from "./shared/NavLink.elements.js";

import Post from "./Post/Post";

import postService from "../services/posts";
import commentService from "../services/comments";

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

const CommentItem = styled.div`
  padding: 10px 10px 10px 5px;
  border-bottom: 1px solid #dddddd;
`;

const HistoryFilters = styled.ul`
  display: flex;
  margin-left: -10px;
  /* justify-content: center; */
  li {
    margin: 10px;
    padding: 10px;
    border: 1px solid #eee;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
  li:hover {
    cursor: pointer;
    background-color: #4385f5;
    color: white;
    transition: 0.2s all;
  }
  li[class="active"] {
    background-color: #4385f5;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  }
`;

export default function Sandbox() {
  const [usersPosts, setUsersPosts] = useState([]);
  const [usersComments, setUsersComments] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("overview");

  useEffect(() => {
    // TODO: Implement caching for filter state changes
    const fetchUserPosts = async () => {
      const usersPosts = await postService.getPostsByUID(25);
      setUsersPosts(usersPosts);
      return usersPosts;
    };
    const fetchUserComments = async () => {
      const usersComments = await commentService.getCommentsByUserId(25);
      setUsersComments(usersComments);
      return usersComments;
    };
    fetchUserPosts();
    fetchUserComments();
  }, []);

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
        <HistoryFilters>
          <li
            className={historyFilter === "overview" ? "active" : ""}
            onClick={() => setHistoryFilter("overview")}
          >
            Overview
          </li>
          <li
            className={historyFilter === "submitted" ? "active" : ""}
            onClick={() => setHistoryFilter("submitted")}
          >
            Submitted
          </li>
          <li
            className={historyFilter === "comments" ? "active" : ""}
            onClick={() => setHistoryFilter("comments")}
          >
            Comments
          </li>
          <li
            className={historyFilter === "bookmarked" ? "active" : ""}
            onClick={() => setHistoryFilter("bookmarked")}
          >
            Bookmarked
          </li>
        </HistoryFilters>
        <UserHistory>
          <br />
          <div>
            {(() => {
              const allHistory = [...usersComments, ...usersPosts]
                .sort((historyItemA, historyItemB) => {
                  const timestampA = moment(historyItemA.created_at);
                  const timestampB = moment(historyItemB.created_at);

                  return timestampA.isAfter(timestampB) ? -1 : 1;
                })
                .filter(historyItem => {
                  if (historyFilter === "overview") {
                    return historyItem;
                  } else if (historyFilter === "submitted") {
                    return historyItem.postID !== undefined;
                  } else if (historyFilter === "comments") {
                    return historyItem.commenter_id !== undefined;
                  }
                });

              console.log([...usersComments, ...usersPosts]);

              return allHistory.map(historyItem => {
                if (historyItem.postID !== undefined) {
                  return <Post post={historyItem} options={false} />;
                } else {
                  return (
                    <CommentItem>
                      <p>
                        <NavLink to="/">NBA predictions</NavLink> in{" "}
                        <NavLink to="/">Sports</NavLink> (Commented{" "}
                        {moment(historyItem.created_at).fromNow()})
                      </p>
                      <p>{historyItem.content}</p>
                    </CommentItem>
                  );
                }
              });
            })()}
          </div>
          {/* {usersPosts.map(post => (
            <Post post={post} options={false} />
          ))} */}
        </UserHistory>
      </Container>
    </div>
  );
}

/*

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
  
*/
