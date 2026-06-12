import { getTierInfo, getNextTier, getTierProgress } from '../../utils/tier';

// Badge kecil untuk tabel
export const TierBadge = ({ tier, size = 'sm' }) => {
    const info = getTierInfo(tier);
    return (
        <span
            style={{ background: info.bg, color: info.color, border: `1px solid ${info.border}` }}
            className={`inline-flex items-center gap-1 rounded-md font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
                }`}
        >
            <span>{info.emoji}</span>
            {info.label}
        </span>
    );
};

// Card progress tier untuk member detail
export const TierProgressCard = ({ tier, totalPointsEarned = 0 }) => {
    const info = getTierInfo(tier);
    const next = getNextTier(totalPointsEarned);
    const progress = getTierProgress(totalPointsEarned);

    return (
        <div
            style={{ background: info.bg, borderColor: info.border }}
            className="rounded-xl border p-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{info.emoji}</span>
                    <div>
                        <p className="text-xs text-slate-500">Tier Saat Ini</p>
                        <p className="text-base font-bold" style={{ color: info.color }}>
                            {info.label}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">Total Poin Lifetime</p>
                    <p className="text-base font-bold text-slate-800">
                        {totalPointsEarned.toLocaleString('id-ID')} pts
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            {next ? (
                <>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span style={{ color: info.color }} className="font-medium">{info.label}</span>
                        <span className="font-medium" style={{ color: getTierInfo(next.tier).color }}>
                            {next.emoji} {next.label}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                        <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: info.color }}
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                        Butuh{' '}
                        <span className="font-semibold" style={{ color: info.color }}>
                            {next.pointsNeeded.toLocaleString('id-ID')} pts
                        </span>{' '}
                        lagi untuk naik ke {next.label}
                    </p>
                </>
            ) : (
                <>
                    <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full w-full" style={{ background: info.color }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 text-center font-medium">
                        🎉 Tier tertinggi! Terima kasih atas loyalitas Anda
                    </p>
                </>
            )}
        </div>
    );
};

// Tier summary semua level — untuk referensi
export const TierGuide = () => {
    const tiers = [
        { tier: 'BRONZE', min: 0, max: '499', emoji: '🥉' },
        { tier: 'SILVER', min: 500, max: '1.499', emoji: '🥈' },
        { tier: 'GOLD', min: 1500, max: '4.999', emoji: '🥇' },
        { tier: 'PLATINUM', min: 5000, max: '∞', emoji: '💎' },
    ];
    return (
        <div className="grid grid-cols-2 gap-2">
            {tiers.map((t) => {
                const info = getTierInfo(t.tier);
                return (
                    <div
                        key={t.tier}
                        style={{ background: info.bg, borderColor: info.border }}
                        className="border rounded-lg p-3 flex items-center gap-2"
                    >
                        <span className="text-xl">{t.emoji}</span>
                        <div>
                            <p className="text-xs font-semibold" style={{ color: info.color }}>{info.label}</p>
                            <p className="text-[10px] text-slate-400">
                                {t.min.toLocaleString('id-ID')} – {t.max} pts
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TierBadge;