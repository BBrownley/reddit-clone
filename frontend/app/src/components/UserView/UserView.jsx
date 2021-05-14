import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import userService from "../../services/users";
import postService from "../../services/posts";
import commentService from "../../services/comments";
import bookmarkService from "../../services/bookmarks";

import NotFound from "../NotFound/NotFound";

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
  margin-bottom: 2rem;
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

      setUserBookmarks(userBookmarks);
      return usersComments;
    };

    fetchUser();
    fetchUserPosts();
    fetchUserComments();
    fetchUserBookmarks();

    setMatchesLoggedUser(loggedUserId === Number(match.params.id));
  }, [match.params.id, loggedUserId]);

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
      {!user && <NotFound />}
      {user && (
        <Container>
          <ProfileInfo>
            <h2>{user.username}</h2>
            <p>Posts: 0</p>
            <p>Comments: 0</p>
            <p>Account created {moment(user.created_at).fromNow()}</p>
            {(() => {
              if (loggedUserId !== null && matchesLoggedUser === false) {
                return (
                  <button onClick={handleSendMessageButton}>
                    Send message
                  </button>
                );
              }
            })()}
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
          <UserHistory>
            <br />
            <div>
              {(() => {
                const allHistory = [
                  ...usersComments,
                  ...usersPosts,
                  ...userBookmarks
                ].sort((historyItemA, historyItemB) => {
                  const timestampA = moment(historyItemA.created_at);
                  const timestampB = moment(historyItemB.created_at);

                  return timestampA.isAfter(timestampB) ? -1 : 1;
                });

                let toBeDisplayed;

                switch (historyFilter) {
                  case "overview":
                    toBeDisplayed = allHistory.filter(
                      item => item.type !== "bookmark"
                    );
                    break;
                  case "submitted":
                    toBeDisplayed = allHistory.filter(
                      item => item.type === "post"
                    );
                    break;
                  case "comments":
                    toBeDisplayed = allHistory.filter(
                      item => item.type === "comment"
                    );
                    break;
                  case "bookmarked":
                    toBeDisplayed = allHistory.filter(
                      item => item.type === "bookmark"
                    );
                    break;
                  default:
                    return {};
                }

                return toBeDisplayed.map((item, index) => {
                  if (item.type === "post") {
                    return <Post post={item} options={false} key={index} />;
                  } else {
                    return (
                      <CommentItem key={index}>
                        <p>
                          <NavLink
                            to={`/groups/${item.group_name.toLowerCase()}/${
                              item.post_id
                            }`}
                          >
                            {item.post_title}
                          </NavLink>{" "}
                          in{" "}
                          <NavLink
                            to={`/groups/${item.group_name.toLowerCase()}`}
                          >
                            {item.group_name}
                          </NavLink>{" "}
                          (
                          {item.type === "bookmark"
                            ? "Bookmarked"
                            : "Commented"}{" "}
                          {moment(item.created_at).fromNow()})
                        </p>
                        <p>{item.content}</p>
                      </CommentItem>
                    );
                  }
                });
              })()}
            </div>
          </UserHistory>
        </Container>
      )}
    </div>
  );
}
