"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };
  return (
    <Button size="sm" variant="ghost" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
