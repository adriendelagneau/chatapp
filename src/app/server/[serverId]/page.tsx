import React from "react";

interface ServersPageProps {
  params: Promise<{ serverId: string }>;
}

const ServersPage = async ({ params }: ServersPageProps) => {
  const { serverId } = await params;
  return <div>serverId : {serverId}</div>;
};

export default ServersPage;
