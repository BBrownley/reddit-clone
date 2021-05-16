import React from "react";

import { Button } from "../shared/Button.elements";

import { Container } from "./DeleteConfirmation.elements";

export default function DeleteConfirmation({confirmDelete, cancel}) {
  return (
    <Container>
      <h3>Are you sure?</h3>
      <div className="modal-buttons">
        <Button color="white" onClick={cancel}>Cancel</Button>
        <Button color="blue" onClick={confirmDelete}>Delete</Button>
      </div>
    </Container>
  );
}
