import React, { useState, useEffect } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { Box, Button, Card, Column, Grid, Heading } from "@twilio-paste/core/";
import InputAndAdd from "./InputAndAdd";
import Conversation from "./Conversation";

async function getConversations(client) {
  const conversations = await client.getSubscribedConversations();
  return conversations;
}

async function createConversation(client, name) {
  try {
    return await client.createConversation({
      friendlyName: name,
      uniqueName: name,
    });
  } catch (err) {
    console.error(err);
  }
}

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
      <Box padding="space70">
        <Grid gutter="space50">
          <Column span={3}>
            <Box>
              <Card padding="space100">
                <Heading as="h1" variant="heading10">
                  Conversations
                </Heading>
                <Box marginBottom="space100">
                  <InputAndAdd
                    label="Conversation Name"
                    helpText="Create a new conversation."
                    onAdd={onAdd}
                  />
                </Box>
                <ul>
                  {conversations.map((conversation, i) => (
                    <li key={i}>
                      <Button
                        variant="link"
                        onClick={() => setActiveConversation(conversation)}
                      >
                        {conversation.friendlyName}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </Box>
          </Column>
          <Column span={9}>
            <Box>
              <Card padding="space100">
                {activeConversation && (
                  <Conversation
                    client={client}
                    conversation={activeConversation}
                  />
                )}
              </Card>
            </Box>
          </Column>
        </Grid>
      </Box>
    </Theme.Provider>
  );
}
