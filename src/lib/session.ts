import "server-only";
import { headers } from "next/headers";
import { connection } from "next/server";
import { auth } from "@/lib/auth";

export type CurrentUser = {
  id: string;
  name: string;
  image: string | null;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  await connection();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const { id, name, image, role } = session.user;
  return { id, name, image: image ?? null, role };
}
