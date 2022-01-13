import { useState } from "react";
import {
  Text,
  AlertDialog,
  useFormPillState,
  FormPillGroup,
  FormPill,
  FormPillStateReturn,
} from "@twilio-paste/core/";
import { Participant } from "@twilio/conversations";

export default function ParticipantsView({
  participants,
  onDelete,
}: {
  participants: Participant[];
  onDelete: (participant: Participant) => void;
}) {
  const pillState = useFormPillState();

  return (
    <FormPillGroup {...pillState} aria-label="Conversation participants:">
      {participants.map((participant) => (
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

function ParticipantListItem({
  pillState,
  participant,
  onDelete,
}: {
  pillState: FormPillStateReturn;
  participant: Participant;
  onDelete: (participant: Participant) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleClose = () => {
    setIsOpen(false);
    onDelete(participant);
  };

  const attributes = participant?.attributes as { identity: string } | null;

  return (
    <>
      <FormPill {...pillState} onDismiss={handleOpen}>
        {participant.identity || (attributes && attributes.identity)}
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
