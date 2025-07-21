import React, { useEffect, useRef } from "react"
import QrScanner from "qr-scanner"

interface QrScannerCameraProps {
    onDecode: (result: string) => void
    onError?: (error: string) => void
    paused?: boolean
}

const QrScannerCamera: React.FC<QrScannerCameraProps> = ({ onDecode, onError, paused }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const scannerRef = useRef<QrScanner | null>(null)

    useEffect(() => {
        if (!videoRef.current) return

        const qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
                onDecode(result.data)
            },
            {
                onDecodeError: (err) => {
                    if (onError) onError((err && typeof err === "object" && "message" in err) ? (err as Error).message : String(err) || "Erro ao ler QR Code")
                },
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        )
        scannerRef.current = qrScanner
        qrScanner.start().catch((err) => {
            if (onError) onError(err?.message || "Não foi possível acessar a câmera")
        })

        return () => {
            qrScanner.stop()
            qrScanner.destroy()
        }
    }, [onDecode, onError])

    useEffect(() => {
        if (scannerRef.current) {
            if (paused) {
                scannerRef.current.stop()
            } else {
                scannerRef.current.start().catch(() => { })
            }
        }
    }, [paused])

    return (
        <div className="w-full flex flex-col items-center">
            <video
                ref={videoRef}
                style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
                muted
                playsInline
            />
        </div>
    )
}

export default QrScannerCamera 