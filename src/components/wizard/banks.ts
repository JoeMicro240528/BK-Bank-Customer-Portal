import type { BankOption } from "./types";

/**
 * Selectable banks and their branches.
 * Replace with master-data from the backend once that endpoint is wired up.
 */
export const bankOptions: BankOption[] = [
  {
    id: "khartoum",
    name: "بنك الخرطوم",
    color: "#f59e0b",
    branches: [
      { id: "khartoum-main", name: "فرع الخرطوم الرئيسي" },
      { id: "khartoum-riyadh", name: "فرع الرياض" },
      { id: "khartoum-bahri", name: "فرع بحري" },
    ],
  },
  {
    id: "faisal",
    name: "بنك فيصل الإسلامي",
    color: "#15803d",
    branches: [
      { id: "faisal-mugran", name: "فرع المقرن" },
      { id: "faisal-souq", name: "فرع السوق المحلي" },
    ],
  },
  {
    id: "omdurman",
    name: "بنك أم درمان الوطني",
    color: "#1d4ed8",
    branches: [
      { id: "omdurman-souq", name: "فرع السوق العربي" },
      { id: "omdurman-main", name: "فرع أم درمان الرئيسي" },
    ],
  },
  {
    id: "albalad",
    name: "بنك البلد",
    color: "#7c3aed",
    branches: [{ id: "albalad-main", name: "الفرع الرئيسي" }],
  },
  {
    id: "nile",
    name: "بنك النيل",
    color: "#0891b2",
    branches: [{ id: "nile-main", name: "الفرع الرئيسي" }],
  },
  {
    id: "albaraka",
    name: "بنك البركة",
    color: "#be123c",
    branches: [{ id: "albaraka-main", name: "الفرع الرئيسي" }],
  },
];
