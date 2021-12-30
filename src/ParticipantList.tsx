import React, { useState } from "react";
import {
  Text,
  AlertDialog,
  useFormPillState,
  FormPillGroup,
  FormPill,
} from "@twilio-paste/core/";

export default function ParticipantList({ participants, onDelete }) {
  const pillState = useFormPillState();

  return (
    <FormPillGroup {...pillState} aria-label="Conversation participants:">
      {participants.map((participant, index) => (
        <ParticipantListItem
          key={participant.sid}
          participant={participant}
          pillState={pillState}
          onDelete={onDelete}
        />
      ))}
      {participants.length === 0 ? <Text as="p">No participants</Text> : null}
    </FormPillGroup>
  );
}

function ParticipantListItem({ pillState, participant, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleClose = () => {
    setIsOpen(false);
    onDelete(participant);
  };

  return (
    <>
      <FormPill {...pillState} onDismiss={handleOpen}>
        {participant.identity ||
          (participant.attributes && participant.attributes.identity)}
      </FormPill>
      <AlertDialog
        heading="Remove Participant"
        isOpen={isOpen}
        destructive
        onConfirm={handleClose}
        onConfirmLabel="Delete"
        onDismiss={handleDismiss}
        onDismissLabel="Cancel"
      >
        Are you sure you want to remove this participant from the conversation?
      </AlertDialog>
    </>
  );
}
