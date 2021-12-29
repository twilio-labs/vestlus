import React, { useState } from "react";
import { Theme } from "@twilio-paste/core/theme";
import {
  Box,
  Card,
  Heading,
  Label,
  Input,
  HelpText,
  Button,
} from "@twilio-paste/core/";
import { Client as TwilioClient } from "@twilio/conversations";

function ItemInput({ onAdd }) {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onAdd(value);
    setValue("");
  };

  return (
    <>
      <Label htmlFor="item" required>
        Item
      </Label>
      <Input
        aria-describedby="item_help_text"
        id="item"
        type="text"
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        required
      />
      <HelpText id="item_help_text">Add an item.</HelpText>

      <Button variant="primary" onClick={handleClick}>
        Add
      </Button>
    </>
  );
}

export class Client extends React.Component {
  client;

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
    };
  }

  componentDidMount(): void {
    this.client = new TwilioClient(this.props.token);
    // Before you use the client, subscribe to the `'stateChanged'` event and wait
    // for the `'initialized'` state to be reported.
    this.client.on("stateChanged", (state) => {
      if (state === "initialized") {
        this.setState({ initialized: true });
      }
    });
  }

  render(): React.ReactNode {
    if (!this.state.initialized) {
      return <></>;
    }
    return this.props.children;
  }
}

export class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  async componentDidMount(): void {
    try {
      const response = await fetch("/session");
      const session = await response.json();

      this.setState({
        loaded: true,
        session,
      });
    } catch (err) {
      console.error(err);

      // Cross origin fun, redirect to login!
      if (err.message === "Failed to fetch") {
        window.location.href = "/login?dev=1";
      }
    }
  }

  render() {
    if (!this.state.loaded) {
      return <em>Loading...</em>;
    }

    return (
      <Client token={this.state.session.token}>{this.props.children}</Client>
    );
  }
}

export default function App() {
  const [items, setItems] = useState([]);
  return (
    <Container>
      <Theme.Provider theme="default">
        <Box margin="space100">
          <Card padding="space100">
            <Heading as="h1" variant="heading10">
              Hello World!
            </Heading>
            <Box marginBottom="space100">
              <ItemInput onAdd={(item) => setItems([...items, item])} />
            </Box>
            <Heading as="h2" variant="heading20">
              Items
            </Heading>
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        </Box>
      </Theme.Provider>
    </Container>
  );
}
