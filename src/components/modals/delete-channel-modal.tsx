"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { deleteChannelAction } from "@/actions/channel-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!channel?.id || !server?.id) return;
    try {
      setIsLoading(true);

      const { serverId, channelId } = await deleteChannelAction(
        channel.id,
        server.id
      );

      onClose();
      router.push(`/server/${serverId}/channels/${channelId}`);
    } catch (err) {
      console.error("Failed to delete channel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tex-black overflow-hidden">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Delete channel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">
              #{channel?.name}{" "}
            </span>
            will be permanetly deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleClick}
              variant={"secondary"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
