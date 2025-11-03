import { auth } from '@clerk/nextjs/server';

export default async function AuthTest() {
  const { userId } = await auth();
  
  return (
    <div className="p-8">
      <h1>Auth Test</h1>
      <p>User ID: {userId || 'NOT SIGNED IN'}</p>
      {!userId && (
        <a href="/sign-in" className="text-blue-600 underline">
          Click here to sign in
        </a>
      )}
    </div>
  );
}