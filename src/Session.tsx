import React from "react";
import Client from "./Client";

export default class Session extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
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

    return <Client token={this.state.session.token} />;
  }
}
