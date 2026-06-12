import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { memberApi } from '../../services';
import { Badge, Pagination, Spinner, EmptyState } from '../../components/ui';
import { TierBadge } from '../../components/ui/TierBadge';
import { ExportButton } from '../../components/ui/ExportButton';
import { exportMembersToExcel, exportMembersToPDF } from '../../utils/export';

export default function MemberListPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['members', { page, search, status }],
        queryFn: () =>
            memberApi.list({ page, limit: 10, search, status }).then((r) => r.data),
        keepPreviousData: true,
    });

    const toggleStatus = useMutation({
        mutationFn: ({ id, currentStatus }) =>
            memberApi.updateStatus(id, currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'),
        onSuccess: () => queryClient.invalidateQueries(['members']),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleStatusFilter = (val) => {
        setStatus(val);
        setPage(1);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Members</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola seluruh data member loyalty program
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton
                        onExportExcel={async () => {
                            const res = await memberApi.list({ limit: 10000 });
                            exportMembersToExcel(res.data.data);
                        }}
                        onExportPDF={async () => {
                            const res = await memberApi.list({ limit: 10000 });
                            exportMembersToPDF(res.data.data);
                        }}
                    />
                    <Link to="/members/create" className="btn-primary flex items-center gap-2">
                        + Tambah Member
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Cari nama, email, kode member..."
                            className="input-field max-w-xs"
                        />
                        <button type="submit" className="btn-secondary">
                            Cari
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                                className="text-xs text-slate-400 hover:text-slate-600"
                            >
                                × Reset
                            </button>
                        )}
                    </form>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1">
                        {[
                            { label: 'Semua', value: '' },
                            { label: 'Aktif', value: 'ACTIVE' },
                            { label: 'Nonaktif', value: 'INACTIVE' },
                        ].map((f) => (
                            <button
                                key={f.value}
                                onClick={() => handleStatusFilter(f.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${status === f.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : !data?.data?.length ? (
                    <EmptyState message="Tidak ada member ditemukan" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="table-th">Kode Member</th>
                                    <th className="table-th">Nama</th>
                                    <th className="table-th">Email</th>
                                    <th className="table-th">No. HP</th>
                                    <th className="table-th text-right">Saldo Poin</th>
                                    <th className="table-th text-center">Tier</th>
                                    <th className="table-th text-center">Status</th>
                                    <th className="table-th">Bergabung</th>
                                    <th className="table-th text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="table-td">
                                            <span className="font-mono text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {member.memberCode}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-semibold flex-shrink-0">
                                                    {member.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <span className="font-medium text-slate-800">{member.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="table-td text-slate-500">{member.email}</td>
                                        <td className="table-td text-slate-500">{member.phone}</td>
                                        <td className="table-td text-right">
                                            <span className="font-semibold text-slate-800">
                                                {member.pointBalance.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-1">pts</span>
                                        </td>
                                        <td className="table-td text-center">
                                            <TierBadge tier={member.tier || 'BRONZE'} />
                                        </td>
                                        <td className="table-td text-center">
                                            <button
                                                onClick={() =>
                                                    toggleStatus.mutate({ id: member.id, currentStatus: member.status })
                                                }
                                                title="Klik untuk toggle status"
                                            >
                                                <Badge status={member.status} />
                                            </button>
                                        </td>
                                        <td className="table-td text-slate-400 text-xs">
                                            {new Date(member.createdAt).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="table-td text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    to={`/members/${member.id}`}
                                                    className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                                >
                                                    Detail
                                                </Link>
                                                <Link
                                                    to={`/members/${member.id}/edit`}
                                                    className="px-2.5 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            pagination={data.pagination}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}