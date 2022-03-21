import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Conversations from "./Conversations";
import { Client } from "@twilio/conversations";

jest.mock("@twilio/conversations");

test("<Conversations/>", () => {
  const client = new Client("token");

  act(() => {
    render(<Conversations client={client} />);
  });

  expect(screen.getByLabelText("Start New Conversation")).toBeInTheDocument();
});
