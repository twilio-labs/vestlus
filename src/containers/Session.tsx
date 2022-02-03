import React from "react";
import Client from "./Client";
import SessionContext, { SessionContextType } from "./SessionContext";

type Props = Record<string, unknown>;

type State = {
  loaded: boolean;
  session: SessionContextType;
};
export default class Session extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loaded: false,
      session: null,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const response = await fetch("/session");
      const session = (await response.json()) as SessionContextType;

      this.setState({
        loaded: true,
        session,
      });
    } catch (err) {
      console.error(err);

      //window.location.href = "/login";
    }
  }

  render() {
    if (!this.state.loaded) {
      return <em>Loading...</em>;
    }

    return (
      <SessionContext.Provider value={this.state.session}>
        <Client token={this.state?.session?.token || null} />
      </SessionContext.Provider>
    );
  }
}
