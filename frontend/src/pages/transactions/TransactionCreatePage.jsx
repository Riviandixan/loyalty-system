import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionApi, memberApi } from '../../services';
import { Alert, MaterialIcon } from '../../components/ui';
import QRScanner from '../members/QRScanner';

const formatRupiah = (v) => {
    if (!v) return 'Rp 0';
    return `Rp ${Number(v).toLocaleString('id-ID')}`;
};

// Hitung poin sesuai business rule: floor(totalAmount / 10000)
const calculatePoints = (amount) => {
    const num = parseInt(String(amount).replace(/\D/g, ''), 10);
    if (!num || num < 10000) return 0;
    return Math.floor(num / 10000);
};

// Format input angka dengan titik ribuan
const formatNumber = (val) => {
    const num = String(val).replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function TransactionCreatePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [error, setError] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [amountDisplay, setAmountDisplay] = useState('');
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);

    // Handle QR scan result — cari member by code
    const handleQRScan = async (memberCode) => {
        setShowQRScanner(false);
        setMemberSearch(memberCode);
        try {
            const res = await memberApi.list({ search: memberCode, limit: 1 });
            const found = res.data.data?.[0];
            if (found) {
                handleSelectMember(found);
            } else {
                setError(`Member dengan kode "${memberCode}" tidak ditemukan`);
            }
        } catch {
            setError('Gagal mencari member dari QR Code');
        }
    };

    const rawAmount = parseInt(amountDisplay.replace(/\./g, ''), 10) || 0;
    const earnedPoints = calculatePoints(rawAmount);

    // Search member (debounce ringan)
    const { data: memberResults, isFetching: searchingMember } = useQuery({
        queryKey: ['member-search', memberSearch],
        queryFn: () =>
            memberApi.list({ search: memberSearch, limit: 6, status: 'ACTIVE' }).then((r) => r.data.data),
        enabled: memberSearch.length >= 2 && !selectedMember,
        staleTime: 10000,
    });

    const mutation = useMutation({
        mutationFn: (data) => transactionApi.create(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['dashboard']);
            queryClient.invalidateQueries(['member', String(selectedMember?.id)]);
            navigate('/transactions', {
                state: { successTrx: res.data.data.transactionNumber },
            });
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Gagal membuat transaksi');
        },
    });

    const handleSelectMember = (member) => {
        setSelectedMember(member);
        setMemberSearch(member.fullName);
        setShowMemberDropdown(false);
    };

    const handleClearMember = () => {
        setSelectedMember(null);
        setMemberSearch('');
    };

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/\./g, '');
        if (!/^\d*$/.test(raw)) return;
        setAmountDisplay(formatNumber(raw));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!selectedMember) {
            setError('Pilih member terlebih dahulu');
            return;
        }
        if (!rawAmount || rawAmount < 1000) {
            setError('Total belanja minimal Rp 1.000');
            return;
        }

        mutation.mutate({
            memberId: selectedMember.id,
            totalAmount: rawAmount,
        });
    };

    return (
        <div className="p-6">
            {/* QR Scanner Modal */}
            {showQRScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onClose={() => setShowQRScanner(false)}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/transactions" className="text-slate-400 hover:text-slate-600 text-sm">
                    ← Kembali
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-lg font-semibold text-slate-900">Buat Transaksi</h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Form */}
                <div className="card p-6">
                    <Alert type="error" message={error} />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Member Search */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-slate-700">
                                    Member <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowQRScanner(true)}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <span>📷</span> Scan QR
                                </button>
                            </div>

                            {selectedMember ? (                // Selected member card
                                <div className="flex items-center gap-3 border border-teal-200 bg-teal-50 rounded-lg px-4 py-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-semibold flex-shrink-0">
                                        {selectedMember.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800">{selectedMember.fullName}</p>
                                        <p className="text-xs text-slate-500">
                                            {selectedMember.memberCode} &middot; Saldo{' '}
                                            <span className="font-medium text-teal-700">
                                                {selectedMember.pointBalance.toLocaleString('id-ID')} pts
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClearMember}
                                        className="text-slate-400 hover:text-slate-600 text-lg leading-none flex-shrink-0"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                // Search input
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={memberSearch}
                                        onChange={(e) => {
                                            setMemberSearch(e.target.value);
                                            setShowMemberDropdown(true);
                                        }}
                                        onFocus={() => setShowMemberDropdown(true)}
                                        className="input-field pr-8"
                                        placeholder="Ketik nama, email, atau kode member..."
                                        autoComplete="off"
                                    />
                                    {searchingMember && (
                                        <span className="absolute right-3 top-2.5 text-xs text-slate-400">...</span>
                                    )}

                                    {/* Dropdown hasil search */}
                                    {showMemberDropdown && memberSearch.length >= 2 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                                            {!memberResults?.length ? (
                                                <div className="px-4 py-3 text-sm text-slate-400">
                                                    {searchingMember ? 'Mencari...' : 'Member tidak ditemukan'}
                                                </div>
                                            ) : (
                                                memberResults.map((m) => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => handleSelectMember(m)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                                                    >
                                                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-semibold flex-shrink-0">
                                                            {m.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">{m.fullName}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {m.memberCode} &middot; {m.pointBalance.toLocaleString('id-ID')} pts
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-[11px] text-slate-400 mt-1">
                                Ketik minimal 2 karakter untuk mencari member aktif
                            </p>
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Total Belanja <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    value={amountDisplay}
                                    onChange={handleAmountChange}
                                    className="input-field pl-9 text-right font-mono text-base"
                                    placeholder="0"
                                    inputMode="numeric"
                                />
                            </div>

                            {/* Quick amount buttons */}
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {[50000, 100000, 150000, 200000, 500000].map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setAmountDisplay(formatNumber(String(v)))}
                                        className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        {formatRupiah(v)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Point Preview */}
                        <div className={`rounded-xl border-2 p-4 transition-all ${earnedPoints > 0
                            ? 'border-amber-200 bg-amber-50'
                            : 'border-slate-100 bg-slate-50'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">Poin yang akan diperoleh</p>
                                    <p className={`text-2xl font-bold ${earnedPoints > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                                        {earnedPoints > 0 ? `+${earnedPoints.toLocaleString('id-ID')}` : '0'} pts
                                    </p>
                                </div>
                                <MaterialIcon name={earnedPoints > 0 ? 'star' : 'paid'} className="w-8 h-8 text-tertiary" fill={1} />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2">
                                Rumus: setiap Rp 10.000 = 1 poin &nbsp;·&nbsp;
                                {rawAmount > 0
                                    ? `${formatRupiah(rawAmount)} ÷ Rp 10.000 = ${earnedPoints} poin`
                                    : 'Masukkan nominal untuk preview poin'}
                            </p>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={mutation.isPending || !selectedMember || rawAmount < 1000}
                                className="btn-primary"
                            >
                                {mutation.isPending ? 'Memproses...' : 'Buat Transaksi'}
                            </button>
                            <Link to="/transactions" className="btn-secondary">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Info box */}
                <div className="card p-4 bg-blue-50 border-blue-100">
                    <p className="text-xs font-medium text-blue-700 mb-2 inline-flex items-center gap-1.5">
                        <MaterialIcon name="description" className="w-4 h-4" />
                        Informasi Transaksi
                    </p>
                    <ul className="space-y-1 text-xs text-blue-600">
                        <li>• Nomor transaksi akan di-generate otomatis</li>
                        <li>• Poin langsung masuk ke saldo member</li>
                        <li>• Transaksi tidak dapat dibatalkan setelah dibuat</li>
                        <li>• Hanya member dengan status <strong>Aktif</strong> yang dapat bertransaksi</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}