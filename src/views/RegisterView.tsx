import { useState, useContext } from "react";
import { Button } from "@twilio-paste/core/";
import { FormErrors } from "../App";
import {
  UserSessionContext,
  UserSession,
  User,
} from "../containers/UserSessionContext";
import Input from "../components/Input";

export default function RegisterView() {
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});
    fetch("/auth/signup", {
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
            setErrors((data as FormErrors).errors);
          }
        }
      )
      .catch((err) => {
        console.error("error", err);
      });
  };

  return (
    <>
      <Input
        label="Name"
        value={values.name || ""}
        onChange={(value) => setValues({ ...values, name: value })}
        error={errors.name}
      />
      <Input
        type="email"
        label="Email"
        value={values.email || ""}
        onChange={(value) => setValues({ ...values, email: value })}
        error={errors.email}
      />
      <Input
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
        error={errors.username}
      />
      <Input
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        error={errors.password}
      />
      <Button onClick={onSubmit}>Register</Button>
    </>
  );
}
