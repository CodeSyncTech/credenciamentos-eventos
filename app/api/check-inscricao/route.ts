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
            // Sanitiza o CPF para conter apenas números
            const cpfNumeros = cpf.replace(/\D/g, "")
            // Validação de CPF (estrutura e dígito verificador)
            function isValidCPF(cpf: string): boolean {
                if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
                let sum = 0, rest;
                for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
                rest = (sum * 10) % 11;
                if ((rest === 10) || (rest === 11)) rest = 0;
                if (rest !== parseInt(cpf.substring(9, 10))) return false;
                sum = 0;
                for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
                rest = (sum * 10) % 11;
                if ((rest === 10) || (rest === 11)) rest = 0;
                if (rest !== parseInt(cpf.substring(10, 11))) return false;
                return true;
            }
            if (!isValidCPF(cpfNumeros)) {
                return NextResponse.json({ error: "CPF inválido." }, { status: 400 })
            }
            whereClause.cpf = cpfNumeros
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
