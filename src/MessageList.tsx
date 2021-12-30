import React from "react";
import { DateTime } from "luxon";

export default function MessageList({ messages }) {
  return (
    <ul>
      {messages.map((message, i) => (
        <li key={i}>
          {message.author} (
          {DateTime.fromJSDate(message.dateCreated).toLocaleString(
            DateTime.DATETIME_SHORT
          )}
          ) : {message.body}
        </li>
      ))}
    </ul>
  );
}
