import React, { useState, useEffect } from "react";
import { Box, Heading } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import ParticipantList from "./ParticipantList";
import MessageList from "./MessageList";

async function addParticipant(conversation, address) {
  if (address.substring(0, 1) === "+") {
    const proxyAddress = "+15173002340";
    conversation.addNonChatParticipant(proxyAddress, address);
  } else {
    conversation.add(address);
  }
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

  const onAddParticipant = (address) => {
    addParticipant(conversation, address).then((participant) => {
      setParticipants([...participants, participant]);
    });
  };

  const onAddMessage = (message) => {
    // Adding a message...
    conversation.sendMessage(message).then((/* index of message */) => {
      // Fetch the new messages after this one has been sent
      loadMessages();
    });
  };

  return (
    <Box>
      <Heading as="h1" variant="heading10">
        {conversation.friendlyName}
      </Heading>
      <InputAndAdd label="Participant" onAdd={onAddParticipant} />
      <ParticipantList participants={participants} />
      <MessageList messages={messages} />
      <InputAndAdd label="Message" button="Send" onAdd={onAddMessage} />
    </Box>
  );
}
