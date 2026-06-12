import { useEffect, useRef, useState } from 'react';

/**
 * QRScanner — Scan QR Code member pakai kamera
 * Menggunakan jsQR library (lightweight, no external dependencies)
 */
export default function QRScanner({ onScan, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

    const [status, setStatus] = useState('starting'); // starting | scanning | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setStatus('scanning');
                requestAnimationFrame(scanFrame);
            }
        } catch (err) {
            setStatus('error');
            if (err.name === 'NotAllowedError') {
                setErrorMsg('Akses kamera ditolak. Izinkan akses kamera di browser.');
            } else if (err.name === 'NotFoundError') {
                setErrorMsg('Kamera tidak ditemukan di perangkat ini.');
            } else {
                setErrorMsg(`Tidak bisa membuka kamera: ${err.message}`);
            }
        }
    };

    const stopCamera = () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
        }
    };

    const scanFrame = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const jsQR = (await import('jsqr')).default;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code?.data) {
                // Validasi format MBR-XXXXXX
                if (code.data.startsWith('MBR-')) {
                    stopCamera();
                    onScan(code.data);
                    return;
                }
            }
        } catch (_) { }

        animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Scan Kartu Member</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Arahkan kamera ke QR Code kartu member</p>
                    </div>
                    <button
                        onClick={() => { stopCamera(); onClose(); }}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg leading-none transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Camera view */}
                <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
                    {status === 'starting' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm">Membuka kamera...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                            <span className="text-4xl">📷</span>
                            <p className="text-white text-sm font-medium">Kamera tidak tersedia</p>
                            <p className="text-slate-400 text-xs">{errorMsg}</p>
                        </div>
                    )}

                    {/* Video feed */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                        style={{ display: status === 'scanning' ? 'block' : 'none' }}
                    />

                    {/* Scanning overlay */}
                    {status === 'scanning' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Corner brackets */}
                            <div className="relative w-48 h-48">
                                {/* TL */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-blue-400 rounded-tl-lg" style={{ borderTopWidth: 3, borderLeftWidth: 3 }} />
                                {/* TR */}
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-blue-400 rounded-tr-lg" style={{ borderTopWidth: 3, borderRightWidth: 3 }} />
                                {/* BL */}
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-blue-400 rounded-bl-lg" style={{ borderBottomWidth: 3, borderLeftWidth: 3 }} />
                                {/* BR */}
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-blue-400 rounded-br-lg" style={{ borderBottomWidth: 3, borderRightWidth: 3 }} />
                                {/* Scan line animation */}
                                <div className="absolute left-2 right-2 h-0.5 bg-blue-400/80 animate-scan-line" style={{
                                    animation: 'scanLine 2s ease-in-out infinite',
                                    top: '50%',
                                    boxShadow: '0 0 6px rgba(59,130,246,0.8)',
                                }} />
                            </div>
                        </div>
                    )}

                    {/* Hidden canvas for processing */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 text-center">
                    {status === 'scanning' ? (
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse inline-block" />
                            Mendeteksi QR Code...
                        </p>
                    ) : status === 'error' ? (
                        <button
                            onClick={() => { setStatus('starting'); startCamera(); }}
                            className="btn-primary text-xs"
                        >
                            Coba Lagi
                        </button>
                    ) : (
                        <p className="text-xs text-slate-400">Memulai kamera...</p>
                    )}
                </div>
            </div>

            {/* Scan line animation style */}
            <style>{`
        @keyframes scanLine {
          0%, 100% { top: 15%; opacity: 1; }
          50% { top: 85%; opacity: 0.7; }
        }
      `}</style>
        </div>
    );
}