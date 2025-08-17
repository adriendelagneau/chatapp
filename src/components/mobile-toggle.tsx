import { MenuIcon } from "lucide-react";
import React from "react";

import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"} className="md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="flex gap-0 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
