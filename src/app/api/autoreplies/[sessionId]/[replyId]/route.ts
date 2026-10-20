import { parseReplyTiming, ReplyTimingError } from "@/lib/reply-timing";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string; replyId: string }> }
) {
    try {
        const { sessionId, replyId } = await params;
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado", error: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden - Cannot access this session", error: "Forbidden - Cannot access this session" }, { status: 403 });
        }

        const body = await request.json();
        const { keyword, response, matchType, triggerType, isMedia, mediaUrl, mediaType } = body;

        if (!keyword || (!response && !mediaUrl)) {
            return NextResponse.json({ status: false, message: "Informe uma palavra-chave e uma resposta ou mídia", error: "Keyword and response are required" }, { status: 400 });
        }

        const existing = await prisma.autoReply.findFirst({ where: { id: replyId, session: { sessionId } } });
        if (!existing) return NextResponse.json({ error: "Regra não encontrada nesta sessão" }, { status: 404 });
        const updated = await prisma.autoReply.update({
            where: { id: replyId },
            data: {
                ...parseReplyTiming(body, existing),
                keyword,
                response,
                matchType: matchType || "EXACT",
                triggerType: triggerType || "ALL",
                isMedia: isMedia || false,
                mediaUrl: mediaUrl || null,
                mediaType: mediaType || null
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof ReplyTimingError) return NextResponse.json({ error: error.message, message: error.message }, { status: 400 });
        console.error("Update auto reply error:", error);
        return NextResponse.json({ status: false, message: "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string; replyId: string }> }
) {
    try {
        const { sessionId, replyId } = await params;

        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado", error: "Não autorizado" }, { status: 401 });
        }

        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden - Cannot access this session", error: "Forbidden - Cannot access this session" }, { status: 403 });
        }

        const rule = await prisma.autoReply.findUnique({
            where: { id: replyId },
            include: { session: true }
        });

        if (!rule) {
            return NextResponse.json({ status: false, message: "Regra não encontrada", error: "Regra não encontrada" }, { status: 404 });
        }

        // Verify the rule belongs to this session
        if (rule.session.sessionId !== sessionId) {
            return NextResponse.json({ status: false, message: "Rule not found in this session", error: "Rule not found in this session" }, { status: 404 });
        }

        await prisma.autoReply.delete({ where: { id: replyId } });
        return NextResponse.json({ status: true, message: "Operation successful" });

    } catch (error) {
        if (error instanceof ReplyTimingError) return NextResponse.json({ error: error.message, message: error.message }, { status: 400 });
        console.error("Delete auto reply error:", error);
        return NextResponse.json({ status: false, message: "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
    }
}
