import NextAuth from "next-auth";
import SudapassProvider from "@/lib/auth/sudapass-provider";
import MockSudapassProvider from "@/lib/auth/mock-sudapass-provider";
import { authConfig } from "./auth.config";

const useRealSudapass = Boolean(process.env.SUDAPASS_CLIENT_ID);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  providers: [
    useRealSudapass ? SudapassProvider() : MockSudapassProvider()
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, account }) {
      // On initial sign in
      if (user && account) {
            console.log("[AUTH SERVER] Provider used:", account.provider);
    console.log("[AUTH SERVER] Raw user object from provider:", user); // 👈
        return {
          ...token,
          sub: user.id || user.sub,
          national_id: user.national_id,
          name: user.name,
          birthDate: user.birthDate,
          gender: user.gender,
          email: user.email,
          phone_number: user.phone_number,
          nationality: user.nationality,
          picture: user.picture || user.image,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
        };
      }

      // Handle token refresh logic for Real Sudapass here if needed
      // const expiresAt = token.expires_at as number | undefined;
      // if (expiresAt && Date.now() >= expiresAt) { ... refresh logic ... }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          sub: token.sub as string | undefined,
          national_id: token.national_id as string | undefined,
          name: token.name as string | undefined,
          birthDate: token.birthDate as string | undefined,
          gender: token.gender as string | undefined,
          email: (token.email as string) ?? "",
          phone_number: token.phone_number as string | undefined,
          nationality: token.nationality as string | undefined,
          picture: token.picture as string | undefined,
          access_token: token.access_token as string | undefined,
        };
      }

      if (token.error) {
        session.error = token.error as "RefreshTokenError";
      }

      return session;
    },
  },

  events: {
    async signOut(message) {
      if (useRealSudapass && "token" in message && message.token?.refresh_token) {
        const baseUrl = process.env.SUDAPASS_BASE_URL;
        const clientId = process.env.SUDAPASS_CLIENT_ID;
        if (baseUrl && clientId) {
          try {
            await fetch(`${baseUrl}/oauth/token/revocation`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                token: message.token.refresh_token as string,
                client_id: clientId,
                token_type_hint: "refresh_token",
              }),
            });
          } catch (error) {
            console.error("Token revocation failed", error);
          }
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
});
