import { useEffect, useRef, useState } from 'react';
import { getTierInfo } from '../../utils/tier';

/**
 * MemberCard — Kartu Member Digital dengan QR Code
 * QR berisi: memberCode (yang di-scan kasir untuk cari member)
 */
export default function MemberCard({ member, showActions = true }) {
    const qrCanvasRef = useRef(null);
    const cardRef = useRef(null);
    const [qrReady, setQrReady] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const tierInfo = getTierInfo(member?.tier || 'BRONZE');

    // Generate QR Code ke canvas
    useEffect(() => {
        if (!member?.memberCode) return;

        const generateQR = async () => {
            try {
                const QRCode = await import('qrcode');
                if (qrCanvasRef.current) {
                    await QRCode.toCanvas(qrCanvasRef.current, member.memberCode, {
                        width: 100,
                        margin: 1,
                        color: {
                            dark: '#0F172A',
                            light: '#FFFFFF',
                        },
                    });
                    setQrReady(true);
                }
            } catch (err) {
                console.error('QR generation error:', err);
            }
        };

        generateQR();
    }, [member?.memberCode]);

    // Download kartu sebagai PNG
    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `kartu-member-${member.memberCode}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Download error:', err);
            alert('Gagal download kartu. Coba screenshot manual.');
        } finally {
            setDownloading(false);
        }
    };

    // Print kartu
    const handlePrint = () => {
        const printContent = cardRef.current?.outerHTML;
        if (!printContent) return;
        const win = window.open('', '_blank');
        win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kartu Member — ${member.memberCode}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              display: flex; align-items: center; justify-content: center; 
              min-height: 100vh; font-family: 'Inter', sans-serif;
              background: #f8fafc;
            }
            @media print {
              body { background: white; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
        win.document.close();
    };

    if (!member) return null;

    const initials = member.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'MB';

    return (
        <div>
            {/* KARTU */}
            <div
                ref={cardRef}
                style={{
                    width: 340,
                    background: `linear-gradient(135deg, #1e3a5f 0%, #2563EB 60%, #1D4ED8 100%)`,
                    borderRadius: 16,
                    padding: 24,
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(37,99,235,0.3)',
                }}
            >
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 140, height: 140, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -30, left: -30,
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                }} />

                {/* TOP ROW — Logo + Tier */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, background: 'rgba(255,255,255,0.2)',
                            borderRadius: 8, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 14, fontWeight: 700,
                        }}>
                            L
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>LoyaltyOS</div>
                            <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em' }}>MEMBERSHIP CARD</div>
                        </div>
                    </div>
                    {/* Tier badge */}
                    <div style={{
                        background: tierInfo.bg,
                        color: tierInfo.color,
                        border: `1px solid ${tierInfo.border}`,
                        borderRadius: 20, padding: '3px 10px',
                        fontSize: 11, fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        {tierInfo.emoji} {tierInfo.label}
                    </div>
                </div>

                {/* MEMBER INFO + QR */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                    {/* Left — member info */}
                    <div style={{ flex: 1 }}>
                        {/* Avatar + Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, fontWeight: 700, border: '2px solid rgba(255,255,255,0.3)',
                                flexShrink: 0,
                            }}>
                                {initials}
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{member.fullName}</div>
                                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{member.email}</div>
                            </div>
                        </div>

                        {/* Member Code */}
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.1em', marginBottom: 3 }}>MEMBER CODE</div>
                            <div style={{
                                fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
                                fontFamily: 'monospace',
                            }}>
                                {member.memberCode}
                            </div>
                        </div>

                        {/* Points */}
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div>
                                <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em', marginBottom: 2 }}>SALDO POIN</div>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>
                                    {member.pointBalance?.toLocaleString('id-ID') || 0}
                                    <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.7, marginLeft: 3 }}>pts</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.08em', marginBottom: 2 }}>LIFETIME</div>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>
                                    {member.totalPointsEarned?.toLocaleString('id-ID') || 0}
                                    <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.7, marginLeft: 3 }}>pts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — QR Code */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <div style={{
                            background: 'white', borderRadius: 10, padding: 6,
                            display: 'inline-block',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}>
                            <canvas
                                ref={qrCanvasRef}
                                style={{
                                    display: 'block',
                                    width: 88, height: 88,
                                    opacity: qrReady ? 1 : 0.2,
                                    transition: 'opacity 0.3s',
                                }}
                            />
                        </div>
                        <div style={{ fontSize: 9, opacity: 0.6, marginTop: 5, letterSpacing: '0.05em' }}>
                            SCAN TO FIND
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            {showActions && (
                <div className="flex items-center gap-2 mt-3">
                    <button
                        onClick={handleDownload}
                        disabled={downloading || !qrReady}
                        className="btn-secondary flex items-center gap-2 text-xs flex-1 justify-center"
                    >
                        {downloading ? (
                            <>
                                <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                                Mengunduh...
                            </>
                        ) : (
                            <> ⬇️ Download PNG </>
                        )}
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={!qrReady}
                        className="btn-secondary flex items-center gap-2 text-xs flex-1 justify-center"
                    >
                        🖨️ Print Kartu
                    </button>
                </div>
            )}

            {!qrReady && (
                <p className="text-[11px] text-slate-400 text-center mt-2">Membuat QR Code...</p>
            )}
        </div>
    );
}