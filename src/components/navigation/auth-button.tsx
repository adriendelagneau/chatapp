"use client";

import { authClient } from "@/lib/auth/auth-client";

import { UserButton } from "./user-button";
import { Skeleton } from "../ui/skeleton";

// Inner logic component for session logic
export const AuthButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="">
      {user ? <UserButton /> : <Skeleton className="h-8 w-8 rounded-full" />}
    </div>
  );
};
