import React from "react";
import { DateTime } from "luxon";
import { Box } from "@twilio-paste/core/";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { ChatFeed, Message } from "react-chat-ui";
import SessionContext from "./SessionContext";
import InputAndAdd from "./InputAndAdd";
import { Conversation } from "@twilio/conversations";

type Props = {
  conversation: Conversation;
};
type State = {
  messages: Message[];
};

export default class Messages extends React.Component<Props, State> {
  static contextType = SessionContext;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.props.conversation.on("messageAdded", (message) => {
      this.setState((state, props) => {
        return {
          messages: [
            ...state.messages,
            new Message({
              id: this.context.user.nickname === message.author ? 0 : 1,
              message: message.body,
            }),
          ],
        };
      });
    });
  }

  formatDate(date) {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT);
  }

  onAddMessage = (message) => {
    this.props.conversation.sendMessage(message);
  };

  loadMessages() {
    this.props.conversation.getMessages().then(({ items: messages }) => {
      this.setState({
        messages: messages.map(
          (message) =>
            new Message({
              id: this.context.user.nickname === message.author ? 0 : 1,
              message: message.body,
            })
        ),
      });
    });
  }

  componentDidMount(): void {
    this.loadMessages();
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.conversation.sid === this.props.conversation.sid) {
      return;
    }

    // The conversation has changed and so we need to reload our messages
    this.loadMessages();
  }

  render() {
    return (
      <>
        <Box
          marginTop="space40"
          marginBottom="space40"
          padding="space40"
          borderStyle="solid"
          borderColor="colorBorderStrong"
          borderWidth="borderWidth10"
          borderRadius="borderRadius30"
        >
          <ChatFeed
            maxHeight="calc(100vh - 350px)"
            messages={this.state.messages} // Array: list of message objects
            isTyping={false} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            showSenderName // show the name of the user who sent the message
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
          />
        </Box>
        <Box height="60px">
          <InputAndAdd
            label="Send a Message"
            onAdd={this.onAddMessage}
            button={<ChatIcon decorative={false} title="Send a Message" />}
          />
        </Box>
      </>
    );
  }
}
