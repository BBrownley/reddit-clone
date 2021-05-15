import React, { useState, useEffect } from "react";
import { useRouteMatch, useLocation } from "react-router-dom";

import GroupInfo from "../GroupInfo/GroupInfo";
import PostList from "../PostList/PostList";
import GroupActions from "../GroupActions/GroupActions";

import NotFound from "../NotFound/NotFound";

import { GroupHeader, GroupsLoading } from "./SingleGroupView.elements";

import groupService from "../../services/groups";

export default function SingleGroupView({ all, handleSetGroupExists }) {
  const [sortBy, setSortBy] = useState("new");
  const [searchBy, setSearchBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badRequest, setBadRequest] = useState(null);

  const match = useRouteMatch("/groups/:groupname");

  const handleSortBy = e => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  const handleSearchBy = e => {
    const searchByValue = e.target.value;
    setSearchBy(searchByValue);
  };

  const handleSearchTerm = e => {
    const searchByValue = e.target.value;
    setSearchTerm(searchByValue);
  };

  const resetFilters = () => {
    setSearchBy("title");
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchGroup = async () => {
      const group = await groupService.getGroupByName(match.params.groupname);
      if (group) {
        setGroup(group);
        setLoading(false);
      } else {
        setBadRequest(true);
      }
    };

    if (!all) fetchGroup();

    return () => {
      handleSetGroupExists(true);
    };
  }, [match?.params.groupname]);

  return (
    <div>
      {(() => {
        if (all || !loading) {
          return (
            <>
              {!all && (
                <GroupInfo
                  handleSetGroupExists={handleSetGroupExists}
                  group={group}
                />
              )}
              <GroupHeader>
                <GroupActions />
                <div>
                  {/* <strong>Sort posts by:</strong>
            <select
              name="sortBy"
              id="sort-by"
              onChange={handleSortBy}
              value={sortBy}
            >
              <option value="new">New</option>
              <option value="top">Top</option>
              <option value="followers">Followers</option>
              <option value="commentsDesc">Comments (high to low)</option>
              <option value="commentsAsc">Comments (low to high)</option>
            </select> */}
                  {/* <strong>
                    Search posts by{" "}
                    <select
                      name="searchOption"
                      id="search-option"
                      onChange={handleSearchBy}
                      value={searchBy}
                    >
                      <option value="title">Title</option>
                      <option value="content">Content</option>
                    </select>
                    :{" "}
                  </strong>
                  <input onChange={handleSearchTerm} value={searchTerm}></input>
                  <button
                    className="button-small no-shadow ml-10"
                    onClick={resetFilters}
                  >
                    Clear search
                  </button> */}
                </div>
              </GroupHeader>
              <PostList
                sortBy={sortBy}
                searchBy={searchBy}
                searchTerm={searchTerm}
              />
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
