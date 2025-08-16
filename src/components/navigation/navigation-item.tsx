"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

import ActionTooltip from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
  defaultChannelId: string;
}

const NavigationItem = ({
  id,
  imageUrl,
  name,
  defaultChannelId,
}: NavigationItemProps) => {
  const params = useParams<{ serverId?: string }>();
  const router = useRouter();



  const handleClick = () => {
    router.push(`/server/${id}/channels/${defaultChannelId}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={handleClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId == id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image sizes="100%" fill src={imageUrl} alt="channels" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
