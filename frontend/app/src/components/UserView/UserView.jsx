import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import userService from "../../services/users";
import postService from "../../services/posts";
import commentService from "../../services/comments";
import bookmarkService from "../../services/bookmarks";
import userHistoryService from "../../services/userHistory";

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
  border-bottom: 1px solid #dddddd;
  margin-bottom: 1rem;
  padding: 0 0.625rem 1rem 0.25rem;
`;

const Pagination = styled.div`
  .pagination-button {
    font-size: 1rem;
    &.previous {
      margin-right: 1rem;
    }
    &.next {
      margin-left: 1rem;
    }
  }
  input {
    width: 3rem;
    text-align: center;
  }
`;

export default function UserView() {
  const match = useRouteMatch("/users/:id");
  const history = useHistory();

  const [user, setUser] = useState({});

  const loggedUserId = useSelector(state => state.user.userId);
  const [matchesLoggedUser, setMatchesLoggedUser] = useState(false);

  const [paginationOptions, setPaginationOptions] = useState({
    type: "OVERVIEW",
    userId: match.params.id
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage);
  const [maxPages, setMaxPages] = useState(null); // Determined by DB query

  const [historyToDisplay, setHistoryToDisplay] = useState([]);

  useEffect(() => {
    // Get the max # of pages needed on load, type change
    userHistoryService.countPages(paginationOptions).then(result => {
      setMaxPages(result);
    });
    setCurrentPage(1);
    setPageInput(1);
  }, [paginationOptions.type]);

  useEffect(() => {
    // When the page/type changes, fetch the appropriate data

    userHistoryService.paginate(paginationOptions, currentPage).then(data => {
      setHistoryToDisplay(data);
    });
  }, [currentPage, paginationOptions.type]);

  useEffect(() => {
    userService.getUserById(match.params.id).then(data => {
      setUser(data);
    });

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

  const handlePageInput = e => {
    // Allow integers only

    let sanitizedInput = "";

    for (let i = 0; i < e.target.value.length; i++) {
      const currentCharCode = e.target.value.charAt(i).charCodeAt(0);
      if (currentCharCode >= 48 && currentCharCode <= 57) {
        sanitizedInput = sanitizedInput.concat(e.target.value.charAt(i));
      }
    }

    // Cannot exceed max pages, must be at least 1
    if (parseInt(sanitizedInput) > maxPages) {
      sanitizedInput = maxPages;
    } else if (sanitizedInput.length === 0) {
      sanitizedInput = 1;
    }

    setPageInput(sanitizedInput);
    setCurrentPage(sanitizedInput);
  };

  const handlePrevButton = () => {
    setCurrentPage(prevState => prevState - 1);
    setPageInput(prevState => prevState - 1);
    window.scrollTo(0, 0);
  };

  const handleNextButton = () => {
    setCurrentPage(prevState => prevState + 1);
    setPageInput(prevState => prevState + 1);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {!user && <NotFound />}
      {user && (
        <Container>
          <ProfileInfo>
            <h2>{user.username}</h2>
            <p>Account created {moment(user.created_at).fromNow()}</p>
            {(() => {
              if (loggedUserId !== null && matchesLoggedUser === false) {
                return (
                  <button onClick={handleSendMessageButton} id="send-message">
                    Send message
                  </button>
                );
              }
            })()}
          </ProfileInfo>
          <ButtonGroup>
            <li
              className={paginationOptions.type === "OVERVIEW" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "OVERVIEW"
                }))
              }
            >
              Overview
            </li>
            <li
              className={paginationOptions.type === "SUBMITTED" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "SUBMITTED"
                }))
              }
            >
              Submitted
            </li>
            <li
              className={paginationOptions.type === "COMMENTS" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "COMMENTS"
                }))
              }
            >
              Comments
            </li>
            {matchesLoggedUser && (
              <li
                className={
                  paginationOptions.type === "BOOKMARKED" ? "active" : ""
                }
                onClick={() =>
                  setPaginationOptions(prevState => ({
                    ...prevState,
                    type: "BOOKMARKED"
                  }))
                }
              >
                Bookmarked
              </li>
            )}
          </ButtonGroup>
          <UserHistory>
            <br />
            <div>
              {(() => {
                return historyToDisplay.map((item, index) => {
                  if (item.comment_body === null) {
                    console.log(item);
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
                            {item.title}
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
                        <p>{item.comment_body}</p>
                      </CommentItem>
                    );
                  }
                });
              })()}
            </div>
          </UserHistory>
          {historyToDisplay.length === 0 &&
            paginationOptions.type !== "BOOKMARKED" && (
              <h3>No relevant history found for this user</h3>
            )}
          {historyToDisplay.length === 0 &&
            paginationOptions.type === "BOOKMARKED" && (
              <h3>Bookmark comments you like and view them all here!</h3>
            )}
          {historyToDisplay.length !== 0 && (
            <Pagination>
              {currentPage > 1 && (
                <button
                  className="pagination-button previous"
                  onClick={handlePrevButton}
                >
                  Previous
                </button>
              )}

              <span>
                Page{" "}
                <input
                  type="text"
                  value={pageInput}
                  onChange={handlePageInput}
                />{" "}
                of {maxPages}
              </span>
              {currentPage < maxPages && (
                <button
                  className="pagination-button next"
                  onClick={handleNextButton}
                >
                  Next
                </button>
              )}
            </Pagination>
          )}
        </Container>
      )}
    </div>
  );
}
