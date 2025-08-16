"use client";

import { CreateServerModal } from "../create-server/create-server-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { InviteModal } from "../modals/invite-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { MembersModal } from "../modals/members-modal";

export const ModalProvider = () => {
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //     setIsMounted(true);
  // }, []);

  // if (!isMounted) {
  //     return null;
  // }

  return (
    <>
      <CreateServerModal />
      <InviteModal />

      {/*
       */}
    </>
  );
};
