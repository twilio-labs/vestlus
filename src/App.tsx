import { useState, useEffect } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon";
import { Box, Button, Flex, Text, AlertDialog } from "@twilio-paste/core/";
import { ProductConversationsIcon } from "@twilio-paste/icons/esm/ProductConversationsIcon";
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import { Client, Conversation } from "@twilio/conversations";
import InputAndAdd from "./components/InputAndAdd";
import ConversationView from "./views/ConversationView";
import Spacer from "./components/Spacer";

async function getConversations(client: Client) {
  const conversations = await client.getSubscribedConversations();
  return conversations;
}

async function createConversation(
  client: Client,
  name: string
): Promise<Conversation> {
  const conversation = await client.createConversation({
    friendlyName: name,
    uniqueName: name,
  });
  await conversation.join(); // Join the conversation that we just created!
  return conversation;
}

async function deleteConversation(
  conversation: Conversation
): Promise<Conversation> {
  return await conversation.delete();
}

// eslint-disable-next-line max-lines-per-function
export default function App({ client }: { client: Client }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  useEffect(() => {
    getConversations(client)
      .then((conversations) => {
        setConversations(conversations.items);
      })
      .catch((err) => console.error(err));
  }, [client]);

  const onAdd = async (name: string) => {
    const conversation = await createConversation(client, name);
    setConversations([...conversations, conversation]);
  };

  return (
    <Theme.Provider theme="default">
      <Box
        alignItems="normal"
        backgroundColor="colorBackgroundBrandStrong"
        color="colorTextBrandInverse"
        padding="space40"
        height="50px"
        lineHeight="lineHeight50"
      >
        <Text
          as="h1"
          variant="heading10"
          marginBottom="space0"
          color="colorTextBrandInverse"
          fontSize="fontSize70"
        >
          <ProductConversationsIcon
            display="inline-block"
            decorative={true}
            title="Conversations"
          />{" "}
          Conversations
        </Text>
      </Box>
      <Flex grow shrink basis="auto">
        <Box minWidth="275px" display="flex" alignSelf="stretch">
          <Box padding="space50" backgroundColor="colorBackground">
            <Box as="ul" listStyleType="none" margin="space0" padding="space0">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.sid}
                  conversation={conversation}
                  onSelect={() => setActiveConversation(conversation)}
                  onDelete={() => {
                    setConversations(
                      conversations.filter((c) => conversation.sid !== c.sid)
                    );
                    setActiveConversation(null);
                  }}
                />
              ))}
            </Box>
            <Spacer />
            <InputAndAdd
              label="Start New conversation"
              placeholder="Conversation Name"
              button={
                <NewIcon decorative={false} title="Start New Conversation" />
              }
              onAdd={onAdd}
            />
          </Box>
        </Box>
        <div
          id="message-pane"
          style={{
            padding: 20,
            display: "flex",
            flexFlow: "column",
            height: "calc(100vh - 50px)",
            width: "100%",
          }}
        >
          {activeConversation && (
            <ConversationView
              client={client}
              conversation={activeConversation}
            />
          )}
        </div>
      </Flex>
    </Theme.Provider>
  );
}

function ConversationItem({
  conversation,
  onSelect,
  onDelete,
}: {
  conversation: Conversation;
  onSelect: () => void;
  onDelete: (conversation: Conversation) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleClose = async () => {
    setIsOpen(false);
    await deleteConversation(conversation);
    onDelete(conversation);
  };

  return (
    <Box
      as="li"
      margin="space20"
      fontSize={["fontSize50", "fontSize50", "fontSize30"]}
      lineHeight="lineHeight20"
    >
      <Flex>
        <Button fullWidth={true} variant="secondary" onClick={onSelect}>
          {conversation.friendlyName}
        </Button>
        &nbsp;
        <Button variant="destructive" onClick={handleOpen}>
          <DeleteIcon decorative={false} title="Delete" />
        </Button>
      </Flex>
      <AlertDialog
        heading="Delete Conversation"
        isOpen={isOpen}
        destructive
        onConfirm={handleClose}
        onConfirmLabel="Delete"
        onDismiss={handleDismiss}
        onDismissLabel="Cancel"
      >
        Are you sure you want to delete this conversation? This action cannot be
        undone.
      </AlertDialog>
    </Box>
  );
}
