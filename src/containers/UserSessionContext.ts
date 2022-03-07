import { createContext } from "react";

export const UserSessionContext = createContext<{
  session: UserSession | null;
  setSession: React.Dispatch<React.SetStateAction<UserSession | null>>;
} | null>(null);

export type UserSession = {
  token: string | null;
  user: User | null;
};

export type User = {
  name: string | null;
  email: string | null;
  username: string;
  password: string;
};
