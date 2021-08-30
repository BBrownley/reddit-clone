import styled from "styled-components";

export const FormContainer = styled.div`
  display: block;
  max-width: 800px;
  margin: 5rem auto 0 auto;

  & button {
    width: 100%;
    margin-top: 1rem;
  }
`;

export const FormHeader = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const FormField = styled.div`
  /* background-color: #aaa; */
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  & label {
    margin-bottom: 0.5rem;
  }
  & input {
    font-size: 1.5rem;
    padding: 1rem;
  }
  & textarea {
    font-size: 1.5rem;
    padding: 1rem;

    width: 100%;
    min-width: 50%;
    max-width: 100%;

    height: 400px;
    min-height: 100px;
    max-height: 1000px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
`