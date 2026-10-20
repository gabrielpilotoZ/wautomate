import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser, canAccessSession } from "@/lib/api-auth";

// GET: List groups for a session
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ status: false, message: "Não autorizado", error: "Não autorizado" }, { status: 401 });
        }

        const { sessionId } = await params;

        // Verify access
        const canAccess = await canAccessSession(user.id, user.role, sessionId);
        if (!canAccess) {
            return NextResponse.json({ status: false, message: "Forbidden - Cannot access this session", error: "Forbidden - Cannot access this session" }, { status: 403 });
        }

        // Get internal ID
        const session = await prisma.session.findUnique({
            where: { sessionId: sessionId },
            select: { id: true }
        });

        if (!session) {
            return NextResponse.json({ status: false, message: "Sessão não encontrada", error: "Sessão não encontrada" }, { status: 404 });
        }

        const groups = await prisma.group.findMany({
            where: { sessionId: session.id },
            orderBy: { subject: 'asc' }
        });

        return NextResponse.json({ status: true, message: "Groups retrieved successfully", data: groups });
    } catch (error) {
        console.error("Get groups error:", error);
        return NextResponse.json({ status: false, message: "Não foi possível carregar os grupos", error: "Não foi possível carregar os grupos" }, { status: 500 });
    }
}
