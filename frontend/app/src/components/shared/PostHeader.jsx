import NavLink from "./NavLink.elements";
import { Title, PostHeaderContainer } from "./PostHeader.elements";

import FontAwesome from "react-fontawesome";

const PostHeader = ({
  postLink,
  title,
  postAge,
  groupLink,
  groupName,
  author,
  userId
}) => {
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
          <NavLink to={`/users/${userId}`}>
            <strong>{author}</strong>
          </NavLink>
        </>
      )}
    </PostHeaderContainer>
  );
};

export default PostHeader;
