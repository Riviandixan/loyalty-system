import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { redeemApi, rewardApi, memberApi } from '../../services';
import { Alert, MaterialIcon, Spinner } from '../../components/ui';
import QRScanner from '../members/QRScanner';

const rewardIcon = (name = '') => {
    if (name.includes('10.000')) return 'confirmation_number';
    if (name.includes('25.000')) return 'confirmation_number';
    if (name.includes('50.000')) return 'sell';
    return 'redeem';
};

export default function RedeemCreatePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [error, setError] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedReward, setSelectedReward] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showQRScanner, setShowQRScanner] = useState(false);

    const handleQRScan = async (memberCode) => {
        setShowQRScanner(false);
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

    // Fetch rewards catalog
    const { data: rewards, isLoading: loadingRewards } = useQuery({
        queryKey: ['rewards'],
        queryFn: () => rewardApi.list().then((r) => r.data.data),
    });

    // Search member
    const { data: memberResults, isFetching: searchingMember } = useQuery({
        queryKey: ['member-search-redeem', memberSearch],
        queryFn: () =>
            memberApi
                .list({ search: memberSearch, limit: 6, status: 'ACTIVE' })
                .then((r) => r.data.data),
        enabled: memberSearch.length >= 2 && !selectedMember,
        staleTime: 10000,
    });

    const mutation = useMutation({
        mutationFn: (data) => redeemApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['redeems']);
            queryClient.invalidateQueries(['dashboard']);
            queryClient.invalidateQueries(['member', String(selectedMember?.id)]);
            navigate('/redeems');
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Gagal melakukan redeem');
        },
    });



    const handleSelectMember = (member) => {
        setSelectedMember(member);
        setMemberSearch(member.fullName);
        setShowDropdown(false);
        setSelectedReward(null); // reset reward saat ganti member
        setError('');
    };

    const handleClearMember = () => {
        setSelectedMember(null);
        setMemberSearch('');
        setSelectedReward(null);
        setError('');
    };

    const handleSelectReward = (reward) => {
        setSelectedReward(reward);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!selectedMember) {
            setError('Pilih member terlebih dahulu');
            return;
        }
        if (!selectedReward) {
            setError('Pilih reward yang ingin ditukar');
            return;
        }
        if (selectedMember.pointBalance < selectedReward.requiredPoint) {
            setError(
                `Poin tidak cukup. Dibutuhkan ${selectedReward.requiredPoint.toLocaleString('id-ID')} pts, saldo member ${selectedMember.pointBalance.toLocaleString('id-ID')} pts`
            );
            return;
        }

        mutation.mutate({
            memberId: selectedMember.id,
            rewardId: selectedReward.id,
        });
    };

    const pointAfterRedeem =
        selectedMember && selectedReward
            ? selectedMember.pointBalance - selectedReward.requiredPoint
            : null;

    const isPointEnough =
        selectedMember && selectedReward
            ? selectedMember.pointBalance >= selectedReward.requiredPoint
            : true;

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
                <Link to="/redeems" className="text-slate-400 hover:text-slate-600 text-sm">
                    ← Kembali
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-lg font-semibold text-slate-900">Tukar Poin</h1>
            </div>

            <div className="space-y-4">
                {/* STEP 1 — Pilih Member */}
                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                        <h2 className="text-sm font-semibold text-slate-800">Pilih Member</h2>
                        <button
                            type="button"
                            onClick={() => setShowQRScanner(true)}
                            className="ml-auto flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <MaterialIcon name="qr_code_scanner" className="w-4 h-4" />
                            Scan QR
                        </button>
                    </div>

                    {selectedMember ? (
                        <div className="flex items-center gap-3 border border-teal-200 bg-teal-50 rounded-lg px-4 py-3">
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-semibold flex-shrink-0">
                                {selectedMember.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">{selectedMember.fullName}</p>
                                <p className="text-xs text-slate-500">
                                    {selectedMember.memberCode} &middot; Saldo poin:{' '}
                                    <span className="font-semibold text-teal-700">
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
                        <div className="relative">
                            <input
                                type="text"
                                value={memberSearch}
                                onChange={(e) => {
                                    setMemberSearch(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="input-field"
                                placeholder="Ketik nama, email, atau kode member..."
                                autoComplete="off"
                            />
                            {searchingMember && (
                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">...</span>
                            )}
                            {showDropdown && memberSearch.length >= 2 && (
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
                                                        {m.memberCode} &middot;{' '}
                                                        <span className={m.pointBalance >= 100 ? 'text-teal-600 font-medium' : 'text-slate-400'}>
                                                            {m.pointBalance.toLocaleString('id-ID')} pts
                                                        </span>
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* STEP 2 — Pilih Reward */}
                <div className={`card p-6 transition-opacity ${!selectedMember ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${selectedMember ? 'bg-blue-600' : 'bg-slate-300'}`}>2</span>
                        <h2 className="text-sm font-semibold text-slate-800">Pilih Reward</h2>
                        {selectedMember && (
                            <span className="ml-auto text-xs text-slate-400">
                                Saldo: <span className="font-semibold text-slate-700">{selectedMember.pointBalance.toLocaleString('id-ID')} pts</span>
                            </span>
                        )}
                    </div>

                    {loadingRewards ? (
                        <Spinner />
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {rewards?.map((reward) => {
                                const canRedeem = selectedMember
                                    ? selectedMember.pointBalance >= reward.requiredPoint
                                    : true;
                                const isSelected = selectedReward?.id === reward.id;

                                return (
                                    <button
                                        key={reward.id}
                                        type="button"
                                        onClick={() => canRedeem && handleSelectReward(reward)}
                                        disabled={!canRedeem}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : canRedeem
                                                    ? 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                                                    : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                      ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                            <MaterialIcon name={rewardIcon(reward.name)} className="w-5 h-5" fill={1} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                                                {reward.name}
                                            </p>
                                            {reward.description && (
                                                <p className="text-xs text-slate-400 mt-0.5">{reward.description}</p>
                                            )}
                                        </div>

                                        {/* Poin */}
                                        <div className="text-right flex-shrink-0">
                                            <p className={`text-sm font-bold ${isSelected ? 'text-blue-600' : canRedeem ? 'text-amber-600' : 'text-slate-400'}`}>
                                                {reward.requiredPoint.toLocaleString('id-ID')} pts
                                            </p>
                                            {selectedMember && (
                                                <p className={`text-[10px] mt-0.5 ${canRedeem ? 'text-teal-600' : 'text-red-400'}`}>
                                                    {canRedeem ? '✓ Cukup' : '✗ Kurang'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Radio indicator */}
                                        {isSelected && (
                                            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* STEP 3 — Konfirmasi */}
                {selectedMember && selectedReward && (
                    <div className={`card p-5 border-2 ${isPointEnough ? 'border-teal-200 bg-teal-50' : 'border-red-200 bg-red-50'}`}>
                        <h2 className="text-sm font-semibold text-slate-800 mb-3">
                            {isPointEnough ? 'Ringkasan Penukaran' : 'Poin Tidak Cukup'}
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Member</span>
                                <span className="font-medium text-slate-800">{selectedMember.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Reward</span>
                                <span className="font-medium text-slate-800">{selectedReward.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Saldo Poin</span>
                                <span className="font-medium text-slate-800">
                                    {selectedMember.pointBalance.toLocaleString('id-ID')} pts
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Poin Digunakan</span>
                                <span className="font-semibold text-red-500">
                                    -{selectedReward.requiredPoint.toLocaleString('id-ID')} pts
                                </span>
                            </div>
                            <div className="border-t border-slate-200 pt-2 flex justify-between">
                                <span className="text-slate-600 font-medium">Sisa Poin</span>
                                <span className={`font-bold text-base ${isPointEnough ? 'text-teal-700' : 'text-red-600'}`}>
                                    {pointAfterRedeem.toLocaleString('id-ID')} pts
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error & Submit */}
                <div className="card p-5">
                    <Alert type="error" message={error} />

                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={mutation.isPending || !selectedMember || !selectedReward || !isPointEnough}
                                className="btn-primary"
                            >
                                {mutation.isPending ? 'Memproses...' : 'Konfirmasi Redeem'}
                            </button>
                            <Link to="/redeems" className="btn-secondary">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}