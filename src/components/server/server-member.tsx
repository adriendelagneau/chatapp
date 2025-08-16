"use client";

import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { Member, MemberRole, User, Server } from "@/generated";
import { cn } from "@/lib/utils";

import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: Member & { user: User };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheckIcon className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlertIcon className="ml-2 h-4 w-4 text-rose-500" />
  ),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleClick = () => {
    router.push(`/server/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        "group transitionmb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.user.image || ""}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.user.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
