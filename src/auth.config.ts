import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    authorized() {
      // In this app, the home page '/' is both the login page and the app page.
      // So we don't have protected route middleware redirect logic.
      // If we add /dashboard later, we can check it here.
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
