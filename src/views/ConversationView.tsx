import { useState, useEffect } from "react";
import { Heading, Box, useToaster, Toaster } from "@twilio-paste/core/";
import InputAndAdd from "../components/InputAndAdd";
import ParticipantsView from "./ParticipantsView";
import MessagesView from "./MessagesView";
import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import SessionContext, {
  SessionContextType,
} from "../containers/SessionContext";
import { Client, Conversation, Participant } from "@twilio/conversations";
import { ServerError } from "../App";

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
  const toaster = useToaster();

  useEffect(() => {
    conversation
      .getParticipants()
      .then((participants: Participant[]) => {
        setParticipants(participants);
      })
      .catch((err) => console.error(err));
  }, [conversation]);

  conversation.on("participantJoined", (participant) => {
    setParticipants([...participants, participant]);
  });

  conversation.on("participantLeft", (participant) => {
    setParticipants(participants.filter((p) => participant.sid !== p.sid));
  });

  const onAddParticipant = (address: string, proxyAddress: string) => {
    void (async (address: string, proxyAddress: string) => {
      try {
        await addParticipant(conversation, address, proxyAddress);
      } catch (e) {
        console.error(e);

        const err = e as ServerError;
        toaster.push({
          message: err.body.message,
          variant: "error",
        });
      }
    })(address, proxyAddress);
  };

  const onRemoveParticipant = (participant: Participant) => {
    void (async (participant: Participant) => {
      await removeParticipant(participant);
    })(participant);
  };

  return (
    <SessionContext.Consumer>
      {(session: SessionContextType) => (
        <>
          <Box height="150px">
            <Heading as="h1" variant="heading10" marginBottom="space0">
              {conversation.friendlyName}
            </Heading>
            <ParticipantsView
              participants={participants}
              onDelete={onRemoveParticipant}
            />
            <Box marginTop="space30" marginBottom="space30">
              <InputAndAdd
                label="Add a Participant"
                onAdd={(address) =>
                  // TODO: The user should be able to select the proxy address from the list
                  // TODO: Provide a helpful error when there are no phone numbers
                  onAddParticipant(
                    address,
                    session?.phoneNumbers[0]?.phoneNumber || ""
                  )
                }
                button={
                  <UserIcon decorative={false} title="Add a Participant" />
                }
              />
            </Box>
          </Box>
          <MessagesView conversation={conversation} />
          <Toaster {...toaster} />
        </>
      )}
    </SessionContext.Consumer>
  );
}
