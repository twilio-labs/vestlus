import React from "react";
import { DateTime } from "luxon";
import { Box } from "@twilio-paste/core/";
import { ChatIcon } from "@twilio-paste/icons/esm/ChatIcon";
import { ChatFeed, Message as ChatMessage } from "react-chat-ui";
import SessionContext, {
  SessionContextType,
} from "../containers/SessionContext";
import InputAndAdd from "../components/InputAndAdd";
import { Conversation, Message } from "@twilio/conversations";

type Props = {
  conversation: Conversation;
};
type State = {
  messages: ChatMessage[];
};

export default class MessagesView extends React.Component<
  Props,
  State,
  SessionContextType
> {
  static contextType = SessionContext;
  declare context: React.ContextType<typeof SessionContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT);
  }

  onAddMessage = async (message: string) => {
    await this.props.conversation.sendMessage(message);
  };

  async loadMessages() {
    const { items: messages } = await this.props.conversation.getMessages();
    this.setState({
      messages: messages.map((message: Message) =>
        this.makeChatMessage(message)
      ),
    });
  }

  makeChatMessage(message) {
    return new ChatMessage({
      id: this.context?.user?.name === message.author ? 0 : 1,
      message: message.body,
    });
  }

  addMessageListener(conversation: Conversation) {
    conversation.on("messageAdded", (message) => {
      this.setState((state, props) => {
        const result = {
          messages: [...state.messages, this.makeChatMessage(message)],
        };
        return result;
      });
    });
  }

  async componentDidMount(): Promise<void> {
    this.addMessageListener(this.props.conversation);

    await this.loadMessages();
  }

  /*
  componentWillUnmount() {
    // TODO: Remove listeners?
  }
  */

  async componentDidUpdate(prevProps: Props): Promise<void> {
    if (prevProps.conversation.sid === this.props.conversation.sid) {
      return;
    }

    this.addMessageListener(this.props.conversation);

    // The conversation has changed and so we need to reload our messages
    await this.loadMessages();
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
            maxHeight="calc(100vh - 375px)"
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
