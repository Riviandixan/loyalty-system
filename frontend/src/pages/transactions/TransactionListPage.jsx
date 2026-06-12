import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { transactionApi } from '../../services';
import { Pagination, Spinner, EmptyState } from '../../components/ui';

const formatRupiah = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;
const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransactionListPage() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['transactions', { page, search, startDate, endDate }],
        queryFn: () =>
            transactionApi
                .list({ page, limit: 10, search, startDate, endDate })
                .then((r) => r.data),
        keepPreviousData: true,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleReset = () => {
        setSearch('');
        setSearchInput('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const hasFilter = search || startDate || endDate;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Transaksi</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Riwayat seluruh transaksi member
                    </p>
                </div>
                <Link to="/transactions/create" className="btn-primary flex items-center gap-2">
                    + Buat Transaksi
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-4">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-end gap-3"
                >
                    {/* Search */}
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs text-slate-500 mb-1">Cari</label>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="No. transaksi atau nama member..."
                            className="input-field"
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                            className="input-field w-36"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                            className="input-field w-36"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary">
                            Cari
                        </button>
                        {hasFilter && (
                            <button type="button" onClick={handleReset} className="btn-secondary">
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Summary bar */}
            {data?.pagination && (
                <div className="flex items-center gap-4 mb-3 px-1">
                    <span className="text-xs text-slate-400">
                        Total{' '}
                        <span className="font-medium text-slate-700">
                            {data.pagination.total.toLocaleString('id-ID')}
                        </span>{' '}
                        transaksi ditemukan
                    </span>
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : !data?.data?.length ? (
                    <EmptyState message="Tidak ada transaksi ditemukan" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="table-th">No. Transaksi</th>
                                    <th className="table-th">Member</th>
                                    <th className="table-th text-right">Total Belanja</th>
                                    <th className="table-th text-right">Poin Diperoleh</th>
                                    <th className="table-th text-right">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        {/* No Transaksi */}
                                        <td className="table-td">
                                            <span className="font-mono text-xs font-medium text-blue-600">
                                                {t.transactionNumber}
                                            </span>
                                        </td>

                                        {/* Member */}
                                        <td className="table-td">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-semibold flex-shrink-0">
                                                    {t.member?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {t.member?.fullName}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">{t.member?.memberCode}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Total */}
                                        <td className="table-td text-right">
                                            <span className="font-semibold text-slate-800">
                                                {formatRupiah(t.totalAmount)}
                                            </span>
                                        </td>

                                        {/* Poin */}
                                        <td className="table-td text-right">
                                            <span className="badge-active">+{t.earnedPoints} pts</span>
                                        </td>

                                        {/* Tanggal */}
                                        <td className="table-td text-right text-slate-400 text-xs">
                                            {formatDate(t.transactionDate)}
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