// import { PartyRole } from './Party';

/* export type JWTUser = {
  uid: string;
  // fiscal_number: string;
  name: string;
  family_name: string;
  email: string;
  organization: {
    id: string;
    roles: Array<{
      partyRole: PartyRole;
      role: string;
    }>;
  };
}; */

export type JWTUser = {
  // iat: 1657714275,
  // exp: 1657743075,
  // aud: "idpay.welfare.pagopa.it",
  // iss: "https://api-io.dev.cstar.pagopa.it",
  uid: string;
  // fiscal_number: string;
  name: string;
  family_name: string;
  email: string;
  org_id: string;
  org_vat: string;
  org_party_role: string;
  org_role: string;
};
