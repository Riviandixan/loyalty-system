import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services';
import { MaterialIcon, StatCard, Spinner } from '../components/ui';
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';

const formatRupiah = (v) => {
    if (!v) return 'Rp 0';
    if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}jt`;
    return `Rp ${Number(v).toLocaleString('id-ID')}`;
};

const formatNumber = (v) => Number(v)?.toLocaleString('id-ID');

// Merge semua bulan dari multiple dataset
const mergeMonthlyData = (revenue = [], members = [], redeems = []) => {
    const monthMap = {};
    revenue.forEach((r) => {
        monthMap[r.month] = { ...monthMap[r.month], month: r.month, revenue: r.revenue, trxCount: r.count };
    });
    members.forEach((r) => {
        monthMap[r.month] = { ...monthMap[r.month], month: r.month, newMembers: r.count };
    });
    redeems.forEach((r) => {
        monthMap[r.month] = { ...monthMap[r.month], month: r.month, redeemCount: r.count, redeemPoints: r.points };
    });
    return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

const CustomTooltipRevenue = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-outline-variant/40 rounded-2xl p-3 shadow-sm text-xs">
            <p className="font-semibold text-on-surface mb-1.5">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    {p.name}: {p.dataKey === 'revenue' ? formatRupiah(p.value) : formatNumber(p.value)}
                </p>
            ))}
        </div>
    );
};

export default function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => dashboardApi.get().then((r) => r.data.data),
    });

    if (isLoading) return <Spinner />;

    const { stats, recentTransactions, recentRedeems, monthlyRevenue, monthlyNewMembers, monthlyRedeems, topMembers } = data || {};

    const mergedData = mergeMonthlyData(monthlyRevenue, monthlyNewMembers, monthlyRedeems);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-on-surface">Dashboard</h1>
                    <p className="text-sm text-on-surface-variant mt-0.5">Ringkasan aktivitas loyalty program</p>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Member" value={formatNumber(stats?.totalMembers)} icon={<MaterialIcon name="groups" className="w-5 h-5" fill={1} />} color="coral" />
                <StatCard label="Member Aktif" value={formatNumber(stats?.activeMembers)} icon={<MaterialIcon name="check_circle" className="w-5 h-5" fill={1} />} color="teal" />
                <StatCard label="Poin Diterbitkan" value={formatNumber(stats?.totalIssuedPoints)} icon={<MaterialIcon name="star" className="w-5 h-5" fill={1} />} color="amber" />
                <StatCard label="Poin Ditukarkan" value={formatNumber(stats?.totalRedeemedPoints)} icon={<MaterialIcon name="redeem" className="w-5 h-5" />} color="slate" />
            </div>

            {/* ROW 2 — Revenue Chart + Side Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue + Transaksi Bar Chart */}
                <div className="card p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-on-surface">Revenue & Transaksi Bulanan</h2>
                            <p className="text-xs text-on-surface-variant mt-0.5">6 bulan terakhir</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={mergedData} barSize={20} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1dcd4" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltipRevenue />} />
                            <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#a43c12" radius={[12, 12, 0, 0]} />
                            <Bar yAxisId="right" dataKey="trxCount" name="Transaksi" fill="#006a65" radius={[12, 12, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Cards */}
                <div className="flex flex-col gap-4">
                    <div className="card p-4 flex-1">
                        <p className="text-[11px] text-on-surface-variant uppercase tracking-[0.18em] mb-2">Total Revenue</p>
                        <p className="text-xl font-bold text-on-surface">{formatRupiah(stats?.totalRevenue)}</p>
                        <div className="mt-3 w-full h-2 bg-primary-fixed rounded-full overflow-hidden">
                            <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1">78% dari target tahunan</p>
                    </div>
                    <div className="card p-4 flex-1">
                        <p className="text-[11px] text-on-surface-variant uppercase tracking-[0.18em] mb-2">Total Transaksi</p>
                        <p className="text-xl font-bold text-on-surface">{formatNumber(stats?.totalTransactions)}</p>
                        <div className="mt-3 w-full h-2 bg-secondary-fixed rounded-full overflow-hidden">
                            <div className="h-2 bg-secondary rounded-full" style={{ width: '61%' }}></div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1">61% dari target tahunan</p>
                    </div>
                </div>
            </div>

            {/* ROW 3 — New Members Line Chart + Redeem Area Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* New Members */}
                <div className="card p-5">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-on-surface">Member Baru per Bulan</h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">Pertumbuhan member 6 bulan terakhir</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={mergedData}>
                            <defs>
                                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a43c12" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#a43c12" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1dcd4" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 16, border: '1px solid #dec0b6', boxShadow: 'none' }} />
                            <Area type="monotone" dataKey="newMembers" name="Member Baru" stroke="#a43c12" strokeWidth={2.5} fill="url(#colorMembers)" dot={{ fill: '#a43c12', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Redeem Activity */}
                <div className="card p-5">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-on-surface">Aktivitas Redeem per Bulan</h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">Jumlah penukaran poin 6 bulan terakhir</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={mergedData}>
                            <defs>
                                <linearGradient id="colorRedeem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#006a65" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#006a65" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1dcd4" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#8b7169' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 16, border: '1px solid #dec0b6', boxShadow: 'none' }} />
                            <Area type="monotone" dataKey="redeemCount" name="Jumlah Redeem" stroke="#006a65" strokeWidth={2.5} fill="url(#colorRedeem)" dot={{ fill: '#006a65', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ROW 4 — Recent Transactions + Top Members */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Transactions */}
                <div className="card overflow-hidden lg:col-span-2">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
                        <h2 className="text-sm font-semibold text-on-surface">Transaksi Terbaru</h2>
                        <a href="/transactions" className="text-xs text-primary hover:underline">Lihat semua →</a>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-th">No. Transaksi</th>
                                <th className="table-th">Member</th>
                                <th className="table-th text-right">Total</th>
                                <th className="table-th text-right">Poin</th>
                                <th className="table-th text-right">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions?.map((t) => (
                                <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                                    <td className="table-td">
                                        <span className="font-semibold text-primary text-xs">{t.transactionNumber}</span>
                                    </td>
                                    <td className="table-td">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-semibold flex-shrink-0">
                                                {t.member?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <span className="text-sm">{t.member?.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="table-td text-right font-medium text-sm">{formatRupiah(t.totalAmount)}</td>
                                    <td className="table-td text-right">
                                        <span className="badge-active">+{t.earnedPoints} pts</span>
                                    </td>
                                    <td className="table-td text-right text-slate-400 text-xs">
                                        {new Date(t.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                    </td>
                                </tr>
                            ))}
                            {!recentTransactions?.length && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-sm text-slate-400">Belum ada transaksi</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Top Members */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
                        <h2 className="text-sm font-semibold text-on-surface">Top Member</h2>
                        <span className="text-xs text-on-surface-variant">by poin</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {topMembers?.map((m, i) => (
                            <div key={m.memberCode} className="flex items-center gap-3">
                                {/* Rank */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-tertiary-container text-on-tertiary-container' :
                                    i === 1 ? 'bg-surface-container-high text-on-surface-variant' :
                                        i === 2 ? 'bg-primary-container text-on-primary-container' :
                                            'bg-surface-container-low text-on-surface-variant'
                                    }`}>
                                    {i + 1}
                                </div>
                                {/* Avatar */}
                                <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-[10px] font-semibold flex-shrink-0">
                                    {m.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-on-surface truncate">{m.fullName}</p>
                                    <p className="text-[10px] text-on-surface-variant">{m._count.transactions} transaksi</p>
                                </div>
                                {/* Points */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-semibold text-tertiary">{m.pointBalance.toLocaleString('id-ID')}</p>
                                    <p className="text-[10px] text-on-surface-variant">pts</p>
                                </div>
                            </div>
                        ))}
                        {!topMembers?.length && (
                            <p className="text-center text-xs text-on-surface-variant py-6">Belum ada data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ROW 5 — Recent Redeems */}
            <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
                    <h2 className="text-sm font-semibold text-on-surface">Redeem Terbaru</h2>
                    <a href="/redeems" className="text-xs text-primary hover:underline">Lihat semua →</a>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Member</th>
                            <th className="table-th">Reward</th>
                            <th className="table-th text-right">Poin Digunakan</th>
                            <th className="table-th text-right">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRedeems?.map((r) => (
                            <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                                <td className="table-td">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-semibold flex-shrink-0">
                                            {r.member?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <span className="text-sm">{r.member?.fullName}</span>
                                    </div>
                                </td>
                                <td className="table-td">
                                    <span className="text-sm inline-flex items-center gap-1">
                                        <MaterialIcon name="redeem" className="w-4 h-4 text-tertiary" />
                                        {r.reward?.name}
                                    </span>
                                </td>
                                <td className="table-td text-right">
                                    <span className="text-xs font-semibold text-tertiary bg-tertiary-fixed/60 px-2 py-0.5 rounded-full">
                                        -{r.pointsUsed} pts
                                    </span>
                                </td>
                                <td className="table-td text-right text-on-surface-variant text-xs">
                                    {new Date(r.redeemedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                </td>
                            </tr>
                        ))}
                        {!recentRedeems?.length && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-sm text-on-surface-variant">Belum ada redeem</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}