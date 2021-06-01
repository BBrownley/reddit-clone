import React, { useState, useEffect } from "react";
import { useRouteMatch, useLocation } from "react-router-dom";
import styled from "styled-components";

import GroupInfo from "../GroupInfo/GroupInfo";
import PostList from "../PostList/PostList";
import GroupActions from "../GroupActions/GroupActions";

import NotFound from "../NotFound/NotFound";

import { GroupHeader, GroupsLoading } from "./SingleGroupView.elements";

import postService from "../../services/posts";
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

export default function SingleGroupView() {
  const [sortBy, setSortBy] = useState("new");
  const [searchBy, setSearchBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badRequest, setBadRequest] = useState(null);

  const match = useRouteMatch("/groups/:groupName");

  const [paginationOptions, setPaginationOptions] = useState({
    type: "GROUP_POSTS",
    groupName: match.params.groupName
  });
  const [postsToDisplay, setPostsToDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage);
  const [maxPages, setMaxPages] = useState(null); // Determined by DB query

  useEffect(() => {
    // Get the max # of pages needed on load

    postService.countPages(paginationOptions).then(result => {
      setMaxPages(result);
    });
  }, []);

  useEffect(() => {
    // When the page changes, fetch the appropriate data

    postService.paginate(paginationOptions, currentPage).then(data => {
      setPostsToDisplay(data);
      setLoading(false);
    });
  }, [currentPage, paginationOptions]);

  useEffect(() => {
    const fetchGroup = async () => {
      const group = await groupService.getGroupByName(match.params.groupName);
      if (group) {
        setGroup(group);
        setLoading(false);
      } else {
        setBadRequest(true);
      }
    };
    fetchGroup();
  }, [match?.params.groupname]);

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

  return (
    <div>
      {(() => {
        if (!loading) {
          return (
            <>
              {!!group && <GroupInfo group={group} />}
              <GroupHeader>
                <GroupActions group={group} />
                <div></div>
              </GroupHeader>
              <PostList
                sortBy={sortBy}
                searchBy={searchBy}
                searchTerm={searchTerm}
                posts={postsToDisplay}
              />
              {postsToDisplay.length === 0 &&
                <h3>This group doesn't have any posts. Submit one!</h3>
              }
              {postsToDisplay.length !== 0 && (
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
            </>
          );
        } else if (badRequest) {
          return <NotFound></NotFound>;
        } else {
          return <GroupsLoading>Loading</GroupsLoading>;
        }
      })()}
    </div>
  );
}
