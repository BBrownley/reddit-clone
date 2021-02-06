import NavLink from "./NavLink.elements";
import { Title, PostHeaderContainer } from "./PostHeader.elements";

import FontAwesome from "react-fontawesome";

const PostHeader = ({
  postLink,
  title,
  postAge,
  groupLink,
  groupName,
  author = undefined
}) => {
  return (
    <PostHeaderContainer>
      <NavLink to={postLink}>
        <Title>{title}</Title>{" "}
      </NavLink>
      posted <FontAwesome name="history" className="fa-history" /> {postAge} in{" "}
      <span>
        <NavLink to={groupLink}>
          <strong>{groupName}</strong>
        </NavLink>
      </span>{" "}
      {author !== undefined && (
        <>
          by{" "}
          <NavLink to="/">
            <strong>{author}</strong>
          </NavLink>
        </>
      )}
    </PostHeaderContainer>
  );
};

export default PostHeader;
