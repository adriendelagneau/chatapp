import React from "react";

import { getServers } from "@/actions/server-actions";

import { AuthButton } from "./auth-button";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";
import { ThemeSwitch } from "./theme-switch";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const NavigationSidebar = async () => {
  const servers = await getServers();



  return (
    <div className="text-primary flex h-full w-full flex-col items-center space-y-4 py-3">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              defaultChannelId={server.channels[0].id}
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ThemeSwitch />

        <AuthButton />
      </div>
    </div>
  );
};

export default NavigationSidebar;
