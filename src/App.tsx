import React, { useState, useEffect } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon";
import { Box, Button, Flex, Text, AlertDialog } from "@twilio-paste/core/";
import { ProductConversationsIcon } from "@twilio-paste/icons/esm/ProductConversationsIcon";
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";

import InputAndAdd from "./InputAndAdd";
import Conversation from "./Conversation";
import Spacer from "./Spacer";

async function getConversations(client) {
  const conversations = await client.getSubscribedConversations();
  return conversations;
}

async function createConversation(client, name) {
  try {
    const conversation = await client.createConversation({
      friendlyName: name,
      uniqueName: name,
    });
    conversation.join(); // Join the conversation that we just created!
    return conversation;
  } catch (err) {
    // TODO: Check for Error: Conflict
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

async function deleteConversation(conversation) {
  try {
    return await conversation.delete();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

// eslint-disable-next-line max-lines-per-function
export default function App({ client }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    getConversations(client).then((conversations) => {
      setConversations(conversations.items);
    });
  }, []);

  const onAdd = (name) =>
    createConversation(client, name).then((conversation) =>
      setConversations([...conversations, conversation])
    );

  return (
    <Theme.Provider theme="default">
      <Header />
      <Flex grow shrink basis="auto">
        <Box minWidth="275px" display="flex" alignSelf="stretch">
          <Box padding="space50" backgroundColor="colorBackground">
            <Box as="ul" listStyleType="none" margin="space0" padding="space0">
              {conversations.map((conversation) => (
                <ConversationListItem
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
            <Conversation client={client} conversation={activeConversation} />
          )}
        </div>
      </Flex>
    </Theme.Provider>
  );
}

function ConversationListItem({ conversation, onSelect, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleClose = () => {
    setIsOpen(false);
    // TODO: Should deleteConversation be done inside onDelete()?
    deleteConversation(conversation).then((conversation) =>
      onDelete(conversation)
    );
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

function Header() {
  return (
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
  );
}
