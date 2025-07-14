import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// --- INÍCIO: Lógica de Rate Limiting (Exemplo em memória - NÃO USAR EM PRODUÇÃO) ---
const requestCounts = new Map<string, { count: number; lastReset: number }>()
const MAX_REQUESTS = 10 // Limite de 5 requisições
const WINDOW_MS = 10 * 1000 // Em 10 segundos

function getClientIp(req: Request): string {
    const xForwardedFor = req.headers.get("x-forwarded-for")
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim()
    }
    return "unknown-ip"
}
// --- FIM: Lógica de Rate Limiting ---

export async function POST(request: Request) {
    const clientIp = getClientIp(request)
    const now = Date.now()

    // --- APLICAÇÃO DO RATE LIMITING ---
    const clientData = requestCounts.get(clientIp)
    if (clientData && now - clientData.lastReset < WINDOW_MS) {
        if (clientData.count >= MAX_REQUESTS) {
            return NextResponse.json(
                { error: "Muitas requisições. Tente novamente mais tarde." },
                { status: 429 }, // 429 Too Many Requests
            )
        }
        clientData.count++
    } else {
        requestCounts.set(clientIp, { count: 1, lastReset: now })
    }
    // --- FIM DA APLICAÇÃO DO RATE LIMITING ---

    try {
        const { seminarioId, cpf, codigoUid } = await request.json()

        if (!seminarioId) {
            return NextResponse.json({ error: "ID do seminário é obrigatório." }, { status: 400 })
        }

        if (!cpf && !codigoUid) {
            return NextResponse.json({ error: "CPF ou Código UID é obrigatório." }, { status: 400 })
        }

        const whereClause: any = {
            seminario_id: Number.parseInt(seminarioId),
        }

        if (cpf) {
            whereClause.cpf = cpf
        } else if (codigoUid) {
            whereClause.codigo_uid = codigoUid
        }

        const inscricao = await prisma.inscricaoSeminario.findFirst({
            where: whereClause,
            select: {
                nome_completo: true, // Selecionando apenas o nome_completo
            },
        })

        if (inscricao) {
            return NextResponse.json({ found: true, message: `Inscrição encontrada para: ${inscricao.nome_completo}` })
        } else {
            return NextResponse.json({ found: false, message: "Inscrição não encontrada para este seminário." })
        }
    } catch (error) {
        console.error("Erro ao verificar inscrição:", error)
        return NextResponse.json({ error: "Erro interno do servidor ao verificar inscrição." }, { status: 500 })
    }
}
