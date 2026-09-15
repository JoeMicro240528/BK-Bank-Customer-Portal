import type { Metadata } from "next";
import "./globals.css";

import AuthSessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "ONB Customer Information Update",
  description: "Public customer information update portal for Omdurman National Bank AUF requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
