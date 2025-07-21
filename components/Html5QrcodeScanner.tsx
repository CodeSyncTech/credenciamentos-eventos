import React, { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface Html5QrcodeScannerProps {
    onDecode: (result: string) => void
    onError?: (error: string) => void
    paused?: boolean
}

const Html5QrcodeScanner: React.FC<Html5QrcodeScannerProps> = ({ onDecode, onError, paused }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const divId = useRef(`html5qr-${Math.random().toString(36).substr(2, 9)}`)

    useEffect(() => {
        if (paused) {
            scannerRef.current?.pause(true)
            return
        }
        if (!scannerRef.current) {
            const html5Qr = new Html5Qrcode(divId.current)
            scannerRef.current = html5Qr
            html5Qr.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    onDecode(decodedText)
                },
                (errMsg) => {
                    if (onError && errMsg && !errMsg.includes("No QR code found")) {
                        onError(errMsg)
                    }
                }
            ).catch((err) => {
                if (onError) onError(typeof err === "string" ? err : (err?.message || "Erro ao acessar a câmera"))
            })
        } else {
            scannerRef.current.resume()
        }
        return () => {
            try { scannerRef.current?.stop() } catch { }
            try { scannerRef.current?.clear() } catch { }
            scannerRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused])

    return <div id={divId.current} style={{ width: 280, margin: "0 auto" }} />
}

export default Html5QrcodeScanner 