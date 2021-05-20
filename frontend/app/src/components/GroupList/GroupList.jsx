import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";

import FontAwesome from "react-fontawesome";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Container, GroupListHeader, Wrapper } from "./GroupList.elements";

import GroupCard from "../GroupCard/GroupCard";

import { setRedirectPath } from "../../reducers/redirectReducer";

import groupService from "../../services/groups";

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

const GroupList = () => {
  const [searchBy, setSearchBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [groupsToDisplay, setGroupsToDisplay] = useState([]);
  const [maxPages, setMaxPages] = useState(null); // Determined by DB query

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage);

  const loggedUser = useSelector(state => state.user);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // Get the max # of pages needed on load

    groupService.countPages().then(result => {
      setMaxPages(result);
    });
  }, []);

  useEffect(() => {
    // When the page changes, fetch the appropriate data

    groupService.paginate(currentPage).then(data => {
      setGroupsToDisplay(data);
    });
  }, [currentPage]);

  const handleCreateGroupButton = () => {
    if (loggedUser.userId !== null) {
      history.push("/creategroup");
    } else {
      dispatch(setRedirectPath("/creategroup"));
      history.push({
        pathname: "/login",
        state: {
          headerMessage: "Log in to create a group",
          creatingGroup: true
        }
      });
    }
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

  const filterGroups = groups => {
    let result = groups.filter(group => {
      if (searchBy === "name") {
        return group.group_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchBy === "blurb") {
        return group.blurb.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return group;
      }
    });
    return result;
  };

  return (
    <Wrapper>
      <GroupListHeader>
        <button
          onClick={handleCreateGroupButton}
          className="create-group-button"
        >
          {" "}
          <FontAwesome name="users" className="fa-users" />
          Create your own group
        </button>
      </GroupListHeader>
      <Container>
        {groupsToDisplay.length !== 0
          ? filterGroups(groupsToDisplay).map((group, index) => {
              return <GroupCard group={group} key={index} />;
            })
          : ""}
      </Container>
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
          <input type="text" value={pageInput} onChange={handlePageInput} /> of{" "}
          {maxPages}
        </span>
        {currentPage < maxPages && (
          <button className="pagination-button next" onClick={handleNextButton}>
            Next
          </button>
        )}
      </Pagination>
    </Wrapper>
  );
};

export default GroupList;
