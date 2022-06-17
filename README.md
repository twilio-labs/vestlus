# Vestlus

_Vestlus is a conversational app._ The name comes from the Estonian word for conversation. It uses Twilio's [Conversations API SDK client library](https://www.twilio.com/docs/conversations/javascript/changelog) along with [Twilio's Paste framework](https://paste.twilio.design/) to demonstrate how you might build a conversation app. Conversations consists of participants and messages, so after logging in you'll see a list of conversations on the left. Once a conversation is selected it will show up on the right, with participants listed at the top and messages below.

Login accounts are stored in a JSON file. You can create a new account, and once you login as it, a Conversations API user will be automatically created. This will make it possible to add that user as a chat participant in a conversation. Once you've created a conversation you can also add a non-chat participant with a phone number simply by typing it in the new participant form field like so, `+12345678900`. This will create a participant using a proxy, and will choose the first phone number configured in the account with SMS capabilities. This behavior can be changed in [ConversationView.tsx](src/views/ConversationsView.tsx)

## Setup

First, create a `.env` file with the following:

```env
TWILIO_ACCOUNT_SID=###################
TWILIO_API_KEY=###################
TWILIO_API_SECRET=###################
```

_Login to <https://console.twilio.com> click 'Account' in the top right and then select 'API keys and tokens'. You **must** use the 'Create API Key' flow for this application._

Second, install dependencies and then you'll be ready to run the application.

```shell
npm install
npm start
```

Vestlus should now be running at [http://localhost:3000](http://localhost:3000)

_This application runs a server using nodemon to handle session creation and then it proxy's frontend requests to a webpack server. This setup works great for local development and demo'ing, but it is not intended for use in a production environment._

## Contribute

Pull requests are welcome!

## License

MIT © Twilio Inc.
