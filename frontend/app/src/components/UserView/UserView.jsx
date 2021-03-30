import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import userService from "../../services/users";
import postService from "../../services/posts";
import commentService from "../../services/comments";
import bookmarkService from "../../services/bookmarks";

import NavLink from "../shared/NavLink.elements.js";
import ButtonGroup from "../shared/ButtonGroup.elements";

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

export default function UserView() {
  const match = useRouteMatch("/users/:id");
  const history = useHistory();

  const [user, setUser] = useState({});
  const [usersPosts, setUsersPosts] = useState([]);
  const [usersComments, setUsersComments] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
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

    const fetchUserBookmarks = async () => {
      const userBookmarks = await bookmarkService.getAllBookmarks(
        match.params.id
      );
      console.log(userBookmarks);
      setUserBookmarks(userBookmarks);
      return usersComments;
    };

    fetchUser();
    fetchUserPosts();
    fetchUserComments();
    fetchUserBookmarks();

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
        <ButtonGroup>
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
        </ButtonGroup>
        <p>This is {matchesLoggedUser ? "your account" : "not your account"}</p>
        <UserHistory>
          <br />
          <div>
            {(() => {
              const allHistory = [
                ...usersComments,
                ...usersPosts,
                ...userBookmarks
              ]
                .sort((historyItemA, historyItemB) => {
                  const timestampA = moment(historyItemA.created_at);
                  const timestampB = moment(historyItemB.created_at);

                  return timestampA.isAfter(timestampB) ? -1 : 1;
                })
                // TODO: Refactor this
                .filter(historyItem => {
                  if (
                    historyFilter === "overview" &&
                    historyItem.type !== "bookmark"
                  ) {
                    return historyItem;
                  } else if (
                    historyFilter === "submitted" &&
                    historyItem.type !== "bookmark"
                  ) {
                    return historyItem.postID !== undefined;
                  } else if (
                    historyFilter === "comments" &&
                    historyItem.type !== "bookmark"
                  ) {
                    return historyItem.commenter_id !== undefined;
                  } else if (historyFilter === "bookmarked") {
                    return historyItem.type === "bookmark";
                  }
                });

              console.log(allHistory);

              return allHistory.map(historyItem => {
                if (historyItem.postID !== undefined) {
                  return <Post post={historyItem} options={false} />;
                } else if (historyItem.commenter_id !== undefined) {
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
                } else {
                  return <p>{historyItem.content}</p>;
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
