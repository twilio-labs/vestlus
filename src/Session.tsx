import React from "react";
import Client from "./Client";
import SessionContext from "./SessionContext";

type Props = Record<string, unknown>;

type State = {
  loaded: boolean;
  session: {
    token: string;
  };
};
export default class Session extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      session: null,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const response = await fetch("/session");
      const session = await response.json();

      this.setState({
        loaded: true,
        session,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
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
      <SessionContext.Provider value={this.state.session}>
        <Client token={this.state.session.token} />
      </SessionContext.Provider>
    );
  }
}
