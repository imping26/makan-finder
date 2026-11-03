"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

type SignInButtonProps = {
  callbackURL?: string;
  label?: string;
};

export function SignInButton({
  callbackURL,
  label = "Sign in",
}: SignInButtonProps) {
  const pathname = usePathname();

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL ?? pathname,
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={handleSignIn}>
      {label}
    </Button>
  );
}
