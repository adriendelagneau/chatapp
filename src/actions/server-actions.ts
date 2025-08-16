"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";


const prisma = new PrismaClient();




export async function getServers() {

  const user = await getUser();
  if (!user) {
    return [];
  }



  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
  return servers;
}



const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.url({ message: "A valid server image is required" }),
});

export async function createServerAction(values: z.infer<typeof formSchema>) {
  const parsed = formSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid form input");
  }

  const { name, imageUrl } = parsed.data;

  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const server = await prisma.server.create({
    data: {
      name,
      imageUrl,
      inviteCode: uuidv4(),
      userId: user.id,
      channels: {
        create: [
          { name: "general", userId: user.id }
        ],
      },
      members: {
        create: [
          { userId: user.id, role: "ADMIN" }
        ],
      },
    },
  });

  // Invalidate server list cache
  revalidateTag("servers");

  return server;
}

export const getServerById = async ({ id }: { id: string }) => {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const server = await prisma.server.findFirst({
    where: {
      id,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: { name: "general" },
        orderBy: { createdAt: "asc" },
      },
      members: {
        include: {
          user: true, // include the User object for each member
        },
      },
    },
  });

  return server;


  return server;
};








export async function joinServerByInvite(inviteCode: string) {
  const profile = await getUser();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!inviteCode) {
    redirect("/");
  }

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    // 🔄 refresh caches that depend on "servers"
    revalidateTag("servers");
    redirect(`/server/${existingServer.id}`);
  }

  const server = await prisma.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [{ userId: profile.id }],
      },
    },
  });

  if (server) {
    // 🔄 refresh caches that depend on "servers"
    revalidateTag("servers");
    redirect(`/server/${server.id}`);
  }

  redirect("/");
}


interface UpdateServerInput {
  serverId: string
  name: string
  imageUrl: string
}

export async function updateServer({ serverId, name, imageUrl }: UpdateServerInput) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const server = await prisma.server.update({
    where: {
      id: serverId,
      userId: user.id, // only owner can update
    },
    data: {
      name,
      imageUrl,
    },
  });

  // 🔄 revalidate any cached fetches if needed
  revalidateTag("servers");

  return server;
}


export async function kickMember(memberId: string, serverId: string) {

  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // ensure requester is server owner
  const server = await prisma.server.findUnique({
    where: { id: serverId },
  });
  if (!server || server.userId !== user.id) throw new Error("Forbidden");

  const updated = await prisma.server.update({
    where: { id: serverId },
    data: {
      members: {
        delete: { id: memberId },
      },
    },
    include: { members: { include: { user: true } } },
  });

  revalidateTag(`server-${serverId}`);
  return updated;
}

export async function changeRole(
  memberId: string,
  serverId: string,
  role: "GUEST" | "MODERATOR" | "ADMIN"
) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const server = await prisma.server.findUnique({
    where: { id: serverId },
  });
  if (!server || server.userId !== user.id) throw new Error("Forbidden");

  const updated = await prisma.server.update({
    where: { id: serverId },
    data: {
      members: {
        update: {
          where: { id: memberId },
          data: { role },
        },
      },
    },
    include: { members: { include: { user: true } } },
  });

  revalidateTag(`server-${serverId}`);
  return updated;
}