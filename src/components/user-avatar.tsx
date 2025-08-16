import React from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  src: string;
  className?: string;
}
const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 rounded-full md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
