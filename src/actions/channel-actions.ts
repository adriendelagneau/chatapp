"use server";


import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";


import { ChannelType, MemberRole } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";
import { db } from "@/lib/db";

interface CreateChannelInput {
  serverId: string;
  name: string;
  type: ChannelType;
}



export async function createChannel({ serverId, name, type }: CreateChannelInput) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  // make sure the user is part of the server
  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: { some: { userId: user.id } },
    },
  });

  if (!server) throw new Error("Server not found or access denied");

  // create the channel
  const channel = await db.channel.create({
    data: {
      name,
      type,
      serverId,
      userId: user.id, // creator
    },
  });

  // invalidate channels cache
  revalidateTag("channels");

  return {
    serverId,
    channelId: channel.id,
  };
}

export async function getChannelWithMember(serverId: string, channelId: string) {
  const profile = await getUser(); // or however you get the logged-in user
  if (!profile) {
    redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      userId: profile.id,
    },
    include: {
      user: true,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return { channel, member };
};

export async function deleteChannelAction(channelId: string, serverId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  try {

    if (!serverId) {
      throw new Error("Server ID missing");
    }

    // enforce permissions
    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: { not: "general" },
          },
        },
      },
    });

    // grab a channel to redirect into
    const remainingChannels = await db.channel.findMany({
      where: { serverId },
      orderBy: { createdAt: "asc" }, // so "general" comes first
    });

    if (!remainingChannels.length) {
      throw new Error("No channels remain in this server.");
    }

    const nextChannel = remainingChannels[0];

    // revalidate server page
    revalidatePath(`/server/${serverId}`);

    return { serverId, channelId: nextChannel.id };
  } catch (error) {
    console.error("[deleteChannelAction]", error);
    throw new Error("Failed to delete channel");
  }
}


interface EditChannelInput {
  channelId: string
  serverId: string
  name: string
  type: ChannelType
}

export async function editChannelAction({ channelId, serverId, name, type }: EditChannelInput) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  if (name === "general") throw new Error("Channel name cannot be 'general'");

  // update the channel
  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          userId: user.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
          }
        }
      }
    },
    data: {
      channels: {
        update: {
          where: {
            id: channelId,
            NOT: { name: "general" }
          },
          data: { name, type }
        }
      }
    }
  });

  return server;
}