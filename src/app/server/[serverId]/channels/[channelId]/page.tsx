import { getChannelWithMember } from "@/actions/channel-actions";
import ChatHeader from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const { serverId, channelId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { channel, member } = await getChannelWithMember(serverId, channelId);

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
