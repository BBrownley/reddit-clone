import styled from "styled-components";

export const Message = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 5px;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #bbb;
  border-right: 1px solid #bbb;
  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
  &[class*="message-read"] {
    color: #999;
    strong {
      font-weight: 400;
    }
  }
`;

export const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
