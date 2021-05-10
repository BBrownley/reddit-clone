import React from "react";
import { useDispatch } from "react-redux";

import { removeToast } from "../../reducers/toastReducer";

import FontAwesome from "react-fontawesome";

import { Container } from "./Toast.elements";

export default function Toast({ message }) {
  const dispatch = useDispatch();

  if (message === null) return <></>;

  return (
    <Container>
      <h2>{message}</h2>
      <FontAwesome
        name="close"
        className="fa-close"
        onClick={() => dispatch(removeToast())}
      />
    </Container>
  );
}
