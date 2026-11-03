import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return <SignInButton />;
  }

  return (
    <div className="flex items-center gap-2">
      {user.image ? (
        <Image
          src={user.image}
          alt=""
          width={28}
          height={28}
          className="size-7 rounded-full"
        />
      ) : (
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
          {user.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
      <SignOutButton />
    </div>
  );
}

export function UserMenuSkeleton() {
  return <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />;
}
