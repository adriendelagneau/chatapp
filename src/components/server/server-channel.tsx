"use client";

import {
  EditIcon,
  HashIcon,
  LockIcon,
  MicIcon,
  TrashIcon,
  VideoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Channel, Server, MemberRole, ChannelType } from "@/generated";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

import ActionTooltip from "../action-tooltip";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: HashIcon,
  [ChannelType.AUDIO]: MicIcon,
  [ChannelType.VIDEO]: VideoIcon,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const handleClick = () => {
    router.push(`/server/${params.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
   
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-2 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "dar:text-zinc-400 line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>

      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <EditIcon
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <TrashIcon
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden h-4 w-4 text-zinc-500 transition group-hover:block hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <LockIcon className="ml-auto h-4 w-4 text-zinc-500" />
      )}
    </button>
  );
};

export default ServerChannel;
