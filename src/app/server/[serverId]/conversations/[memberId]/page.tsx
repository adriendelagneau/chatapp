import { redirect } from "next/navigation";

import {
  getCurrentMember,
  getOrCreateConversation,
} from "@/actions/member-actions";
import ChatHeader from "@/components/chat/chat-header";

// import ChatMessages from "@/components/chat/chat-messages";
// import MediaRoom from "@/components/media-room";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>;
  searchParams: {
    video?: string;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const { memberId, serverId } = await params;

  const currentMember = await getCurrentMember(serverId);

  if (!currentMember) {
    redirect("/sign-in");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  console.log(conversation);
  if (!conversation) {
    redirect(`/server/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.userId === currentMember.userId ? memberTwo : memberOne;

  const isVideo = searchParams?.video === "true";

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageUrl={otherMember.user.image || ""}
        name={otherMember.user.name || "Jogn Doe"}
        serverId={serverId}
        type="conversation"
      />

      {/* {isVideo ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.user.name || "John Doe"}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )} */}
    </div>
  );
};

export default MemberIdPage;
