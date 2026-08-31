export type Language = "en" | "ar";

export type NavKey =
  | "home"
  | "newRequest"
  | "myRequests"
  | "myData"
  | "notifications"
  | "faq"
  | "contact";

export type DashboardUser = {
  name: string;
  role: string;
  picture?: string;
};

export type Crumb = {
  label: string;
  href?: string;
};

export type DashboardCopy = {
  platformName: string;
  platformTagline: string;
  nav: Record<NavKey, string>;
  logout: string;
  language: string;
  english: string;
  arabic: string;
  openMenu: string;
  notifications: string;
};
