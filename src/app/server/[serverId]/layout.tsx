import { redirect } from "next/navigation";

import ServerSidebar from "@/components/server/server-sidebar";
import { getUser } from "@/lib/auth/auth-session";
import { db } from "@/lib/db";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const { serverId } = await params;

  const user = await getUser();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
