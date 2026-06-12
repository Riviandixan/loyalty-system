// Shared UI components

export const MaterialIcon = ({ name, className = 'w-5 h-5', variant = 'outlined', fill = 0 }) => (
    <span
        className={`material-symbols-${variant} ${className}`}
        style={{ fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
        aria-hidden="true"
    >
        {name}
    </span>
);

const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

export const Icon = ({ name, className = 'w-5 h-5' }) => {
    const icons = {
        dashboard: (
            <svg {...iconProps} className={className}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        members: (
            <svg {...iconProps} className={className}>
                <path d="M13 16a4 4 0 0 1 4 4v1H7v-1a4 4 0 0 1 4-4z" />
                <circle cx="12" cy="8" r="4" />
            </svg>
        ),
        transactions: (
            <svg {...iconProps} className={className}>
                <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                <path d="M14 2v5h5" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        ),
        redeem: (
            <svg {...iconProps} className={className}>
                <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
                <path d="M2 12h20" />
                <path d="M12 12V3" />
                <path d="M7 7h10" />
            </svg>
        ),
        users: (
            <svg {...iconProps} className={className}>
                <path d="M12 3l8 4v5c0 5-3.8 9.74-8 11-4.2-1.26-8-6-8-11V7l8-4z" />
            </svg>
        ),
        audit: (
            <svg {...iconProps} className={className}>
                <path d="M9 2h6v4H9z" />
                <path d="M5 6h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        ),
        success: (
            <svg {...iconProps} className={className}>
                <path d="M5 13l4 4L19 7" />
            </svg>
        ),
        logout: (
            <svg {...iconProps} className={className}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
            </svg>
        ),
        star: (
            <svg {...iconProps} className={className}>
                <path d="M12 2l2.9 5.9L22 9.2l-4.5 4.4L18.8 22 12 18.5 5.2 22l1.3-8.4L2 9.2l7.1-1.3L12 2z" />
            </svg>
        ),
    };

    return icons[name] || null;
};

export const PageHeader = ({ title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-lg font-bold text-on-surface">{title}</h1>
            {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const StatCard = ({ label, value, icon, trend, trendLabel, color = 'blue' }) => {
    const colors = {
        coral: 'bg-primary-container text-on-primary-container',
        teal: 'bg-secondary-container text-on-secondary-container',
        amber: 'bg-tertiary-container text-on-tertiary-container',
        slate: 'bg-surface-container-high text-on-surface-variant',
    };
    return (
        <div className="card p-5 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4 mb-5">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.18em]">{label}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${colors[color]}`}>{icon}</div>
            </div>
            <div className="text-[2.15rem] leading-none font-extrabold text-on-surface">{value}</div>
            {trend && (
                <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-semibold ${trend > 0 ? 'text-secondary' : 'text-error'}`}>
                        {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                    {trendLabel && <span className="text-xs text-on-surface-variant">{trendLabel}</span>}
                </div>
            )}
        </div>
    );
};

export const Badge = ({ status }) => {
    if (status === 'ACTIVE') return <span className="badge-active">Aktif</span>;
    return <span className="badge-inactive">Nonaktif</span>;
};

export const Spinner = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export const EmptyState = ({ message = 'Tidak ada data' }) => (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <MaterialIcon name="inbox" className="w-10 h-10 mb-3 text-on-surface-variant" />
        <p className="text-sm">{message}</p>
    </div>
);

export const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const { page, totalPages, total, limit } = pagination;
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/30">
            <span className="text-xs text-on-surface-variant">
                Menampilkan {from}–{to} dari {total} data
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    ‹ Prev
                </button>
                <span className="px-3 py-1 text-xs text-on-surface-variant">
                    {page} / {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Next ›
                </button>
            </div>
        </div>
    );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
                    <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface text-lg leading-none">×</button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};

export const Alert = ({ type = 'error', title, message }) => {
    if (!message) return null;
    const styles = {
        error: 'bg-[#fff1ef] border-[#f5c8c2] text-[#ba1a1a]',
        success: 'bg-[#ecfffd] border-[#bceee9] text-[#006a65]',
        warning: 'bg-[#fff4e8] border-[#f4d5b3] text-[#8d4f11]',
    };
    const icons = {
        error: 'error',
        success: 'check_circle',
        warning: 'warning',
    };

    return (
        <div className={`border rounded-2xl px-4 py-3 text-sm mb-4 ${styles[type]}`}>
            <div className="flex items-start gap-3">
                <MaterialIcon name={icons[type]} className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                    {title && <p className="font-semibold text-sm mb-1">{title}</p>}
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};