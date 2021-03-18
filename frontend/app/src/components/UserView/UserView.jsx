import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import userService from "../../services/users";
import postService from "../../services/posts";
import commentService from "../../services/comments";

import NavLink from "../shared/NavLink.elements.js";

import Post from "../Post/Post";

import moment from "moment";

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

export default function UserView() {
  const match = useRouteMatch("/users/:id");
  const history = useHistory();

  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const [usersComments, setUsersComments] = useState([]);
  const [historyFilter, setHistoryFilter] = useState("overview");

  const loggedUserId = useSelector(state => state.user.userId);
  const [matchesLoggedUser, setMatchesLoggedUser] = useState(false);

  console.log(loggedUserId);
  console.log(loggedUserId === Number(match.params.id));

  useEffect(() => {
    // TODO: Implement caching
    const fetchUser = async () => {
      const userData = await userService.getUserById(match.params.id);
      setUser(userData);
    };

    const fetchUserPosts = async () => {
      const usersPosts = await postService.getPostsByUID(match.params.id);
      setUsersPosts(usersPosts);
      return usersPosts;
    };

    const fetchUserComments = async () => {
      const usersComments = await commentService.getCommentsByUserId(
        match.params.id
      );
      setUsersComments(usersComments);
      return usersComments;
    };

    // const fetchUserBookmarks = async () => {
    //   const usersComments = await bookmarkService.getUserBookmarks(
    //     match.params.id
    //   );
    //   setUsersComments(usersComments);
    //   return usersComments;
    // };

    fetchUser();
    fetchUserPosts();
    fetchUserComments();
    // fetchUserBookmarks();

    setMatchesLoggedUser(loggedUserId === Number(match.params.id));
  }, [loggedUserId]);

  const handleSendMessageButton = () => {
    history.push({
      pathname: "/messages/compose",
      state: {
        recipient_id: user.id
      }
    });
  };

  return (
    <div>
      <h1>Sandbox</h1>
      <Container>
        <ProfileInfo>
          <img
            src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
            alt=""
          />
          <h2>{user.username}</h2>
          <p>Posts: 0</p>
          <p>Comments: 0</p>
          <p>Account created {moment(user.created_at).fromNow()}</p>
          <button onClick={handleSendMessageButton}>Send message</button>
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
          {matchesLoggedUser && (
            <li
              className={historyFilter === "bookmarked" ? "active" : ""}
              onClick={() => setHistoryFilter("bookmarked")}
            >
              Bookmarked
            </li>
          )}
        </HistoryFilters>
        <p>This is {matchesLoggedUser ? "your account" : "not your account"}</p>
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
                        <NavLink
                          to={`/groups/${historyItem.group_name.toLowerCase()}/${
                            historyItem.post_id
                          }`}
                        >
                          {historyItem.post_title}
                        </NavLink>{" "}
                        in{" "}
                        <NavLink
                          to={`/groups/${historyItem.group_name.toLowerCase()}`}
                        >
                          {historyItem.group_name}
                        </NavLink>{" "}
                        (Commented {moment(historyItem.created_at).fromNow()})
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
