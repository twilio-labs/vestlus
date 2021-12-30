import React from "react";
import { Client as TwilioClient } from "@twilio/conversations";
import App from "./App";

type Props = {
  token: string;
};

type State = {
  initialized: boolean;
};

export default class Client extends React.Component<Props, State> {
  client: TwilioClient;

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
      // eslint-disable-next-line no-console
      console.log("state = ", JSON.stringify(state));

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
