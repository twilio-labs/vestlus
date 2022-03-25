import { useState, useEffect, useContext } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { NewIcon } from "@twilio-paste/icons/cjs/NewIcon";
import { Box, Button, Flex, AlertDialog } from "@twilio-paste/core/";
import { DeleteIcon } from "@twilio-paste/icons/cjs/DeleteIcon";
import { Client, Conversation } from "@twilio/conversations";
import InputAndAdd from "../components/InputAndAdd";
import ConversationView from "./ConversationView";
import { UserSessionContext } from "../containers/UserSessionContext";

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

  const { setSession } = useContext(UserSessionContext) || {
    setSession: () => {},
  };

  useEffect(() => {
    getConversations(client)
      .then((conversations) => {
        if (
          conversations &&
          conversations.items &&
          conversations.items.length > 0
        ) {
          setConversations(conversations.items);
        }
      })
      .catch((err) => console.error(err));
  }, [client]);

  const onAdd = (name: string) => {
    void (async (name: string) => {
      const conversation = await createConversation(client, name);
      setConversations([...conversations, conversation]);
    })(name);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
  };

  return (
    <Theme.Provider theme="default">
      <Flex grow shrink basis="auto">
        <Box minWidth="275px" display="flex" alignSelf="stretch">
          <Box padding="space50" backgroundColor="colorBackground">
            <InputAndAdd
              label="Start New Conversation"
              placeholder="Conversation Name"
              button={
                <NewIcon decorative={false} title="Start New Conversation" />
              }
              onAdd={onAdd}
            />
            <Box
              as="ul"
              listStyleType="none"
              margin="space0"
              padding="space0"
              paddingTop="space100"
            >
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
            <Box paddingTop="space180" textAlign="center">
              <Button variant="reset" onClick={logout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Box>
        <div
          id="message-pane"
          style={{
            padding: 20,
            display: "flex",
            flexFlow: "column",
            height: "calc(100vh - 75px)",
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
  const handleClose = () => {
    void (async () => {
      setIsOpen(false);
      await deleteConversation(conversation);
      onDelete(conversation);
    })();
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
