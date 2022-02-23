import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { Client } from "@twilio/conversations";

jest.mock("@twilio/conversations");

test("<App/>", () => {
  const client = new Client("token");

  render(<App client={client} />);

  // The header is present
  expect(screen.getByRole("heading")).toHaveTextContent("Hello World!");

  // Type some data into the input
  userEvent.type(screen.getByRole("textbox"), "The first item");

  // Click the add button
  fireEvent.click(screen.getByRole("button"));

  // Now we should have a list item with the text we entered
  expect(screen.getByRole("listitem")).toHaveTextContent("The first item");
});
