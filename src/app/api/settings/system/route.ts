import { parseReplyTiming, globalReplyTiming, ReplyTimingError } from "@/lib/reply-timing";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado", error: "Não autorizado" }, { status: 401 });
        }

        // @ts-ignore
        const config = await prisma.systemConfig.findUnique({
            where: { id: "default" }
        });

        return NextResponse.json({ status: true, message: "System config fetched", data: config || { appName: "WA-AKG", faviconUrl: "/favicon.ico" } });
    } catch (error) {
        if (error instanceof ReplyTimingError) return NextResponse.json({ error: error.message, message: error.message }, { status: 400 });
        return NextResponse.json({ status: false, message: "Failed to fetch settings", error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // @ts-ignore
        const user = await getAuthenticatedUser(req);
        if (!user || user.role !== "SUPERADMIN") {
            return NextResponse.json({ status: false, message: "Não autorizado", error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { appName, logoUrl, faviconUrl, timezone, enableRegistration } = body;

        const current = await prisma.systemConfig.findUnique({ where: { id: "default" } });
        const timing = parseReplyTiming(body, current ?? globalReplyTiming, true);
        const config = await prisma.systemConfig.upsert({
            where: { id: "default" },
            update: { ...timing, replyTypingEnabled: timing.replyTypingEnabled ?? false, appName, logoUrl, faviconUrl, timezone, enableRegistration: enableRegistration ?? true },
            create: { ...timing, replyTypingEnabled: timing.replyTypingEnabled ?? false, id: "default", appName, logoUrl: logoUrl || "", faviconUrl: faviconUrl || "/favicon.ico", timezone: timezone || "Asia/Jakarta", enableRegistration: enableRegistration ?? true }
        });

        return NextResponse.json({ status: true, message: "System settings updated", data: config });
    } catch (error) {
        if (error instanceof ReplyTimingError) return NextResponse.json({ error: error.message, message: error.message }, { status: 400 });
        return NextResponse.json({ status: false, message: "Failed to update settings", error: "Failed to update settings" }, { status: 500 });
    }
}
