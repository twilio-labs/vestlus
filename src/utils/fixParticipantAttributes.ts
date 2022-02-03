import { Participant } from "@twilio/conversations";

type MutableParticipant = {
  -readonly [K in keyof Participant]: Participant[K];
};

export function fixParticipantAttributes(participant: Participant): void {
  // This is a workaround for a bug, where the attributes come back as a string rather than the object
  const attributes = JSON.parse(participant.attributes as string) as Record<
    string,
    unknown
  >;
  // Cast so that we can mutate the participant's attributes field
  (participant as MutableParticipant).attributes = attributes;
}
