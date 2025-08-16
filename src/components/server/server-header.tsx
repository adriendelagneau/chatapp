"use client";

import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  TrashIcon,
  User2Icon,
  UserPlus,
} from "lucide-react";
import React from "react";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithUser } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ServerHeaderProps {
  server: ServerWithMembersWithUser;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="foncus:outline-none" asChild>
        <button className="text-md hover:bg-zin-700/10 dar:hover:bg-zinc-700/50 transition° flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
          {server.name}
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-medim w-56 space-y-[2px] text-xs text-black dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm text-blue-700 dark:text-blue-400"
            onClick={() => onOpen("invite", { server })}
          >
            Invite people
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Server Settings
            <SettingsIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Mange Users
            <User2Icon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Create Channel
            <PlusCircleIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-600 dark:text-rose-400"
          >
            Delete Server
            <TrashIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-600 dark:text-rose-400"
          >
            Leave Server
            <LogOutIcon className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
