import React, { useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { Box } from "@twilio-paste/core/";
import { SessionContext } from "./Session";

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Box
      marginTop="space40"
      marginBottom="space40"
      padding="space40"
      borderStyle="solid"
      borderColor="colorBorderStrong"
      borderWidth="borderWidth10"
      borderRadius="borderRadius30"
      overflow="auto"
    >
      {messages.map((message, i) => (
        <MessageListItem key={i} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}

function MessageListItem({ message }) {
  return (
    <SessionContext.Consumer>
      {(session) => (
        <Box margin="space20">
          <div
            style={{
              textAlign:
                session.user.nickname === message.author ? "right" : "left",
            }}
          >
            <Box color="colorTextWeak" fontSize="fontSize20">
              {message.author}
            </Box>
            <Box>
              <Box
                display="inline-block"
                padding="space30"
                borderRadius="borderRadius20"
                backgroundColor={
                  session.user.nickname === message.author
                    ? "colorBackgroundPrimaryWeaker"
                    : "colorBackgroundStrong"
                }
              >
                {message.body}
              </Box>
            </Box>
            <Box color="colorTextWeak" fontSize="fontSize10">
              {DateTime.fromJSDate(message.dateCreated).toLocaleString(
                DateTime.DATETIME_SHORT
              )}
            </Box>
          </div>
        </Box>
      )}
    </SessionContext.Consumer>
  );
}
