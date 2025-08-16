"use client";

import axios from "axios";
import { CheckIcon, Copy, RefreshCcwIcon } from "lucide-react";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", { server: res.data });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            invite Friends
          </DialogTitle>
          <DialogDescription>
            Give this code to your friends, after they passed the link in the
            url bar, they will be added to your server
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase">server link</Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              onChange={() => {}}
              disabled={isLoading}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              onClick={onCopy}
              size="icon"
              variant={"secondary"}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="mt-4 text-xs text-zinc-500"
          >
            Generate a new link
            <RefreshCcwIcon className="w--4 ml-2 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
