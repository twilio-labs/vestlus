import React, { useState } from "react";
import "./App.less";
import { Client as TwilioClient } from "@twilio/conversations";

function Input({ onClick }) {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onClick(value);
    setValue("");
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
      />
      <button onClick={handleClick}>Add</button>
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
      <h1>Hello World!</h1>
      <Input onClick={(item) => setItems([...items, item])} />
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </Container>
  );
}
