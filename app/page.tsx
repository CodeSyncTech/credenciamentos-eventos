"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircleIcon,
  XCircleIcon,
  Loader2,
  QrCodeIcon,
  UserIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
} from "lucide-react"
import Image from "next/image"
import { ArrowRightIcon, BuildingIcon, TreesIcon, DropletIcon } from "lucide-react"
import QrScannerCamera from "@/components/QrScannerCamera"

// Definição dos projetos disponíveis
const projetos = [
  {
    id: "proades",
    nome: "PROADES",
    descricao: "Programa de Ação Contra a Desertificação, Efeitos da Seca e Revisão dos Planos Estaduais.",
    cor: "from-[#878937] to-[#6b6d2a]",
    corHover: "from-[#6b6d2a] to-[#4f5120]",
    icon: BuildingIcon,
    ativo: true,
  },
  {
    id: "raizes",
    nome: "Raízes\u00a0da\u00a0Esperança",
    descricao: "Projeto de Desenvolvimento Rural e Social.",
    cor: "from-green-600 to-green-800",
    corHover: "from-green-700 to-green-900",
    icon: TreesIcon,
    ativo: false,
  },
  {
    id: "proagua",
    nome: "PROÁGUA",
    descricao: "Projeto de ações de apoio à gestão em saneamento em comunidades rurais no Semiárido.",
    cor: "from-cyan-600 to-cyan-800",
    corHover: "from-cyan-700 to-cyan-900",
    icon: DropletIcon,
    ativo: false,
  },
]

// Definição de tipo para a inscrição
interface Inscricao {
  id: number
  codigo_uid: string | null
  data_inscricao: string | null
  nome_completo: string
  divisao: string
  confirmacao_presenca: boolean
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

export default function HomePage() {
  const [projetoSelecionado, setProjetoSelecionado] = useState<string | null>(null)

  // Se um projeto foi selecionado, mostrar a tela de credenciamento
  if (projetoSelecionado) {
    return <CredenciamentoPage projeto={projetoSelecionado} onVoltar={() => setProjetoSelecionado(null)} />
  }

  // Tela de seleção de projetos
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-2 md:px-4 py-12 flex-1 flex flex-col">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <Image
                src="/images/codesync-logo.png"
                alt="CODE SYNC"
                width={180}
                height={72}
                className="mx-auto"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-display break-words max-w-full text-ellipsis">Sistema de Credenciamento</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-sans break-words max-w-full">Selecione o projeto para iniciar o processo de credenciamento dos participantes</p>
        </div>

        {/* Cards de Seleção de Projetos */}
        <div className="max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projetos.map((projeto) => {
              const IconComponent = projeto.icon
              return (
                <Card
                  key={projeto.id}
                  className={`group transform transition-all duration-300 border-0 overflow-hidden ${projeto.ativo ? "cursor-pointer hover:scale-105 hover:shadow-2xl" : "cursor-not-allowed opacity-60"
                    }`}
                  onClick={() => projeto.ativo && setProjetoSelecionado(projeto.id)}
                >
                  <CardHeader className={`bg-gradient-to-br ${projeto.cor} text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto">
                        {projeto.id === "proades" ? (
                          <Image
                            src="/images/logoproades.png"
                            alt="PROADES Logo"
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                        ) : projeto.id === "raizes" ? (
                          <Image
                            src="/images/raizesdaesperanca.png"
                            alt="Raízes da Esperança Logo"
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                        ) : projeto.id === "proagua" ? (
                          <Image
                            src="/images/proagua.png"
                            alt="Proagua Logo"
                            width={100}
                            height={100}
                            className="rounded-full"
                          />
                        ) : (
                          <IconComponent className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-center font-display break-words max-w-full whitespace-nowrap">{projeto.nome}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <p className="text-gray-600 text-center mb-6 leading-relaxed font-sans text-sm md:text-base break-words max-w-full">{projeto.descricao}</p>
                    {projeto.ativo ? (
                      <Button
                        className={`w-full bg-gradient-to-r ${projeto.id === "proades" ? "from-[#E0A533] to-[#c8942a]" : projeto.cor
                          } hover:bg-gradient-to-r ${projeto.id === "proades"
                            ? "hover:from-[#c8942a] hover:to-[#b08322]"
                            : `hover:${projeto.corHover}`
                          } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 group-hover:shadow-lg`}
                      >
                        Selecionar Projeto
                        <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    ) : (
                      <div className="text-center">
                        <div className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium">Esse projeto ainda não está recebendo credenciamento</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto border border-white/20">
            <p className="text-gray-600 mb-1 font-sans">
              <span className="font-semibold">Sistema desenvolvido por CODE SYNC</span>
            </p>
            <p className="text-sm text-gray-500 font-sans">codesynctech.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CredenciamentoPage({ projeto, onVoltar }: { projeto: string; onVoltar: () => void }) {
  const [seminarios, setSeminarios] = useState<Seminario[]>([])
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(null)

  // Estados para QR Code (método principal)
  const [codigoUidQr, setCodigoUidQr] = useState<string>("")
  const [qrResult, setQrResult] = useState<"confirmed" | "already_confirmed" | "not_found" | null>(null)
  const [qrMessage, setQrMessage] = useState<string | null>(null)
  const [isProcessingQr, setIsProcessingQr] = useState(false)
  const [scannerPaused, setScannerPaused] = useState(false)
  const [qrSuccess, setQrSuccess] = useState(false)

  // Estados para CPF (método alternativo)
  const [cpfInput, setCpfInput] = useState<string>("")
  const [cpfResult, setCpfResult] = useState<"found" | "confirmed" | "already_confirmed" | "not_found" | null>(null)
  const [cpfMessage, setCpfMessage] = useState<string | null>(null)
  const [isProcessingCpf, setIsProcessingCpf] = useState(false)
  const [showCpfConfirmation, setShowCpfConfirmation] = useState(false)
  const [foundInscricao, setFoundInscricao] = useState<any>(null)

  // Estados para lista de inscrições
  const [seminarInscricoes, setSeminarInscricoes] = useState<Inscricao[]>([])
  const [loadingSeminarInscricoes, setLoadingSeminarInscricoes] = useState(false)
  const [errorSeminarInscricoes, setErrorSeminarInscricoes] = useState<string | null>(null)

  const projetoAtual = projetos.find((p) => p.id === projeto)
  const IconComponent = projetoAtual?.icon || BuildingIcon

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

  // Efeito para buscar inscrições do seminário selecionado
  useEffect(() => {
    async function fetchSeminarInscricoes() {
      if (!selectedSeminarId) {
        setSeminarInscricoes([])
        return
      }

      setLoadingSeminarInscricoes(true)
      setErrorSeminarInscricoes(null)

      try {
        const response = await fetch(`/api/inscricoes?seminarioId=${selectedSeminarId}`)
        if (!response.ok) {
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
  }, [selectedSeminarId])

  // Função para confirmar presença via QR Code
  const handleConfirmarPresencaQr = async () => {
    setQrResult(null)
    setQrMessage(null)
    setIsProcessingQr(true)

    if (!selectedSeminarId) {
      setQrMessage("Por favor, selecione um seminário.")
      setQrResult("not_found")
      setIsProcessingQr(false)
      return
    }

    if (!codigoUidQr) {
      setQrMessage("Por favor, escaneie o QR Code.")
      setQrResult("not_found")
      setIsProcessingQr(false)
      return
    }

    try {
      const response = await fetch("/api/verificar-presenca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seminarioId: selectedSeminarId,
          codigoUid: codigoUidQr,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.alreadyConfirmed) {
          setQrResult("already_confirmed")
        } else {
          setQrResult("confirmed")
          // Atualiza a lista de inscrições
          setSeminarInscricoes((prev) =>
            prev.map((inscricao) =>
              inscricao.codigo_uid === codigoUidQr ? { ...inscricao, confirmacao_presenca: true } : inscricao,
            ),
          )
        }
        setQrMessage(data.message)
        setCodigoUidQr("")

        // Retorna o foco para o campo de QR Code
        setTimeout(() => {
          const qrCodeInput = document.getElementById("codigo-uid-qr")
          if (qrCodeInput) {
            qrCodeInput.focus()
          }
        }, 500)
      } else {
        setQrResult("not_found")
        setQrMessage(data.message || "QR Code não encontrado para este seminário.")
      }
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
      setQrResult("not_found")
      setQrMessage("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsProcessingQr(false)
    }
  }

  // Função para verificar inscrição por CPF
  const handleVerificarCpf = async () => {
    setCpfResult(null)
    setCpfMessage(null)
    setIsProcessingCpf(true)
    setShowCpfConfirmation(false)

    if (!selectedSeminarId) {
      setCpfMessage("Por favor, selecione um seminário.")
      setCpfResult("not_found")
      setIsProcessingCpf(false)
      return
    }

    if (!cpfInput) {
      setCpfMessage("Por favor, insira o CPF.")
      setCpfResult("not_found")
      setIsProcessingCpf(false)
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
        }),
      })

      const data = await response.json()

      if (response.ok && data.found) {
        setCpfResult("found")
        setCpfMessage(`Inscrição encontrada: ${data.message}`)
        setShowCpfConfirmation(true)
        setFoundInscricao(data)
      } else {
        setCpfResult("not_found")
        setCpfMessage(data.message || "CPF não encontrado para este seminário.")
      }
    } catch (error) {
      console.error("Erro ao verificar CPF:", error)
      setCpfResult("not_found")
      setCpfMessage("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsProcessingCpf(false)
    }
  }

  // Função para confirmar presença por CPF
  const handleConfirmarPresencaCpf = async () => {
    setIsProcessingCpf(true)

    try {
      // Buscar o código UID pelo CPF primeiro
      const inscricao = seminarInscricoes.find((i) => i.codigo_uid && cpfInput)

      if (!inscricao?.codigo_uid) {
        setCpfMessage("Não foi possível encontrar o código UID para este CPF.")
        setCpfResult("not_found")
        setIsProcessingCpf(false)
        return
      }

      const response = await fetch("/api/verificar-presenca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seminarioId: selectedSeminarId,
          codigoUid: inscricao.codigo_uid,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.alreadyConfirmed) {
          setCpfResult("already_confirmed")
        } else {
          setCpfResult("confirmed")
          // Atualiza a lista de inscrições
          setSeminarInscricoes((prev) =>
            prev.map((insc) =>
              insc.codigo_uid === inscricao.codigo_uid ? { ...insc, confirmacao_presenca: true } : insc,
            ),
          )
        }
        setCpfMessage(data.message)
        setCpfInput("")
        setShowCpfConfirmation(false)
      } else {
        setCpfResult("not_found")
        setCpfMessage(data.message || "Erro ao confirmar presença.")
      }
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
      setCpfResult("not_found")
      setCpfMessage("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsProcessingCpf(false)
    }
  }

  // Manter foco no campo QR Code
  useEffect(() => {
    if (!isProcessingQr && selectedSeminarId) {
      const qrCodeInput = document.getElementById("codigo-uid-qr")
      if (qrCodeInput && document.activeElement !== qrCodeInput) {
        qrCodeInput.focus()
      }
    }
  }, [isProcessingQr, selectedSeminarId, qrResult])

  // Calcular estatísticas
  const totalInscritos = seminarInscricoes.length
  const presencasConfirmadas = seminarInscricoes.filter((i) => i.confirmacao_presenca).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header com Logo e Projeto */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onVoltar}
            variant="outline"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar aos Projetos
          </Button>

          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-r ${projetoAtual?.cor} text-white px-6 py-3 rounded-lg shadow-lg`}>
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                <span className="font-semibold font-display">{projetoAtual?.nome}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Credencie aqui seus inscritos</h1>
          <p className="text-gray-600 font-sans">Confirme a presença dos participantes de forma rápida e eficiente</p>
        </div>

        {/* Seleção do Seminário */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl font-bold">Selecionar Seminário</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select onValueChange={setSelectedSeminarId} value={selectedSeminarId || ""}>
              <SelectTrigger className="w-full min-h-12 text-base md:text-lg whitespace-normal break-words max-w-full">
                <SelectValue placeholder="Escolha um seminário para iniciar o credenciamento">
                  {(selectedSeminarId && seminarios.length > 0) ? (
                    <div className="w-full text-center break-words whitespace-normal max-w-full">
                      {seminarios.find(s => s.id.toString() === selectedSeminarId)?.title}
                    </div>
                  ) : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {seminarios.map((seminario) => (
                  <SelectItem key={seminario.id} value={seminario.id.toString()} className="max-w-full">
                    <div className="flex flex-col max-w-full">
                      <span className="font-semibold text-base md:text-lg break-words max-w-full text-ellipsis">{seminario.title}</span>
                      <span className="text-xs md:text-sm text-gray-500 break-words max-w-full text-ellipsis">
                        {seminario.estado} - {seminario.municipio} • {seminario.data_inicio ? new Date(seminario.data_inicio).toLocaleDateString() : "Sem data"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedSeminarId && (
          <>
            {/* Métodos de Credenciamento */}
            <Card className="mb-8 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl md:text-2xl font-bold">Credenciamento</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="qrcode" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="qrcode" className="flex items-center gap-2 text-lg py-3">
                      <QrCodeIcon className="h-5 w-5" />
                      QR Code (Principal)
                    </TabsTrigger>
                    <TabsTrigger value="cpf" className="flex items-center gap-2 text-lg py-3">
                      <UserIcon className="h-5 w-5" />
                      CPF (Alternativo)
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab QR Code */}
                  <TabsContent value="qrcode" className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCodeIcon className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Método Principal - QR Code</h3>
                      </div>
                      <p className="text-green-700 text-sm">
                        Escaneie o QR Code do comprovante de inscrição para confirmação automática da presença.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Leitor de QR Code pela Câmera</label>
                      <QrScannerCamera
                        onDecode={(qrValue) => {
                          if (!scannerPaused && qrValue && selectedSeminarId && !isProcessingQr) {
                            setScannerPaused(true)
                            setQrSuccess(true)
                            setCodigoUidQr(qrValue)
                            setTimeout(() => {
                              handleConfirmarPresencaQr()
                              // Pausa de 4 segundos após leitura válida
                              setTimeout(() => {
                                setScannerPaused(false)
                                setQrSuccess(false)
                              }, 4000)
                            }, 100)
                          }
                        }}
                        onError={(err) => {
                          // Só mostra erro se não for 'No QR code found'
                          if (err && !err.includes('No QR code found')) {
                            setQrMessage(err)
                            setQrResult("not_found")
                          }
                        }}
                        paused={scannerPaused || isProcessingQr}
                      />

                      {qrSuccess && (
                        <div className="text-green-700 font-bold my-4">
                          QR Code lido com sucesso! Aguarde um instante para ler outro.
                        </div>
                      )}

                      <Button
                        onClick={handleConfirmarPresencaQr}
                        className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                        disabled={isProcessingQr || !codigoUidQr || !selectedSeminarId}
                      >
                        {isProcessingQr ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="mr-2 h-5 w-5" />
                            Confirmar Presença
                          </>
                        )}
                      </Button>

                      {qrResult && (
                        <div
                          className={`flex items-center justify-center p-4 rounded-lg text-lg font-semibold ${qrResult === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : qrResult === "already_confirmed"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                        >
                          {qrResult === "confirmed" || qrResult === "already_confirmed" ? (
                            <CheckCircleIcon className="h-6 w-6 mr-2" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 mr-2" />
                          )}
                          {qrMessage}
                        </div>
                      )}
                  </TabsContent>

                  {/* Tab CPF */}
                  <TabsContent value="cpf" className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircleIcon className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800">Método Alternativo - CPF</h3>
                      </div>
                      <p className="text-amber-700 text-sm">
                        Use apenas quando o participante não trouxer o QR Code. Primeiro verifique a inscrição, depois
                        confirme a presença.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="cpf-input" className="block text-sm md:text-base font-medium text-gray-700 mb-2">CPF do Participante</label>
                      <Input
                        id="cpf-input"
                        placeholder="Digite o CPF (apenas números)"
                        value={cpfInput}
                        onChange={(e) => {
                          setCpfInput(e.target.value)
                          setCpfResult(null)
                          setCpfMessage(null)
                          setShowCpfConfirmation(false)
                        }}
                        disabled={isProcessingCpf}
                        className="h-12 text-base md:text-lg max-w-full"
                      />
                    </div>

                    <Button
                      onClick={handleVerificarCpf}
                      className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700"
                      disabled={isProcessingCpf || !cpfInput || !selectedSeminarId}
                    >
                      {isProcessingCpf ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...
                        </>
                      ) : (
                        <>
                          <UserIcon className="mr-2 h-5 w-5" />
                          Verificar Inscrição
                        </>
                      )}
                    </Button>

                    {cpfResult && (
                      <div
                        className={`flex items-center justify-center p-4 rounded-lg text-lg font-semibold ${cpfResult === "found"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : cpfResult === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : cpfResult === "already_confirmed"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                      >
                        {cpfResult === "found" || cpfResult === "confirmed" || cpfResult === "already_confirmed" ? (
                          <CheckCircleIcon className="h-6 w-6 mr-2" />
                        ) : (
                          <XCircleIcon className="h-6 w-6 mr-2" />
                        )}
                        {cpfMessage}
                      </div>
                    )}

                    {showCpfConfirmation && (
                      <Button
                        onClick={handleConfirmarPresencaCpf}
                        className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                        disabled={isProcessingCpf}
                      >
                        {isProcessingCpf ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirmando...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="mr-2 h-5 w-5" />
                            Confirmar Presença
                          </>
                        )}
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Lista de Inscrições */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold">
                  Lista de Participantes{" "}
                  {!loadingSeminarInscricoes && !errorSeminarInscricoes && (
                    <span className="text-purple-100 font-normal">
                      ({totalInscritos} inscritos • {presencasConfirmadas} presentes)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingSeminarInscricoes ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p>Carregando participantes...</p>
                  </div>
                ) : errorSeminarInscricoes ? (
                  <div className="flex items-center justify-center h-40 text-red-500">
                    <XCircleIcon className="h-8 w-8 mr-2" />
                    <p>Erro ao carregar participantes: {errorSeminarInscricoes}</p>
                  </div>
                ) : seminarInscricoes.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-gray-500">
                    <AlertCircleIcon className="h-8 w-8 mr-2" />
                    <p>Nenhum participante encontrado para este seminário.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-xs md:text-sm break-words max-w-[120px]">Nome Completo</TableHead>
                          <TableHead className="font-semibold text-xs md:text-sm break-words max-w-[80px]">Divisão</TableHead>
                          <TableHead className="font-semibold text-xs md:text-sm break-words max-w-[80px]">Data Inscrição</TableHead>
                          <TableHead className="font-semibold text-xs md:text-sm text-center break-words max-w-[80px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {seminarInscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-xs md:text-sm break-words max-w-[120px]">{inscricao.nome_completo}</TableCell>
                            <TableCell className="text-xs md:text-sm break-words max-w-[80px]">{inscricao.divisao}</TableCell>
                            <TableCell className="text-xs md:text-sm break-words max-w-[80px]">
                              {inscricao.data_inscricao ? new Date(inscricao.data_inscricao).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="text-center text-xs md:text-sm">
                              <Badge
                                variant={inscricao.confirmacao_presenca ? "default" : "secondary"}
                                className={`${inscricao.confirmacao_presenca ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"} text-white font-semibold px-3 py-1 text-xs md:text-sm`}
                              >
                                {inscricao.confirmacao_presenca ? "✓ Presente" : "○ Ausente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
