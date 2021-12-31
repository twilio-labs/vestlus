import React, { useState, useEffect } from "react";
import { Heading, Box } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import ParticipantList from "./ParticipantList";
import MessageList from "./MessageList";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
import { SessionContext } from "./Session";

async function addParticipant(conversation, address, proxyAddress = null) {
  // Store this in attributes because we don't have any other way to get to it for non-chat participants
  const attributes = { identity: address };
  if (address.substring(0, 1) === "+") {
    return conversation.addNonChatParticipant(
      proxyAddress,
      address,
      attributes
    );
  } else {
    return conversation.add(address, attributes);
  }
}
async function removeParticipant(participant) {
  return await participant.remove();
}

export default function Conversation({ client, conversation }) {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const loadMessages = () =>
    conversation.getMessages().then(({ items: messages }) => {
      setMessages(messages);
    });

  const loadParticipants = () =>
    conversation.getParticipants().then((participants) => {
      setParticipants(participants);
    });

  useEffect(() => {
    loadParticipants();
    loadMessages();
  }, [conversation]);

  conversation.on("messageAdded", (message) =>
    setMessages([...messages, message])
  );

  const onAddParticipant = (address, proxyAddress) => {
    addParticipant(conversation, address, proxyAddress).then((participant) => {
      // This is a workaround for a bug, where the attributes come back as a string rather than the object
      // https://issues.corp.twilio.com/browse/RTDSDK-3278
      participant.attributes = JSON.parse(participant.attributes);
      setParticipants([...participants, participant]);
    });
  };

  const onRemoveParticipant = (participant) => {
    removeParticipant(participant).then(() =>
      setParticipants(participants.filter((p) => p.sid !== participant.sid))
    );
  };

  const onAddMessage = (message) => {
    // Adding a message...
    conversation.sendMessage(message).then((/* index of message */) => {
      // Fetch the new messages after this one has been sent
      loadMessages();
    });
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
          <MessageList messages={messages} />
          <Box height="60px">
            <InputAndAdd
              label="Send a Message"
              onAdd={onAddMessage}
              button={<ChatIcon decorative={false} title="Send a Message" />}
            />
          </Box>
        </>
      )}
    </SessionContext.Consumer>
  );
}
