import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const seminarios = await prisma.seminario.findMany({
            select: {
                id: true,
                title: true,
                data_inicio: true,
                data_fim: true,
                estado: true,
                municipio: true,
                created_at: true,
            },
            orderBy: {
                data_inicio: "desc",
            },
        })
        return NextResponse.json(seminarios)
    } catch (error) {
        console.error("Erro ao buscar seminários:", error)
        return NextResponse.json({ error: "Erro ao buscar seminários" }, { status: 500 })
    }
}
