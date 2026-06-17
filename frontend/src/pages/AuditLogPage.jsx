import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../services';
import { MaterialIcon, Pagination, Spinner, EmptyState } from '../components/ui';

const actionConfig = {
    USER_LOGIN: { label: 'Login', color: 'bg-blue-50 text-blue-700', icon: 'vpn_key' },
    USER_CREATED: { label: 'User Dibuat', color: 'bg-teal-50 text-teal-700', icon: 'person_add' },
    USER_UPDATED: { label: 'User Diperbarui', color: 'bg-amber-50 text-amber-700', icon: 'edit' },
    USER_DELETED: { label: 'User Dihapus', color: 'bg-red-50 text-red-600', icon: 'delete' },
    MEMBER_CREATED: { label: 'Member Dibuat', color: 'bg-teal-50 text-teal-700', icon: 'groups' },
    MEMBER_UPDATED: { label: 'Member Diperbarui', color: 'bg-amber-50 text-amber-700', icon: 'edit' },
    MEMBER_STATUS_UPDATED: { label: 'Status Member', color: 'bg-slate-100 text-slate-600', icon: 'autorenew' },
    TRANSACTION_CREATED: { label: 'Transaksi', color: 'bg-blue-50 text-blue-700', icon: 'receipt_long' },
    POINT_REDEEMED: { label: 'Poin Ditukar', color: 'bg-purple-50 text-purple-700', icon: 'redeem' },
};

const ActionBadge = ({ action }) => {
    const cfg = actionConfig[action] || { label: action, color: 'bg-slate-100 text-slate-600', icon: 'description' };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${cfg.color}`}>
            <MaterialIcon name={cfg.icon} className="text-[14px]" />
            {cfg.label}
        </span>
    );
};

const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

export default function AuditLogPage() {
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['audit-logs', page],
        queryFn: () => auditApi.list({ page, limit: 20 }).then((r) => r.data),
        keepPreviousData: true,
    });

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const parseDetail = (detail) => {
        if (!detail) return null;
        try {
            return typeof detail === 'string' ? JSON.parse(detail) : detail;
        } catch {
            return null;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-lg font-semibold text-slate-900">Audit Log</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Rekam jejak seluruh aktivitas penting dalam sistem
                </p>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
                <MaterialIcon name="info" className="w-4 h-4 mt-0.5 text-blue-700 shrink-0" />
                <p className="text-xs text-blue-700">
                    Audit log mencatat semua aktivitas kritis seperti login, pembuatan transaksi, penukaran poin, dan perubahan data. Hanya Admin yang dapat melihat halaman ini.
                </p>
            </div>

            {/* Summary */}
            {data?.pagination && (
                <div className="mb-3 px-1">
                    <span className="text-xs text-slate-400">
                        Total{' '}
                        <span className="font-medium text-slate-700">
                            {data.pagination.total.toLocaleString('id-ID')}
                        </span>{' '}
                        aktivitas tercatat
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : !data?.data?.length ? (
                    <EmptyState message="Belum ada aktivitas tercatat" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="table-th">Waktu</th>
                                    <th className="table-th">User</th>
                                    <th className="table-th">Aksi</th>
                                    <th className="table-th">Entity</th>
                                    <th className="table-th text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((log) => {
                                    const detail = parseDetail(log.detail);
                                    const isExpanded = expandedId === log.id;

                                    return (
                                        <>
                                            <tr
                                                key={log.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                {/* Waktu */}
                                                <td className="table-td text-xs text-slate-400 whitespace-nowrap">
                                                    {formatDate(log.createdAt)}
                                                </td>

                                                {/* User */}
                                                <td className="table-td">
                                                    {log.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[9px] font-semibold flex-shrink-0">
                                                                {log.user.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-on-surface">{log.user.fullName}</p>
                                                                <p className="text-[10px] text-on-surface-variant">{log.user.email}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">System</span>
                                                    )}
                                                </td>

                                                {/* Aksi */}
                                                <td className="table-td">
                                                    <ActionBadge action={log.action} />
                                                </td>

                                                {/* Entity */}
                                                <td className="table-td">
                                                    <div>
                                                        <span className="text-xs font-medium text-slate-700">{log.entity}</span>
                                                        {log.entityId && (
                                                            <span className="text-[10px] text-on-surface-variant ml-1.5">#{log.entityId}</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Detail toggle */}
                                                <td className="table-td text-center">
                                                    {detail ? (
                                                        <button
                                                            onClick={() => toggleExpand(log.id)}
                                                            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${isExpanded
                                                                ? 'bg-slate-200 text-slate-700'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                                }`}
                                                        >
                                                            {isExpanded ? 'Tutup' : 'Lihat'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-300">—</span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Expanded detail row */}
                                            {isExpanded && detail && (
                                                <tr key={`${log.id}-detail`} className="bg-surface-container-low">
                                                    <td colSpan={5} className="px-6 py-3 border-t border-outline-variant/20">
                                                        <div className="bg-white border border-outline-variant/40 rounded-lg p-3">
                                                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                                                                Detail Aktivitas
                                                            </p>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
                                                                {Object.entries(detail).map(([key, value]) => (
                                                                    <div key={key} className="flex items-start gap-1.5">
                                                                        <span className="text-[11px] text-on-surface-variant min-w-0 capitalize">
                                                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                        </span>
                                                                        <span className="text-[11px] text-on-surface font-medium truncate">
                                                                            {typeof value === 'object'
                                                                                ? JSON.stringify(value)
                                                                                : String(value)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Pagination pagination={data.pagination} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    );
}