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
  files: FileList | null;
};

export default class MessagesView extends React.Component<Props, State> {
  static contextType = UserSessionContext;
  declare context: React.ContextType<typeof UserSessionContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      messages: [],
      files: null,
    };
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT);
  }

  onAddMessage = (message: string) => {
    void (async (message: string) => {
      const messageBuilder = this.props.conversation
        .prepareMessage()
        .setBody(message);

      if (this.state.files) {
        for (let i = 0; i < this.state.files.length; i++) {
          const file = this.state.files[i];
          const formData = new FormData();
          formData.append("media", file, file.name);

          messageBuilder.addMedia(formData);
        }
      }

      await messageBuilder.build().send();
    })(message);
  };

  onAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      files: e.target.files,
    });
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

    const chatMessages = [];

    for (let i = 0; i < messages.length; i++) {
      chatMessages.push(await this.makeChatMessage(messages[i]));
    }

    this.setState({
      messages: chatMessages,
    });
  }

  async makeChatMessage(message: Message) {
    let body = message.body || "";

    if (message.type === "media" && message.attachedMedia) {
      for (let i = 0; i < message.attachedMedia.length; i++) {
        const media = message.attachedMedia[i];
        const url = await media.getContentTemporaryUrl();

        body += ` ${url || ""}`;

        // TODO: This doesn't currently work and will be escaped to a string
        /*
        if (media.contentType.indexOf("image/") > -1) {
          body += ` <img src="${url || ""}" />`;
        } else {
          body += ` ${url || ""}`;
        }
        */
      }
    }

    return new ChatMessage({
      id: this.context?.session?.user?.username === message.author ? 0 : 1,
      message: body,
    });
  }

  addMessageListener(conversation: Conversation) {
    conversation.on("messageAdded", (message) => {
      this.makeChatMessage(message)
        .then((chatMessage) => {
          this.setState((state, props) => {
            const result = {
              messages: [...state.messages, chatMessage],
            };
            return result;
          });
        })
        .catch((err) => console.error(err));
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
          <input type="file" onChange={this.onAddMedia} multiple />
        </Box>
      </>
    );
  }
}
