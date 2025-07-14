"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, XCircleIcon, Loader2 } from "lucide-react"

// Definição de tipo para a inscrição (ajustada para refletir os campos que serão usados)
interface Inscricao {
  id: number
  codigo_uid: string | null
  data_inscricao: string | null
  nome_completo: string
  divisao: string
  // Outros campos não serão mais usados diretamente na tabela, mas podem existir no objeto completo
  // seminario_id: number | null;
  // cpf: string;
  // email: string;
  // whatsapp: string | null;
  // data_nascimento: string | null;
  // genero: string | null;
  // codigo_consulta: string | null;
  // servidor_tipo: string | null;
  // servidor_outros_texto: string | null;
}

// Definição de tipo para o seminário
interface Seminario {
  id: number
  title: string
  data_inicio: string | null
  data_fim: string | null
  estado: string
  municipio: string
  created_at: string
}

export default function CredenciamentoPage() {
  const [seminarios, setSeminarios] = useState<Seminario[]>([])
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(null)
  const [cpfInput, setCpfInput] = useState<string>("")
  const [codigoUidInput, setCodigoUidInput] = useState<string>("")
  const [checkResult, setCheckResult] = useState<"found" | "not_found" | null>(null)
  const [checkMessage, setCheckMessage] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  // Este estado agora conterá APENAS as inscrições do seminário selecionado
  const [seminarInscricoes, setSeminarInscricoes] = useState<Inscricao[]>([])
  const [loadingSeminarInscricoes, setLoadingSeminarInscricoes] = useState(false)
  const [errorSeminarInscricoes, setErrorSeminarInscricoes] = useState<string | null>(null)

  // Efeito para buscar seminários
  useEffect(() => {
    async function fetchSeminarios() {
      try {
        const response = await fetch("/api/seminarios")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSeminarios(data)
      } catch (e: any) {
        console.error("Erro ao buscar seminários:", e)
      }
    }
    fetchSeminarios()
  }, [])

  // Efeito para buscar inscrições do seminário selecionado (agora com parâmetro)
  useEffect(() => {
    async function fetchSeminarInscricoes() {
      if (!selectedSeminarId) {
        setSeminarInscricoes([]) // Limpa a lista se nenhum seminário estiver selecionado
        return
      }

      setLoadingSeminarInscricoes(true)
      setErrorSeminarInscricoes(null) // Limpa erros anteriores
      try {
        // Faz a requisição para a API com o seminarioId como parâmetro de query
        const response = await fetch(`/api/inscricoes?seminarioId=${selectedSeminarId}`)
        if (!response.ok) {
          // Se a resposta não for OK, tenta ler a mensagem de erro do backend
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSeminarInscricoes(data)
      } catch (e: any) {
        console.error("Erro ao buscar inscrições do seminário:", e)
        setErrorSeminarInscricoes(e.message || "Erro ao carregar inscrições do seminário.")
      } finally {
        setLoadingSeminarInscricoes(false)
      }
    }
    fetchSeminarInscricoes()
  }, [selectedSeminarId]) // Este efeito é re-executado APENAS quando selectedSeminarId muda

  const handleCheckInscricao = async () => {
    setCheckResult(null)
    setCheckMessage(null)
    setIsChecking(true)

    if (!selectedSeminarId) {
      setCheckMessage("Por favor, selecione um seminário.")
      setCheckResult("not_found")
      setIsChecking(false)
      return
    }

    if (!cpfInput && !codigoUidInput) {
      setCheckMessage("Por favor, insira um CPF ou Código UID.")
      setCheckResult("not_found")
      setIsChecking(false)
      return
    }

    try {
      const response = await fetch("/api/check-inscricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seminarioId: selectedSeminarId,
          cpf: cpfInput,
          codigoUid: codigoUidInput,
        }),
      })

      const data = await response.json()

      if (response.ok && data.found) {
        setCheckResult("found")
        setCheckMessage(data.message) // A API agora retorna a mensagem formatada
      } else {
        setCheckResult("not_found")
        setCheckMessage(data.message || "Inscrição não encontrada para este seminário com os dados fornecidos.")
      }
    } catch (error) {
      console.error("Erro ao verificar inscrição:", error)
      setCheckResult("not_found")
      setCheckMessage("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Verificação de Credenciamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="seminario-select" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Seminário
            </label>
            <Select onValueChange={setSelectedSeminarId} value={selectedSeminarId || ""}>
              <SelectTrigger id="seminario-select" className="w-full">
                <SelectValue placeholder="Escolha um seminário" />
              </SelectTrigger>
              <SelectContent>
                {seminarios.map((seminario) => (
                  <SelectItem key={seminario.id} value={seminario.id.toString()}>
                    {seminario.estado} - {seminario.municipio} (
                    {seminario.data_inicio ? new Date(seminario.data_inicio).toLocaleDateString() : "Sem data"}) -{" "}
                    {seminario.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf-input" className="block text-sm font-medium text-gray-700 mb-2">
                CPF do Inscrito
              </label>
              <Input
                id="cpf-input"
                placeholder="Digite o CPF"
                value={cpfInput}
                onChange={(e) => {
                  setCpfInput(e.target.value)
                  setCodigoUidInput("") // Limpa o outro campo
                  setCheckResult(null)
                  setCheckMessage(null)
                }}
                disabled={isChecking}
              />
            </div>
            <div>
              <label htmlFor="codigo-uid-input" className="block text-sm font-medium text-gray-700 mb-2">
                Código UID do Inscrito
              </label>
              <Input
                id="codigo-uid-input"
                placeholder="Digite o Código UID"
                value={codigoUidInput}
                onChange={(e) => {
                  setCodigoUidInput(e.target.value)
                  setCpfInput("") // Limpa o outro campo
                  setCheckResult(null)
                  setCheckMessage(null)
                }}
                disabled={isChecking}
              />
            </div>
          </div>

          <Button
            onClick={handleCheckInscricao}
            className="w-full"
            disabled={isChecking || (!cpfInput && !codigoUidInput) || !selectedSeminarId}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
              </>
            ) : (
              "Verificar Inscrição"
            )}
          </Button>

          {checkResult && (
            <div
              className={`flex items-center justify-center p-4 rounded-md text-lg font-semibold ${
                checkResult === "found" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {checkResult === "found" ? (
                <CheckCircleIcon className="h-6 w-6 mr-2" />
              ) : (
                <XCircleIcon className="h-6 w-6 mr-2" />
              )}
              {checkMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Inscrições do Seminário Selecionado (sempre visível) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Inscrições do Seminário Selecionado{" "}
            {selectedSeminarId && !loadingSeminarInscricoes && !errorSeminarInscricoes && (
              <span className="text-base text-gray-500">({seminarInscricoes.length} inscritos)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedSeminarId ? (
            <p className="mb-4 text-muted-foreground text-center py-4">
              Por favor, selecione um seminário para ver as inscrições.
            </p>
          ) : loadingSeminarInscricoes ? (
            <div className="flex items-center justify-center h-40">
              <p>Carregando inscrições...</p>
            </div>
          ) : errorSeminarInscricoes ? (
            <div className="flex items-center justify-center h-40 text-red-500">
              <p>Erro ao carregar inscrições: {errorSeminarInscricoes}</p>
            </div>
          ) : seminarInscricoes.length === 0 ? (
            <p className="mb-4 text-muted-foreground text-center py-4">
              Nenhuma inscrição encontrada para este seminário.
            </p>
          ) : (
            <ScrollArea className="h-[600px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código UID</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Data Inscrição</TableHead>
                    <TableHead>Divisão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seminarInscricoes.map((inscricao) => (
                    <TableRow key={inscricao.id}>
                      <TableCell className="font-medium">{inscricao.codigo_uid}</TableCell>
                      <TableCell>{inscricao.nome_completo}</TableCell>
                      <TableCell>
                        {inscricao.data_inscricao ? new Date(inscricao.data_inscricao).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell>{inscricao.divisao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
