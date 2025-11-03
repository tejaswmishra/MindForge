// src/app/api/users/route.ts
import { auth } from "@clerk/nextjs/server";
import { saveUserToSupabase } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const user = await currentUser();
  await saveUserToSupabase(user);

  return new Response(JSON.stringify({ message: "User saved successfully" }), {
    status: 200,
  });
}
