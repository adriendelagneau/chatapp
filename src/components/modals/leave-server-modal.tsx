"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { leaveServerAction } from "@/actions/server-actions";
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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      if (!server?.id) throw new Error("Missing server info");

      await leaveServerAction({ serverId: server.id });

      onClose();
      // router.refresh();
      router.push("/");
    } catch (err) {
      console.log("Failed to leave server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="tex-black overflow-hidden  p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-semibold">
            Leave server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
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
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
