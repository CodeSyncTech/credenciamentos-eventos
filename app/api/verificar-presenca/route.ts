import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Rate limiting para verificação de presença
const requestCounts = new Map<string, { count: number; lastReset: number }>()
const MAX_REQUESTS = 10 // Limite de 10 requisições
const WINDOW_MS = 30 * 1000 // Em 30 segundos

function getClientIp(req: Request): string {
    const xForwardedFor = req.headers.get("x-forwarded-for")
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim()
    }
    return "unknown-ip"
}

export async function POST(request: Request) {
    const clientIp = getClientIp(request)
    const now = Date.now()

    // Aplicação do rate limiting
    const clientData = requestCounts.get(clientIp)
    if (clientData && now - clientData.lastReset < WINDOW_MS) {
        if (clientData.count >= MAX_REQUESTS) {
            return NextResponse.json({ error: "Muitas requisições. Tente novamente mais tarde." }, { status: 429 })
        }
        clientData.count++
    } else {
        requestCounts.set(clientIp, { count: 1, lastReset: now })
    }

    try {
        const { seminarioId, codigoUid } = await request.json()

        if (!seminarioId) {
            return NextResponse.json({ error: "ID do seminário é obrigatório." }, { status: 400 })
        }

        if (!codigoUid) {
            return NextResponse.json({ error: "Código UID é obrigatório." }, { status: 400 })
        }

        // Busca a inscrição
        const inscricao = await prisma.inscricaoSeminario.findFirst({
            where: {
                seminario_id: Number.parseInt(seminarioId),
                codigo_uid: codigoUid,
            },
            select: {
                id: true,
                nome_completo: true,
                confirmacao_presenca: true,
                data_inscricao: true,
            },
        })

        if (!inscricao) {
            return NextResponse.json({
                success: false,
                message: "Inscrição não encontrada para este seminário.",
            })
        }

        // Verifica se já foi confirmada
        if (inscricao.confirmacao_presenca) {
            return NextResponse.json({
                success: true,
                alreadyConfirmed: true,
                message: `Presença já confirmada para: ${inscricao.nome_completo}`,
                inscricao: {
                    nome_completo: inscricao.nome_completo,
                    data_inscricao: inscricao.data_inscricao,
                    confirmacao_presenca: inscricao.confirmacao_presenca,
                },
            })
        }

        // Atualiza a confirmação de presença
        const inscricaoAtualizada = await prisma.inscricaoSeminario.update({
            where: {
                id: inscricao.id,
            },
            data: {
                confirmacao_presenca: true,
            },
            select: {
                nome_completo: true,
                data_inscricao: true,
                confirmacao_presenca: true,
            },
        })

        return NextResponse.json({
            success: true,
            alreadyConfirmed: false,
            message: `Presença confirmada com sucesso para: ${inscricaoAtualizada.nome_completo}`,
            inscricao: inscricaoAtualizada,
        })
    } catch (error) {
        console.error("Erro ao verificar presença:", error)
        return NextResponse.json(
            {
                error: "Erro interno do servidor ao verificar presença.",
            },
            { status: 500 },
        )
    }
}
