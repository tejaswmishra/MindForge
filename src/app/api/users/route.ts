import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401 }
    );
  }

  return new Response(JSON.stringify(user), { status: 200 });
}
