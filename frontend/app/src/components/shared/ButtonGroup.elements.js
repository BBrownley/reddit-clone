import styled from "styled-components";

const ButtonGroup = styled.ul`
  display: flex;
  margin-left: -.5rem;
  /* justify-content: center; */
  li {
    font-weight: bold;
    margin: .5rem;
    padding: .5rem;
    border: 1px solid #eee;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                supported by Chrome, Edge, Opera and Firefox */
  }
  li:hover {
    cursor: pointer;
    background-color: #4385f5;
    color: white;
    transition: 0.2s all;
  }
  li[class="active"] {
    background-color: #4385f5;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  }
`;

export default ButtonGroup;
