import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { setUser } from "../../reducers/userReducer";

import LoadingMessage from "../LoadingMessage/LoadingMessage";

import styled from "styled-components";
import moment from "moment";

import { Message, MessageHeader } from "./InboxView.elements";
import StyledLink from "../shared/NavLink.elements";
import ButtonGroup from "../shared/ButtonGroup.elements";
import messageService from "../../services/messages";

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

export default function InboxView() {
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(null); // Determined by DB query
  const [pageInput, setPageInput] = useState(currentPage);
  const [paginationOptions, setPaginationOptions] = useState({
    type: "UNREAD"
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const history = useHistory();

  // Go back to page 1 when the filter changes
  useEffect(() => {
    setCurrentPage(1);
    setPageInput(1);
    setLoading(false);
  }, [paginationOptions.type]);

  useEffect(() => {
    // Get the max # of pages needed on load, filter change

    messageService.countPages(paginationOptions).then(result => {
      setMaxPages(result);
      setLoading(false);
    });
  }, [user, paginationOptions.type]);

  useEffect(() => {
    // When the page/filter changes, fetch the appropriate data

    messageService.paginate(paginationOptions, currentPage).then(data => {
      setMessagesToDisplay(data);
      setLoading(false);
    });
  }, [currentPage, paginationOptions.type]);

  const openMessage = message => {
    history.push({
      pathname: "/inbox/message",
      state: {
        subject: message.subject,
        sender: message.sender_username,
        senderId: message.sender_id,
        time: message.created_at,
        body: message.content,
        id: message.id
      }
    });
    messageService.setRead(message.id);
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
      {user.userId === null && (
        <>
          <h2>
            You must be logged in to view your inbox. Log in{" "}
            <StyledLink to="/login">here</StyledLink> or{" "}
            <StyledLink to="/">go to the home page</StyledLink>.
          </h2>
        </>
      )}
      {user.userId && loading && <LoadingMessage />}
      {user.userId && !loading && (
        <>
          <h1>Messages</h1>
          <ButtonGroup>
            <li
              className={paginationOptions.type === "UNREAD" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "UNREAD"
                }))
              }
            >
              Unread
            </li>
            <li
              className={paginationOptions.type === "ALL" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "ALL"
                }))
              }
            >
              All
            </li>

            <li
              className={paginationOptions.type === "SERVER" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "SERVER"
                }))
              }
            >
              Server
            </li>
            <li
              className={paginationOptions.type === "DIRECTS" ? "active" : ""}
              onClick={() =>
                setPaginationOptions(prevState => ({
                  ...prevState,
                  type: "DIRECTS"
                }))
              }
            >
              Direct Messages
            </li>
          </ButtonGroup>
          {messagesToDisplay.length === 0 && <h3>There's nothing here.</h3>}
          {messagesToDisplay.map((message, index) => (
            <Message
              className={[
                parseInt(message.has_read) === 1 ? ".message-read" : "",
                "message"
              ]}
              onClick={() => openMessage(message)}
              key={index}
            >
              <MessageHeader>
                <p>
                  <strong>
                    {message.sender_id
                      ? message.sender_username
                      : "(server message)"}
                  </strong>{" "}
                  -{" "}
                  {message.subject ? (
                    <strong>{message.subject}</strong>
                  ) : (
                    "no subject"
                  )}
                </p>
                <p>
                  {moment(message.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                </p>
              </MessageHeader>

              <p>{message.content}</p>
            </Message>
          ))}
          {messagesToDisplay.length !== 0 && (
            <Pagination>
              {currentPage > 1 && (
                <button
                  className="primary pagination-button previous"
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
                  className="primary pagination-button next"
                  onClick={handleNextButton}
                >
                  Next
                </button>
              )}
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
