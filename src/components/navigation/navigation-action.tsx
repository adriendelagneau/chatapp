"use client";

import { Plus } from "lucide-react";
import React from "react";

import { useModal } from "@/hooks/use-modal-store";

import ActionTooltip from "../action-tooltip";

const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="bg-background mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px] group-hover:bg-primary">
            <Plus
              className="text-primary transition group-hover:text-secondary"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
