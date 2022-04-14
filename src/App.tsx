import { Theme } from "@twilio-paste/core/theme";
import { Box, Grid, Column, Heading } from "@twilio-paste/core/";
import { useState, useEffect } from "react";
import {
  UserSessionContext,
  UserSession,
} from "./containers/UserSessionContext";
import Session from "./containers/Session";
import Header from "./components/Header";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";

export type ErrorMessage = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export type ServerError = {
  status: number;
  description: string;
  body: {
    status: number;
    message: string;
  };
};

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);

  const contextValue = { session, setSession };

  useEffect(() => {
    const cachedSession = JSON.parse(
      localStorage.getItem("session") as string
    ) as UserSession;

    if (cachedSession) {
      setSession(cachedSession);
      return;
    }

    fetch("/auth/session", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((session: UserSession) => {
        localStorage.setItem("session", JSON.stringify(session));
        setSession(session);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session?.token]);

  return (
    <Theme.Provider theme="default">
      <UserSessionContext.Provider value={contextValue}>
        <Header />
        {!session && (
          <Grid gutter="space40">
            <Column span={4} offset={2}>
              <Box padding="space40" width="100%">
                <Heading as="h3" variant="heading20">
                  Login
                </Heading>
                <LoginView />
              </Box>
            </Column>
            <Column span={4}>
              <Box padding="space40" width="100%">
                <Heading as="h3" variant="heading20">
                  Register
                </Heading>
                <RegisterView />
              </Box>
            </Column>
          </Grid>
        )}
        {session?.user && <Session />}
      </UserSessionContext.Provider>
    </Theme.Provider>
  );
}
