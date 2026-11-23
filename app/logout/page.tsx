// app/(main)/logout/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogoutPanel } from "./components/sessionDisable";

export default function Page() {
  const router = useRouter();
  return (
    <main
      role="dialog"
      aria-labelledby="logout-title"
      className="flex min-h-[80vh] items-center justify-center p-4"
    >
      <LogoutPanel onCancel={() => router.back()} />
    </main>
  );
}