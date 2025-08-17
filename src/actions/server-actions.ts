"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { ChannelType } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";
import { db } from "@/lib/db";


export async function getServers() {

  const user = await getUser();
  if (!user) {
    return [];
  }



  const servers = await db.server.findMany({
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

  const server = await db.server.create({
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
    include: {
      channels: true, // so we can grab the first channel
    },
  });

  // Invalidate server list cache
  revalidateTag("servers");

  return {
    serverId: server.id,
    channelId: server.channels[0].id,
  };
}

export const getServerById = async ({ id }: { id: string }) => {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const server = await db.server.findFirst({
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

};

export async function joinServerByInvite(inviteCode: string) {
  const profile = await getUser();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!inviteCode) {
    redirect("/");
  }

  const existingServer = await db.server.findFirst({
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
    redirect(`/server/${existingServer.id}`);
    // revalidateTag("servers");
  }

  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [{ userId: profile.id }],
      },
    },
  });

  if (server) {
    // 🔄 refresh caches that depend on "servers"
    // revalidateTag("servers");
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

  const server = await db.server.update({
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
  const server = await db.server.findUnique({
    where: { id: serverId },
  });
  if (!server || server.userId !== user.id) throw new Error("Forbidden");

  const updated = await db.server.update({
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

  const server = await db.server.findUnique({
    where: { id: serverId },
  });
  if (!server || server.userId !== user.id) throw new Error("Forbidden");

  const updated = await db.server.update({
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


export async function getServerOrRedirect(serverId: string) {
  const user = await getUser();

  if (!user) {
    redirect("/"); // not logged in
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  return { server, user };
}


export async function getServerSidebarData(serverId: string) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: {
        include: { user: true },
        orderBy: { role: "asc" },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  const textChannels = server.channels.filter(
    (c) => c.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (c) => c.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (c) => c.type === ChannelType.VIDEO
  );
  const members = server.members.filter((m) => m.userId !== user.id);

  const role = server.members.find((m) => m.userId === user.id)?.role;

  return {
    server,
    role,
    user,
    textChannels,
    audioChannels,
    videoChannels,
    members,
  };
}

export async function deleteServer(serverId: string) {
  try {
    // Example: Delete from DB
     await db.server.delete({ where: { id: serverId } });

    // Revalidate pages that depend on servers
     revalidatePath("/");

    // Redirect after deletion

  } catch (error) {
    console.error("Failed to delete server:", error);
    throw new Error("Something went wrong while deleting the server.");
  }
}
