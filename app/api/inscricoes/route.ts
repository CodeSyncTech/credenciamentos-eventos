import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seminarioId = searchParams.get("seminarioId")

    if (!seminarioId) {
      return NextResponse.json({ message: "Por favor, forneça um seminarioId." }, { status: 400 })
    }

    const inscricoes = await prisma.inscricaoSeminario.findMany({
      where: {
        seminario_id: Number(seminarioId),
      },
      select: {
        id: true,
        codigo_uid: true,
        nome_completo: true,
        data_inscricao: true,
        divisao: true,
        confirmacao_presenca: true,
      },
      orderBy: {
        nome_completo: "asc",
      },
    })
    return NextResponse.json(inscricoes)
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error)
    return NextResponse.json({ error: "Erro ao buscar inscrições" }, { status: 500 })
  }
}
