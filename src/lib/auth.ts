import { auth, currentUser } from "@clerk/nextjs/server";
import { db, users } from "@/lib/database";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // 1️⃣ Check DB
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerk_id, userId))
    .limit(1);

  if (user) return user;

  // 2️⃣ Fetch Clerk user
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found");

  // ✅ SAFE, NON-NULL NAME
  const name =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ") ||
    email.split("@")[0]; // fallback

  // 3️⃣ Insert into DB
  [user] = await db
    .insert(users)
    .values({
      clerk_id: userId,
      email,
      name, 
    })
    .returning();

  return user;
}
