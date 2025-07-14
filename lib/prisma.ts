import { PrismaClient } from "@prisma/client"

// Adiciona o cliente Prisma ao objeto global para evitar múltiplas instâncias em desenvolvimento
// Isso é útil para o hot-reloading do Next.js
declare global {
  var prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prismaClient = global.prisma
}

export default prismaClient
