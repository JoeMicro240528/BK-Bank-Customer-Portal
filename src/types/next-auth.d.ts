import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      sub?: string;
      name?: string;
      email?: string;
      national_id?: string;
      birthDate?: string;
      gender?: string;
      phone?: string;
      nationality?: string;
      photo?: string;
      access_token?: string;
    };
    error?: "RefreshTokenError";
  }

  interface User {
    sub?: string;
    national_id?: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
    nationality?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    national_id?: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
    nationality?: string;
    photo?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    error?: "RefreshTokenError";
  }
}
