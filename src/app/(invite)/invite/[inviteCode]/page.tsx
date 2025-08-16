import { joinServerByInvite } from "@/actions/server-actions";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = await params;
  await joinServerByInvite(inviteCode);
  return null;
};

export default InviteCodePage;
