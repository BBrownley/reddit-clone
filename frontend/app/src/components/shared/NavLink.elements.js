import { Link } from "react-router-dom";
import styled from "styled-components";

export default styled(Link)`
  color: #4385f5;
  ${props => {
    switch (props.size) {
      case "large":
        return "font-size: 2em;";
      case "medium":
        return "font-size: 1.5em;";
      default:
        return "font-size: 1em";
    }
  }}

  &:visited {
    color: #4385f5;
  }
`;

//export default NavLink;
