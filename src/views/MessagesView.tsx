import React from "react";
import { DateTime } from "luxon";
import {
  Box,
  ChatMessage,
  ChatBubble,
  ChatMessageMeta,
  ChatMessageMetaItem,
} from "@twilio-paste/core/";
import { ChatIcon } from "@twilio-paste/icons/cjs/ChatIcon";
import { UserSessionContext } from "../containers/UserSessionContext";
import InputAndAdd from "../components/InputAndAdd";
import { Conversation, Message, Paginator } from "@twilio/conversations";

type Props = {
  conversation: Conversation;
};
type State = {
  messages: MessageData[];
  files: FileList | null;
};

export class MessageData {
  id: number | string;
  senderName?: string;
  message: string;
  created?: Date | null;

  constructor({
    id,
    message,
    senderName,
    created,
  }: {
    id: number | string;
    message: string;
    senderName?: string;
    created?: Date | null;
  }) {
    this.id = id;
    this.message = message;
    this.senderName = senderName;
    this.created = created || null;
  }
}

export function ChatMessageWrapper({
  message,
}: {
  message: MessageData;
}): React.ReactElement {
  return (
    <ChatMessage variant={message.id === 1 ? "inbound" : "outbound"}>
      <ChatBubble>{message.message}</ChatBubble>
      <ChatMessageMeta
        // TODO: FIx and format
        aria-label={`said by $SENDERNAME at $TIME`}
      >
        {message.senderName && (
          <ChatMessageMetaItem>{message.senderName}</ChatMessageMetaItem>
        )}
        {message.created && (
          <ChatMessageMetaItem>
            {DateTime.fromJSDate(message.created).toLocaleString(
              DateTime.TIME_SIMPLE
            )}
          </ChatMessageMetaItem>
        )}
      </ChatMessageMeta>
    </ChatMessage>
  );
}

export default class MessagesView extends React.Component<Props, State> {
  static contextType = UserSessionContext;
  declare context: React.ContextType<typeof UserSessionContext>;

  private messageListDiv = React.createRef<HTMLDivElement>();

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

        // TEMP: This needs to be wrapped and handled differently.
        body += ` ${url?.substring(0, 120) || ""}`;

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

    return new MessageData({
      id: this.context?.session?.user?.username === message.author ? 0 : 1,
      message: body,
      senderName: message.author || "",
      created: message.dateCreated,
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

    this.scrollMessageList();
  }

  /*
  componentWillUnmount() {
    // TODO: Remove listeners?
  }
  */

  scrollMessageList() {
    if (!this.messageListDiv || !this.messageListDiv.current) {
      return;
    }

    this.messageListDiv.current.scrollTop =
      this.messageListDiv.current.scrollHeight + 100;
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    this.scrollMessageList();

    if (prevProps.conversation.sid === this.props.conversation.sid) {
      return;
    }

    this.addMessageListener(this.props.conversation);

    // The conversation has changed and so we need to reload our messages
    await this.loadMessages();

    this.scrollMessageList();
  }

  render() {
    const css = {
      width: "100%",
      height: "calc(100vh - 375px)",
      maxHeight: "calc(100vh - 375px)",
      overflow: "auto",
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
    };

    return (
      <>
        <Box
          marginTop="space40"
          marginBottom="space40"
          borderRadius="borderRadius20"
          boxShadow="shadowBorder"
        >
          <div ref={this.messageListDiv} style={css}>
            {this.state.messages.map((message, i) => (
              <ChatMessageWrapper key={i} message={message} />
            ))}
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
