"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NewRequestScreen from "@/components/wizard/NewRequestScreen";

export default function NewRequestPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <NewRequestScreen
      onBack={() => router.push("/profile")}
      onContinue={() => router.push("/cbos-form")}
      onLogout={() => signOut()}
    />
  );
}
