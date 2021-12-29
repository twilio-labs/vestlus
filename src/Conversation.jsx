import React, { useState, useEffect } from "react";
import { Box, Heading } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import { DateTime } from "luxon";

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

  useEffect(() => {
    conversation.getParticipants().then((participants) => {
      setParticipants(participants);
    });

    conversation.getMessages().then(({ items: messages }) => {
      setMessages(messages);
    });
  }, []);

  const onAddParticipant = (address) => {
    addParticipant(conversation, address).then((participant) => {
      console.log("adding participant", participant);
      setParticipants([...participants, participants]);
    });
  };

  const onAddMessage = (message) => {
    // Adding a message...
    conversation.sendMessage(message).then((m) => {
      console.log("message sent", m);
    });
  };
  console.log(participants, messages);
  return (
    <Box>
      <Heading as="h1" variant="heading10">
        {conversation.friendlyName}
      </Heading>
      <InputAndAdd onAdd={onAddParticipant} />
      <ul>
        {participants.map((participant, i) => (
          <li key={i}>
            {i}
            {participant.identity}
          </li>
        ))}
      </ul>
      {messages.map((message, i) => (
        <li key={i}>
          {message.author} (
          {DateTime.fromJSDate(message.dateCreated).toLocaleString(
            DateTime.DATETIME_SHORT
          )}
          ) : {message.body}
        </li>
      ))}
      <InputAndAdd onAdd={onAddMessage} />
    </Box>
  );
}
