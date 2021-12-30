import React from "react";

export default function ParticipantList({ participants }) {
  return (
    <ul>
      {participants.map((participant, i) => (
        <li key={i}>
          {i}
          {participant.identity}
        </li>
      ))}
    </ul>
  );
}
