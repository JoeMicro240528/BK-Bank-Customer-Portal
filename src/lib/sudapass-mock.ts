export type SudaPassIdentity = {
  id: string;
  nationalId: string;
  mobile: string;
  nameArabic: string;
  nameEnglish: string;
  motherName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  birthCountryCode: string;
  birthCountryFallbackId?: number;
  nationalityCountryCode: string;
  nationalityFallbackId?: number;
  maritalStatus: "single" | "married" | "divorced" | "widowed" | "other";
  educationLevel: "elementary" | "secondary" | "diploma" | "graduate" | "post_graduate" | "other";
  email: string;
  identity: {
    type: "national_id" | "passport" | "residency" | "other";
    number: string;
    issuedOn: string;
    expiresOn: string;
  };
};

export const mockSudaPassUsers: SudaPassIdentity[] = [
  {
    id: "sdp-1001",
    nationalId: "SD-1988-445566",
    mobile: "+249912000111",
    nameArabic: "آمنة محمد الطيب",
    nameEnglish: "Amna Mohamed Al Tayeb",
    motherName: "فاطمة عبد الرحمن",
    gender: "female",
    dateOfBirth: "1988-04-12",
    birthCountryCode: "SD",
    birthCountryFallbackId: 195,
    nationalityCountryCode: "SD",
    nationalityFallbackId: 195,
    maritalStatus: "married",
    educationLevel: "graduate",
    email: "amna.altayeb@example.sd",
    identity: {
      type: "national_id",
      number: "1988445566",
      issuedOn: "2020-01-15",
      expiresOn: "2030-01-14",
    },
  },
  {
    id: "sdp-1002",
    nationalId: "SD-1977-998877",
    mobile: "+249912000222",
    nameArabic: "عثمان عبد الله آدم",
    nameEnglish: "Osman Abdalla Adam",
    motherName: "حواء يوسف",
    gender: "male",
    dateOfBirth: "1977-09-03",
    birthCountryCode: "SD",
    birthCountryFallbackId: 195,
    nationalityCountryCode: "SD",
    nationalityFallbackId: 195,
    maritalStatus: "married",
    educationLevel: "secondary",
    email: "osman.adam@example.sd",
    identity: {
      type: "national_id",
      number: "1977998877",
      issuedOn: "2019-08-10",
      expiresOn: "2029-08-09",
    },
  },
  {
    id: "sdp-1003",
    nationalId: "SD-2001-334455",
    mobile: "+249912000333",
    nameArabic: "مريم دينق شول",
    nameEnglish: "Maryam Deng Chol",
    motherName: "أكول شول",
    gender: "female",
    dateOfBirth: "2001-12-21",
    birthCountryCode: "SD",
    birthCountryFallbackId: 195,
    nationalityCountryCode: "SD",
    nationalityFallbackId: 195,
    maritalStatus: "single",
    educationLevel: "diploma",
    email: "maryam.chol@example.sd",
    identity: {
      type: "national_id",
      number: "2001334455",
      issuedOn: "2021-03-20",
      expiresOn: "2031-03-19",
    },
  },
];

export function verifyMockSudaPass(identifier: string): SudaPassIdentity | null {
  const normalizedIdentifier = normalizeIdentifier(identifier);

  return (
    mockSudaPassUsers.find(
      (user) =>
        [user.nationalId, user.identity.number].some(
          (candidate) => normalizeIdentifier(candidate) === normalizedIdentifier,
        ),
    ) || null
  );
}

function normalizeIdentifier(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}
