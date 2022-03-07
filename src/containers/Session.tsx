import React from "react";
import { UserSessionContext } from "../containers/UserSessionContext";
import Client from "./Client";
import SessionContext, { SessionContextType } from "./SessionContext";

type Props = Record<string, unknown>;

type State = {
  loaded: boolean;
  session: SessionContextType;
};

export default class Session extends React.PureComponent<Props, State> {
  static contextType = UserSessionContext;

  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false,
      session: null,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      console.log(this.context?.session?.token);
      const response = await fetch("/api/session", {
        headers: {
          Authorization: `Bearer ${this.context?.session?.token || ""}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const session = (await response.json()) as SessionContextType;

      this.setState({
        loaded: true,
        session,
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (!this.state.loaded) {
      return (
        <p style={{ padding: "10px" }}>
          <em>Loading...</em>
        </p>
      );
    }

    return (
      <SessionContext.Provider value={this.state.session}>
        <Client token={this.state?.session?.token || null} />
      </SessionContext.Provider>
    );
  }
}
