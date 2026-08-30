import type { OAuthConfig } from "next-auth/providers";

export interface SudapassProfile {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  national_id?: string;
  national_number?: string;
  birthdate?: string;
  gender?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  picture?: string;
}

const baseUrl = process.env.SUDAPASS_BASE_URL || "";
const clientId = process.env.SUDAPASS_CLIENT_ID || "";
const issuer = process.env.SUDAPASS_ISSUER || "";

function normalizeSudapassGender(gender: string | undefined) {
  if (!gender) return undefined;

  const normalized = gender.trim().toLowerCase();

  if (["m", "male", "ذكر"].includes(normalized)) return "male";
  if (["f", "female", "أنثى", "أنثي", "انثى", "انثي"].includes(normalized)) return "female";

  return undefined;
}

export default function SudapassProvider<P extends SudapassProfile>(): OAuthConfig<P> {
  const configuredScope = "openid email profile national_id address passport phone";

  return {
    id: "sudapass",
    name: "SUDAPASS",
    type: "oidc",

    // OIDC configuration
    issuer,
    clientId,

    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: {
        scope: configuredScope,
      },
    },

    token: { url: `${baseUrl}/oauth/token` },
    userinfo: { url: `${baseUrl}/oauth/me` },
    jwks_endpoint: `${baseUrl}/oauth/jwks`,

    idToken: true,

    checks: ["pkce", "state"],

    // Public client (NO client_secret)
    client: {
      token_endpoint_auth_method: "none",
    },

    profile(profile) {
      const profileWithNationality = profile as P & { nationality?: string };

      // Construct full picture URL if it's a relative path
      let pictureUrl = profile.picture;
      if (pictureUrl && !pictureUrl.startsWith("http")) {
        pictureUrl = `${baseUrl}${pictureUrl}`;
      }

      const mappedProfile = {
        sub: profile.sub,
        name: profile.name,
        national_id: profile.national_id || profile.national_number,
        birthDate: profile.birthdate,
        gender: normalizeSudapassGender(profile.gender),
        email: profile.email,
        phone: profile.phone_number,
        nationality: profileWithNationality.nationality,
        image: pictureUrl,
      };

      return mappedProfile;
    },
  };
}
