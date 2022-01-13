import { useState, useEffect } from "react";
import { Heading, Box } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import ParticipantList from "./ParticipantList";
import Messages from "./Messages";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import SessionContext, { SessionContextType } from "./SessionContext";
import { Client, Conversation, Participant } from "@twilio/conversations";

// This is used to fix attributes on a participant when it comes back after adding
type MutableParticipant = {
  -readonly [K in keyof Participant]: Participant[K];
};

async function addParticipant(
  conversation: Conversation,
  address: string,
  proxyAddress: string | null = null
) {
  // Store this in attributes because we don't have any other way to get to it for non-chat participants
  const attributes = { identity: address };
  if (address.substring(0, 1) === "+" && proxyAddress !== null) {
    // This method returns a Participant even though the type says void
    return (await conversation.addNonChatParticipant(
      proxyAddress,
      address,
      attributes
    )) as unknown as Participant;
  } else {
    // This method returns a Participant even though the type says void
    return (await conversation.add(
      address,
      attributes
    )) as unknown as Participant;
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

  useEffect(() => {
    conversation
      .getParticipants()
      .then((participants: Participant[]) => {
        setParticipants(participants);
      })
      .catch((err) => console.error(err));
  }, [conversation]);

  const onAddParticipant = async (address: string, proxyAddress: string) => {
    const participant = (await addParticipant(
      conversation,
      address,
      proxyAddress
    )) as MutableParticipant; // Cast for the workaround

    // This is a workaround for a bug, where the attributes come back as a string rather than the object
    // https://issues.corp.twilio.com/browse/RTDSDK-3278
    const attributes = JSON.parse(participant.attributes as string) as Record<
      string,
      unknown
    >;
    participant.attributes = attributes;
    setParticipants([...participants, participant as Participant]); // Cast for the workaround
  };

  const onRemoveParticipant = async (participant: Participant) => {
    await removeParticipant(participant);
    setParticipants(participants.filter((p) => p.sid !== participant.sid));
  };

  return (
    <SessionContext.Consumer>
      {(session: SessionContextType) => (
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
                  onAddParticipant(
                    address,
                    session?.phoneNumbers[0].phoneNumber || ""
                  )
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
