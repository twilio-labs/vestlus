import React, { useState, useEffect } from "react";
import { Heading, Box } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import ParticipantList from "./ParticipantList";
import Messages from "./Messages";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import SessionContext from "./SessionContext";
import { Client, Conversation, Participant } from "@twilio/conversations";

async function addParticipant(
  conversation: Conversation,
  address: string,
  proxyAddress: string | null = null
) {
  // Store this in attributes because we don't have any other way to get to it for non-chat participants
  const attributes = { identity: address };
  if (address.substring(0, 1) === "+" && proxyAddress !== null) {
    return conversation.addNonChatParticipant(
      proxyAddress,
      address,
      attributes
    );
  } else {
    return conversation.add(address, attributes);
  }
}
async function removeParticipant(participant: Participant) {
  return await participant.remove();
}

export default function ConversationView({
  client,
  conversation,
}: {
  client: Client;
  conversation: Conversation;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const loadParticipants = () =>
    conversation.getParticipants().then((participants: Participant[]) => {
      setParticipants(participants);
    });

  useEffect(() => {
    loadParticipants();
  }, [conversation]);

  const onAddParticipant = (address: string, proxyAddress: string) => {
    addParticipant(conversation, address, proxyAddress).then(
      (participant: Participant) => {
        // This is a workaround for a bug, where the attributes come back as a string rather than the object
        // https://issues.corp.twilio.com/browse/RTDSDK-3278
        participant.attributes = JSON.parse(participant.attributes);
        setParticipants([...participants, participant]);
      }
    );
  };

  const onRemoveParticipant = (participant: Participant) => {
    removeParticipant(participant).then(() =>
      setParticipants(participants.filter((p) => p.sid !== participant.sid))
    );
  };

  return (
    <SessionContext.Consumer>
      {(session) => (
        <>
          <Box height="150px">
            <Heading as="h1" variant="heading10" marginBottom="space0">
              {conversation.friendlyName}
            </Heading>
            <ParticipantList
              participants={participants}
              onDelete={onRemoveParticipant}
            />
            <Box marginTop="space30" marginBottom="space30">
              <InputAndAdd
                label="Add a Participant"
                onAdd={(address) =>
                  // TODO: The user should be able to select the proxy address from the list
                  onAddParticipant(address, session.phoneNumbers[0].phoneNumber)
                }
                button={
                  <UserIcon decorative={false} title="Add a Participant" />
                }
              />
            </Box>
          </Box>
          <Messages conversation={conversation} />
        </>
      )}
    </SessionContext.Consumer>
  );
}
