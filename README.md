# Vestlus

_Vestlus is a conversational app._ It uses Twilio's Conversations API SDK client library along with Twilio's Paste framework to demonstrate how you might build a conversation app. Conversations consists of participants and messages, so after logging you'll see a list of conversations on the left. Once a conversation is selected participants will be at the top and messages below.

Users are stored in a JSON file. Logging in as a user with automatically create a Conversations API user, which will then make it possible to add that user as a participant in another chat.

## Setup

During development this application runs a server using nodemon and proxy's frontend requests to a webpack server.

First, create a `.env` file with the following:

```env
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY=
TWILIO_API_SECRET=
```

_Login to https://console.twilio.com click 'Account' in the top right and then select 'API keys and tokens'. You **must** use the 'Create API Key' flow for this application._

Second, install dependencies and then you'll be ready to run the application.

```shell
npm install
npm dev
```

Vestlus should now be running at http://localhost:3000

## Contribute

Pull requests are welcome!

## License

MIT © Twilio Inc.
