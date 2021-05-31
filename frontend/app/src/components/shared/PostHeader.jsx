import NavLink from "./NavLink.elements";
import { Title, PostHeaderContainer } from "./PostHeader.elements";

import FontAwesome from "react-fontawesome";

import useScreenWidth from "../custom-hooks/useScreenWidth";

const PostHeader = ({
  postLink,
  title,
  postAge,
  groupLink,
  groupName,
  author,
  submitter_id
}) => {
  const width = useScreenWidth();

  return (
    <PostHeaderContainer>
      <NavLink to={postLink}>
        <Title>{title}</Title>{" "}
      </NavLink>
      posted <FontAwesome name="history" className="fa-history" /> {postAge} in{" "}
      <span>
        <NavLink to={`/groups/${groupName.toLowerCase()}`}>
          <strong>{groupName}</strong>
        </NavLink>
      </span>{" "}
      {author && (
        <>
          by{" "}
          <NavLink to={`/users/${submitter_id}`}>
            <strong>{author}</strong>
          </NavLink>
        </>
      )}
    </PostHeaderContainer>
  );
};

export default PostHeader;
