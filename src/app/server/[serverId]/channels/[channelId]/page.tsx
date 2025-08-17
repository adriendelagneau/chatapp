import { getChannelWithMember } from "@/actions/channel-actions";


interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { serverId, channelId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { channel, member } = await getChannelWithMember(serverId, channelId);

  return (
    <div className="flex h-full flex-col">ok</div>
  );
};

export default ChannelIdPage;
