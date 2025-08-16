"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SignInView } from "./sign-in-view";
import { authClient } from "@/lib/auth/auth-client";

export const SignInModal = () => {
  const { data: session, isPending } = authClient.useSession();

  // Wait until session state settles
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setSessionReady(true);
    }
  }, [isPending]);

  // Don't render anything until session is loaded
  if (!sessionReady || session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card max-w-md w-full p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Connexion ou Inscription</h2>

        <SignInView />

        <p className="text-muted-foreground text-xs mt-4 text-center">
          En continuant, vous acceptez notre{" "}
          <Link href="/legal" className="cursor-pointer hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
