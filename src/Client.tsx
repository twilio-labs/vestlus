import React from "react";
import { Client as TwilioClient } from "@twilio/conversations";
import App from "./App";

export default class Client extends React.Component {
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
      console.log(state);
      if (state === "initialized") {
        this.setState({ initialized: true });
      }
    });
  }

  render(): React.ReactNode {
    if (!this.state.initialized) {
      return <></>;
    }
    return <App client={this.client} />;
  }
}
