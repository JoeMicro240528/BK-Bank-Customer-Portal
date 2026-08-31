import Credentials from "next-auth/providers/credentials";
import { verifyMockSudaPass } from "@/lib/sudapass-mock";

export default function MockSudapassProvider() {
  return Credentials({
    id: "mock-sudapass",
    name: "Mock SudaPass",
    credentials: {
      nationalId: { label: "National ID", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.nationalId || typeof credentials.nationalId !== "string") {
        throw new Error("Missing nationalId");
      }

      const identity = verifyMockSudaPass(credentials.nationalId);

      if (!identity) {
        throw new Error("Invalid national ID");
      }

      // Map to the shape expected by NextAuth and our app
      return {
        id: identity.id, // Must provide an `id` to NextAuth
        sub: identity.id,
        name: identity.nameArabic || identity.nameEnglish,
        national_id: identity.identity.number,
        nationality_no: identity.nationalId,
        birthDate: identity.dateOfBirth,
        gender: identity.gender,
        email: identity.email,
        phone_number: identity.mobile,
        nationality: identity.nationalityCountryCode,
        picture: "",
      };
    },
  });
}
