import twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

export default async function createSession(
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

  console.log("Using conversations service " + serviceSid);

  const chatGrant = new ChatGrant({
    serviceSid,
  });

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
  });

  token.addGrant(chatGrant);

  const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();

  const phoneNumbers = incomingPhoneNumbers
    .filter((phoneNumber) => phoneNumber.capabilities.sms === true)
    .map((phoneNumber) => ({
      friendlyName: phoneNumber.friendlyName,
      phoneNumber: phoneNumber.phoneNumber,
      sid: phoneNumber.sid,
    }));

  return {
    token: token.toJwt(),
    phoneNumbers,
  };
}
