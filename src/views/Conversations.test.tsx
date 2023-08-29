import React from "react";
import { render, screen } from "@testing-library/react";
import Conversations from "./Conversations";
import { Client } from "@twilio/conversations";
import "@testing-library/jest-dom";

jest.mock("@twilio/conversations");

test("<Conversations/>", () => {
  const client = new Client("token");

  render(<Conversations client={client} />);

  expect(
    screen.getByLabelText("Start New Conversation", { selector: "input" })
  ).toBeInTheDocument();
});
