import { PartyRole } from "./Party";

export type JWTParty = {
  organization: {
    id: string;
    roles: Array<{
      partyRole: PartyRole;
      role: string;
    }>
  }
};
