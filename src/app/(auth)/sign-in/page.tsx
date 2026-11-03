import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInButton } from "@/components/auth/sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Sign in to Makan Finder</h1>
      <p className="text-sm text-muted-foreground">
        Save your favourite spots and write reviews.
      </p>
      <Suspense fallback={<SignInButton label="Continue with Google" />}>
        <SignInWithCallback searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SignInWithCallback({
  searchParams,
}: Pick<PageProps<"/sign-in">, "searchParams">) {
  const { callbackUrl } = await searchParams;
  const value = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
  const safe = value?.startsWith("/") && !value.startsWith("//") ? value : "/";
  return <SignInButton callbackURL={safe} label="Continue with Google" />;
}
