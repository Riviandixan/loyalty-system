import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { memberApi } from '../../services';
import { Badge, MaterialIcon, Spinner } from '../../components/ui';
import { TierBadge, TierProgressCard, TierGuide } from '../../components/ui/TierBadge';
import MemberCard from '../members/MemberCard';

const formatRupiah = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

export default function MemberDetailPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('info');

    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: () => memberApi.get(id).then((r) => r.data.data),
    });

    if (isLoading) return <Spinner />;
    if (!member) return <div className="p-6 text-slate-500">Member tidak ditemukan.</div>;

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/members" className="text-slate-400 hover:text-slate-600 text-sm">
                    ← Kembali
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-lg font-semibold text-slate-900">Detail Member</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* LEFT — Profile */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="card p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-semibold">
                                {member.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge status={member.status} />
                                <TierBadge tier={member.tier || 'BRONZE'} />
                            </div>
                        </div>
                        <h2 className="text-base font-semibold text-slate-900">{member.fullName}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>

                        <div className="mt-4 space-y-2.5">
                            <InfoRow label="Kode Member" value={
                                <span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                    {member.memberCode}
                                </span>
                            } />
                            <InfoRow label="No. HP" value={member.phone} />
                            <InfoRow
                                label="Tanggal Lahir"
                                value={member.dateOfBirth ? formatDate(member.dateOfBirth) : '—'}
                            />
                            <InfoRow label="Bergabung" value={formatDate(member.createdAt)} />
                        </div>

                        <Link
                            to={`/members/${id}/edit`}
                            className="btn-secondary w-full text-center mt-4 block"
                        >
                            Edit Profil
                        </Link>
                    </div>

                    {/* Point Balance Card */}
                    <div className="card p-5">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Saldo Poin</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {member.pointBalance.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">poin tersedia</p>

                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                            <div>
                                <p className="text-base font-semibold text-slate-800">
                                    {member.transactions?.length || 0}
                                </p>
                                <p className="text-[10px] text-slate-400">Transaksi</p>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-800">
                                    {member.redeems?.length || 0}
                                </p>
                                <p className="text-[10px] text-slate-400">Redeem</p>
                            </div>
                        </div>
                    </div>

                    {/* Tier Progress */}
                    <TierProgressCard
                        tier={member.tier || 'BRONZE'}
                        totalPointsEarned={member.totalPointsEarned || 0}
                    />

                    {/* Tier Guide */}
                    <div className="card p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-3 inline-flex items-center gap-1.5">
                            <MaterialIcon name="bar_chart" className="w-4 h-4 text-tertiary" />
                            Panduan Tier
                        </p>
                        <TierGuide />
                    </div>
                </div>

                {/* RIGHT — History */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                        {[
                            { id: 'info', label: 'Riwayat', icon: 'description' },
                            { id: 'card', label: 'Kartu Member', icon: 'badge' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <MaterialIcon name={tab.icon} className="w-4 h-4" />
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* TAB: Riwayat */}
                    {activeTab === 'info' && (
                        <>
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">Riwayat Transaksi</h3>
                                    <span className="text-xs text-slate-400">{member.transactions?.length || 0} transaksi terakhir</span>
                                </div>
                                {member.transactions?.length ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="table-th">No. Transaksi</th>
                                                <th className="table-th text-right">Total</th>
                                                <th className="table-th text-right">Poin</th>
                                                <th className="table-th text-right">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {member.transactions.map((t) => (
                                                <tr key={t.id} className="hover:bg-slate-50">
                                                    <td className="table-td">
                                                        <span className="text-xs font-medium text-blue-600">{t.transactionNumber}</span>
                                                    </td>
                                                    <td className="table-td text-right font-medium">{formatRupiah(t.totalAmount)}</td>
                                                    <td className="table-td text-right">
                                                        <span className="badge-active">+{t.earnedPoints} pts</span>
                                                    </td>
                                                    <td className="table-td text-right text-slate-400 text-xs">
                                                        {formatDate(t.transactionDate)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-10 text-center text-sm text-slate-400">
                                        Belum ada transaksi
                                    </div>
                                )}
                            </div>

                            {/* Redeem History */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">Riwayat Redeem</h3>
                                    <span className="text-xs text-slate-400">{member.redeems?.length || 0} redeem terakhir</span>
                                </div>
                                {member.redeems?.length ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="table-th">Reward</th>
                                                <th className="table-th text-right">Poin Digunakan</th>
                                                <th className="table-th text-right">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {member.redeems.map((r) => (
                                                <tr key={r.id} className="hover:bg-slate-50">
                                                    <td className="table-td">
                                                        <div className="flex items-center gap-2">
                                                            <MaterialIcon name="redeem" className="w-4 h-4 text-tertiary" />
                                                            <span className="text-sm font-medium text-slate-700">{r.reward?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="table-td text-right">
                                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                                            -{r.pointsUsed} pts
                                                        </span>
                                                    </td>
                                                    <td className="table-td text-right text-slate-400 text-xs">
                                                        {formatDate(r.redeemedAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-10 text-center text-sm text-slate-400">
                                        Belum ada redeem
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* TAB: Kartu Member */}
                    {activeTab === 'card' && (
                        <div className="space-y-4">
                            {/* Info */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-start gap-2.5">
                                <MaterialIcon name="info" className="w-4 h-4 mt-0.5 text-blue-700 shrink-0" />
                                <p className="text-xs text-blue-700">
                                    Kartu member digital ini berisi QR Code unik yang bisa di-scan kasir
                                    untuk mencari data member secara otomatis saat transaksi.
                                    Bisa diunduh sebagai PNG atau dicetak langsung.
                                </p>
                            </div>

                            {/* Card preview */}
                            <div className="card p-6 flex flex-col items-center">
                                <MemberCard member={member} showActions={true} />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-slate-700 font-medium">{value}</span>
    </div>
);