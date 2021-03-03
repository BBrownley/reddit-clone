import styled from "styled-components";

export const Card = styled.div`
  border: 1px solid #eee;
  padding: 0.5em;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  height: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const GroupBlurb = styled.p`
  color: #999;
  margin-top: 0.7em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* number of lines to show */
  -webkit-box-orient: vertical;
`;
