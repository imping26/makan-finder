import "server-only";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getMySubmissions() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.query.restaurants.findMany({
    where: (r, { eq }) => eq(r.createdBy, user.id),
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    columns: {
      id: true,
      slug: true,
      name: true,
      status: true,
      createdAt: true,
    },
  });
}

export type MySubmission = Awaited<ReturnType<typeof getMySubmissions>>[number];
