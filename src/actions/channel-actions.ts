"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { ChannelType } from "@/generated";
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

  revalidateTag("channels");
  return channel;
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