"use client";
import { PlusIcon } from "lucide-react";
import React from "react";

import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

const CreateServerButton = () => {
  const { onOpen } = useModal();

  return (
    <ActionTooltip label="Add a server" side="right" align="center">
      <button
        className="group flex items-center"
        onClick={() => onOpen("createServer")}
      >
        <div className="bg-background mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
          <PlusIcon
            className="text-emerald-500 transition group-hover:text-white"
            size={25}
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
export default CreateServerButton;
