import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { redeemApi } from '../../services';
import { Pagination, Spinner, EmptyState } from '../../components/ui';

const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const rewardIcon = (name = '') => {
    if (name.includes('10.000')) return '🎫';
    if (name.includes('25.000')) return '🎟️';
    if (name.includes('50.000')) return '🏷️';
    return '🎁';
};

export default function RedeemListPage() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['redeems', page],
        queryFn: () => redeemApi.list({ page, limit: 10 }).then((r) => r.data),
        keepPreviousData: true,
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Redeem Poin</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Riwayat penukaran poin seluruh member
                    </p>
                </div>
                <Link to="/redeems/create" className="btn-primary flex items-center gap-2">
                    + Tukar Poin
                </Link>
            </div>

            {/* Summary */}
            {data?.pagination && (
                <div className="flex items-center gap-4 mb-3 px-1">
                    <span className="text-xs text-slate-400">
                        Total{' '}
                        <span className="font-medium text-slate-700">
                            {data.pagination.total.toLocaleString('id-ID')}
                        </span>{' '}
                        redeem
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : !data?.data?.length ? (
                    <EmptyState message="Belum ada riwayat redeem" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="table-th">Member</th>
                                    <th className="table-th">Reward</th>
                                    <th className="table-th text-right">Poin Digunakan</th>
                                    <th className="table-th text-right">Tanggal Redeem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                        {/* Member */}
                                        <td className="table-td">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-semibold flex-shrink-0">
                                                    {r.member?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{r.member?.fullName}</p>
                                                    <p className="text-[11px] text-slate-400">{r.member?.memberCode}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Reward */}
                                        <td className="table-td">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{rewardIcon(r.reward?.name)}</span>
                                                <span className="text-sm font-medium text-slate-700">
                                                    {r.reward?.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Poin */}
                                        <td className="table-td text-right">
                                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                                                -{r.pointsUsed.toLocaleString('id-ID')} pts
                                            </span>
                                        </td>

                                        {/* Tanggal */}
                                        <td className="table-td text-right text-slate-400 text-xs">
                                            {formatDate(r.redeemedAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination pagination={data.pagination} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}