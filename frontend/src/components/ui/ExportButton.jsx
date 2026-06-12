import { useState, useRef, useEffect } from 'react';

export const ExportButton = ({ onExportExcel, onExportPDF, loading = false }) => {
    const [open, setOpen] = useState(false);
    const [exporting, setExporting] = useState('');
    const ref = useRef(null);

    // Close dropdown kalau klik di luar
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handle = async (type) => {
        setOpen(false);
        setExporting(type);
        try {
            if (type === 'excel') await onExportExcel();
            if (type === 'pdf') await onExportPDF();
        } finally {
            setExporting('');
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                disabled={!!exporting || loading}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
                {exporting ? (
                    <>
                        <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        Mengekspor...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[18px] leading-none">download</span>
                        Export
                        <span className="material-symbols-outlined text-[16px] text-slate-400 leading-none">expand_more</span>
                    </>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                        onClick={() => handle('excel')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px] leading-none">table_chart</span>
                        Export Excel (.xlsx)
                    </button>
                    <button
                        onClick={() => handle('pdf')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                    >
                        <span className="material-symbols-outlined text-[18px] leading-none">picture_as_pdf</span>
                        Export PDF (.pdf)
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportButton;