import React from "react";
import { DateTime } from "luxon";
import { Box } from "@twilio-paste/core/";
import { ChatIcon } from "@twilio-paste/icons/cjs/ChatIcon";
import { ChatFeed, Message as ChatMessage } from "react-chat-ui";
import { UserSessionContext } from "../containers/UserSessionContext";
import InputAndAdd from "../components/InputAndAdd";
import { Conversation, Message, Paginator } from "@twilio/conversations";

type Props = {
  conversation: Conversation;
};
type State = {
  messages: ChatMessage[];
};

export default class MessagesView extends React.Component<Props, State> {
  static contextType = UserSessionContext;
  declare context: React.ContextType<typeof UserSessionContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT);
  }

  onAddMessage = (message: string) => {
    void (async (message: string) => {
      await this.props.conversation.sendMessage(message);
    })(message);
  };

  async loadMessages() {
    const messages: Message[] = [];

    let pager: Paginator<Message> | null =
      await this.props.conversation.getMessages();

    while (pager?.items) {
      // eslint-disable-next-line prefer-spread
      messages.unshift.apply(messages, pager.items);

      pager = pager.hasPrevPage ? await pager.prevPage() : null;
    }

    this.setState({
      messages: messages.map((message: Message) =>
        this.makeChatMessage(message)
      ),
    });
  }

  makeChatMessage(message: Message) {
    return new ChatMessage({
      id: this.context?.session?.user?.username === message.author ? 0 : 1,
      message: message.body || "",
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
          borderRadius="borderRadius20"
          boxShadow="shadowBorder"
        >
          <div
            style={{
              display: "flex",
              maxHeight: "calc(100vh - 375px)",
              minHeight: "calc(100vh - 375px)",
            }}
          >
            <div
              style={{
                width: "100%",
                alignSelf: "flex-end",
              }}
            >
              <ChatFeed
                maxHeight="calc(100vh - 375px)"
                messages={this.state.messages} // Array: list of message objects
                isTyping={false} // Boolean: is the recipient typing
                hasInputField={false} // Boolean: use our input, or use your own
                showSenderName // show the name of the user who sent the message
                bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
                bubbleStyles={{
                  chatbubble: {
                    marginLeft: 10,
                    marginRight: 10,
                  },
                }}
              />
            </div>
          </div>
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
