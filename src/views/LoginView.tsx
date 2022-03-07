import { useState, useContext } from "react";
import { Alert, Box, Button, Text } from "@twilio-paste/core/";
import { ErrorMessage } from "../App";
import {
  UserSessionContext,
  UserSession,
  User,
} from "../containers/UserSessionContext";
import Input from "../components/Input";

export default function LoginView() {
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<User>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const { setSession } = useContext(UserSessionContext) || {
    setSession: () => {},
  };

  const onSubmit = () => {
    setError(null);
    fetch("/auth/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((response) =>
        response.json().then((data: Record<string, unknown>) => ({
          ok: response.ok,
          status: response.status,
          data,
        }))
      )
      .then(
        ({
          ok,
          status,
          data,
        }: {
          ok: boolean;
          status: number;
          data: Record<string, unknown>;
        }) => {
          if (ok) {
            setSession(data as UserSession);
          } else {
            setError((data as ErrorMessage).message);
          }
        }
      )
      .catch((err) => {
        console.error("error", err);
      });
  };

  return (
    <>
      {error && (
        <Box paddingBottom="space40">
          <Alert variant="error">
            <Text as="span">{error}</Text>
          </Alert>
        </Box>
      )}
      <Input
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
      />
      <Input
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        onEnter={onSubmit}
      />
      <Button onClick={onSubmit}>Login</Button>
    </>
  );
}
