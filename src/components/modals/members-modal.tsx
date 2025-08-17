"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  GavelIcon,
  Loader2Icon,
  MoreVerticalIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldQuestionIcon,
} from "lucide-react";
import React, { useState } from "react";

import {
  changeRole,
  getServerById,
  kickMember,
} from "@/actions/server-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithUser } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheckIcon className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlertIcon className="ml-2 h-4 w-4 text-rose-500" />,
};

export const MembersModal = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const serverId = (data as { server: ServerWithMembersWithUser })?.server?.id;

  // Fetch server + members
  const { data: server } = useQuery({
    queryKey: ["server", serverId],
    queryFn: () => getServerById({ id: serverId! }),
    enabled: !!serverId,
  });

  const handleKick = async (memberId: string) => {
    if (!server) return;
    try {
      setLoadingId(memberId);
      await kickMember(memberId, server.id);
    } finally {
      setLoadingId("");
    }
  };

  const handleRoleChange = async (
    memberId: string,
    role: "GUEST" | "MODERATOR" | "ADMIN"
  ) => {
    if (!server) return;
    try {
      setLoadingId(memberId);
      await changeRole(memberId, server.id, role);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar
                src={
                  member.user.image ??
                  "https://ik.imagekit.io/pxvdb30xa/posts/pngwing.com_xtHeMuHlt.png"
                }
              />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.user.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs">{member.user.email}</p>
              </div>

              {server.userId !== member.userId && loadingId !== member.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center">
                        <ShieldQuestionIcon className="ml-2 h-4 w-4" />
                        <span>Role</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(member.id, "GUEST")}
                          >
                            <ShieldIcon className="mr-2 h-4 w-4" />
                            Guest
                            {member.role === "GUEST" && (
                              <Check className="mr-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(member.id, "MODERATOR")
                            }
                          >
                            <ShieldIcon className="mr-2 h-4 w-4" />
                            Moderator
                            {member.role === "MODERATOR" && (
                              <Check className="mr-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleKick(member.id)}>
                      <GavelIcon className="mr-2 h-4 w-4" />
                      Kick
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {loadingId === member.id && (
                <Loader2Icon className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
