import React, { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface Html5QrcodeScannerProps {
    onDecode: (result: string) => void
    onError?: (error: string) => void
    paused?: boolean
}

const Html5QrcodeScanner: React.FC<Html5QrcodeScannerProps> = ({ onDecode, onError, paused }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const divId = useRef(`html5qr-${Math.random().toString(36).substr(2, 9)}`)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (paused) {
            scannerRef.current?.pause(true)
            return
        }
        setLoading(true)
        if (!scannerRef.current) {
            const html5Qr = new Html5Qrcode(divId.current)
            scannerRef.current = html5Qr
            html5Qr.start(
                { facingMode: "environment" },
                {
                    fps: 5,
                    qrbox: { width: 220, height: 220 },
                },
                (decodedText) => {
                    setLoading(false)
                    onDecode(decodedText)
                },
                (errMsg) => {
                    setLoading(false)
                    if (
                        onError &&
                        errMsg &&
                        !errMsg.includes("No QR code found") &&
                        !errMsg.includes("No MultiFormat Readers were able to detect the code") &&
                        !errMsg.includes("No barcode or QR code detected")
                    ) {
                        onError(errMsg)
                    }
                }
            ).catch((err) => {
                setLoading(false)
                if (onError) onError(typeof err === "string" ? err : (err?.message || "Erro ao acessar a câmera"))
            })
        } else {
            scannerRef.current.resume()
            setLoading(false)
        }
        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop().then(() => {
                        scannerRef.current?.clear()
                    }).catch(() => { })
                } catch { }
                scannerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused])

    return (
        <div style={{ width: 280, margin: "0 auto" }}>
            {loading && (
                <div style={{ textAlign: "center", color: "#666", marginBottom: 8 }}>Aguardando câmera...</div>
            )}
            <div id={divId.current} />
        </div>
    )
}

export default Html5QrcodeScanner 