// app/actions/get-current-member.ts
"use server";

import { getUser } from "@/lib/auth/auth-session";
import { db } from "@/lib/db";



export async function getCurrentMember(serverId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }



    const member = await db.member.findFirst({
        where: {
            serverId,
            userId: user.id,
        },
        include: {
            user: true,
        },
    });

    return member;
}



export async function getOrCreateConversation(
    memberOneId: string,
    memberTwoId: string
) {
    if (!memberOneId || !memberTwoId) return null;

    // Check if a conversation already exists
    let conversation = await db.conversation.findFirst({
        where: {
            OR: [
                { memberOneId, memberTwoId },
                { memberOneId: memberTwoId, memberTwoId: memberOneId },
            ],
        },
        include: {
            memberOne: { include: { user: true } },
            memberTwo: { include: { user: true } },
        },
    });

    if (!conversation) {
        // Create if not exists
        conversation = await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: { include: { user: true } },
                memberTwo: { include: { user: true } },
            },
        });
    }

    return conversation;
}