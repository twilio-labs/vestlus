import twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

export default async function createToken(
  accountSid,
  apiKey,
  apiSecret,
  identity
) {
  const client = twilio(apiKey, apiSecret, { accountSid });

  // Grab the first conversations service.
  // If there are none, should we create it?
  const { sid: serviceSid } = (
    await client.conversations.services.list({ limit: 1 })
  )?.[0];

  const chatGrant = new ChatGrant({
    serviceSid,
  });

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
  });

  token.addGrant(chatGrant);

  return token.toJwt();
}
