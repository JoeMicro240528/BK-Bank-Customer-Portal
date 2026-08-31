"use client";

import NewRequestScreen from "@/components/wizard/NewRequestScreen";
import type { AddedAccount } from "@/components/wizard/types";

/** Fixture accounts so the added-accounts table is populated in the preview. */
const previewAccounts: AddedAccount[] = [
  {
    id: "1",
    bankId: "khartoum",
    bankName: "بنك الخرطوم",
    bankColor: "#f59e0b",
    branch: "فرع الخرطوم الرئيسي",
    accountNumber: "1234567890123",
  },
  {
    id: "2",
    bankId: "faisal",
    bankName: "بنك فيصل الإسلامي",
    bankColor: "#15803d",
    branch: "فرع المقرن",
    accountNumber: "9876543210987",
  },
  {
    id: "3",
    bankId: "omdurman",
    bankName: "بنك أم درمان الوطني",
    bankColor: "#1d4ed8",
    branch: "فرع السوق العربي",
    accountNumber: "1112223334445",
  },
];

export default function NewRequestPreview() {
  return <NewRequestScreen initialAccounts={previewAccounts} notificationCount={3} />;
}
