import { Member, Server, User } from "@/generated";

export type SocketUser = {
    userId: string;
    socketId: string;
    profile: User;
}

export type ServerWithMembersWithUser = Server & {
    members: (Member & { user: User})[]
}