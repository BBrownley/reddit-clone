import React from "react";

import { PillButton } from "../shared/PillButton.elements";

import { Container } from "./DeleteConfirmation.elements";

export default function DeleteConfirmation({confirmDelete, cancel}) {
  return (
    <Container>
      <h3>Are you sure?</h3>
      <div className="modal-buttons">
        <PillButton color="white" onClick={cancel}>Cancel</PillButton>
        <PillButton color="blue" onClick={confirmDelete}>Delete</PillButton>
      </div>
    </Container>
  );
}
