import React from "react";

export type SessionContextType = {
  token: string;
  user: {
    nickname: string;
  };
  phoneNumbers: { phoneNumber: string }[];
} | null;

const SessionContext = React.createContext<SessionContextType>(null);

export default SessionContext;
