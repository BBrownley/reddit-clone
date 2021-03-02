import styled from "styled-components";

export const Message = styled.div`
  border: 2px solid #333;
  border-radius: 5px;
  padding: 15px;
`;

export const Sender = styled.span`
  margin-right: 10px;
`;

export const Time = styled.span`
  margin-left: 10px;
`;

export const Actions = styled.div`
  text-decoration: none;
  display: inline-block;
  width: 100px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-weight: bold;
`;

export const MessageBody = styled.p`
  line-height: 2;
  margin-top: 10px;
`;
