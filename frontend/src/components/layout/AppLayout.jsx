import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authStore } from '../../store/auth.store';
import { Icon } from '../ui';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/members', label: 'Members', icon: 'members' },
    { to: '/transactions', label: 'Transaksi', icon: 'transactions' },
    { to: '/redeems', label: 'Redeem', icon: 'redeem' },
];

const adminItems = [
    { to: '/users', label: 'Users', icon: 'users' },
    { to: '/audit-logs', label: 'Audit Logs', icon: 'audit' },
];

export default function AppLayout() {
    const navigate = useNavigate();
    const user = authStore.getUser();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div
            className="relative isolate flex h-screen overflow-hidden bg-background text-on-background"
            style={{
                backgroundImage: [
                    'radial-gradient(circle at 1px 1px, rgba(164,60,18,0.14) 1px, transparent 0)',
                    'radial-gradient(circle at 20% 20%, rgba(255,127,80,0.12), transparent 22%)',
                    'radial-gradient(circle at 80% 10%, rgba(118,243,234,0.10), transparent 18%)',
                    'radial-gradient(circle at 70% 85%, rgba(255,255,255,0.16), transparent 20%)',
                ].join(', '),
                backgroundSize: '18px 18px, auto, auto, auto',
                backgroundAttachment: 'fixed',
            }}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,248,246,0.18)_0%,rgba(255,248,246,0.04)_100%)]" />
            <aside className="relative z-10 w-[264px] bg-surface-container-lowest/92 backdrop-blur flex flex-col flex-shrink-0 border-r border-outline-variant/40">
                <div className="px-6 py-5 border-b border-outline-variant/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-[0_12px_24px_rgba(164,60,18,0.18)]">S</div>
                        <div>
                            <div className="text-sm font-bold text-on-surface leading-tight">Sahabat Retail</div>
                            <div className="text-[10px] text-on-surface-variant tracking-[0.18em] uppercase">Loyalty Program</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 overflow-y-auto">
                    <div className="text-[10px] text-outline uppercase tracking-[0.22em] px-3 pb-2">Main</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-full mb-1.5 text-sm transition-all ${isActive
                                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_10px_20px_rgba(255,127,80,0.22)]'
                                    : 'text-on-surface-variant hover:bg-surface-container-highest/70 hover:text-on-surface'
                                }`
                            }
                        >
                            <Icon name={item.icon} className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}

                    {user?.role === 'ADMIN' && (
                        <>
                            <div className="text-[10px] text-outline uppercase tracking-[0.22em] px-3 pb-2 pt-6">System</div>
                            {adminItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-full mb-1.5 text-sm transition-all ${isActive
                                            ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-[0_10px_20px_rgba(118,243,234,0.18)]'
                                            : 'text-on-surface-variant hover:bg-surface-container-highest/70 hover:text-on-surface'
                                        }`
                                    }
                                >
                                    <Icon name={item.icon} className="w-5 h-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                <div className="px-4 py-4 border-t border-outline-variant/30">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${isActive ? 'bg-surface-container-high' : 'hover:bg-surface-container-highest/70'
                            }`
                        }
                    >
                        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold flex-shrink-0">
                            {user?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-on-surface truncate">{user?.fullName}</div>
                            <div className="text-[10px] text-on-surface-variant">{user?.role}</div>
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); handleLogout(); }}
                            className="text-on-surface-variant hover:text-primary text-xs transition-colors p-1 rounded-full"
                            title="Logout"
                        >
                            <Icon name="logout" className="w-4 h-4" />
                        </button>
                    </NavLink>
                </div>
            </aside>

            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <header className="bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-6 h-[72px] flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
                    <div>
                        <span className="text-sm font-semibold text-on-surface">Halo lagi, {user?.fullName?.split(' ')[0]} 👋</span>
                        <div className="text-[11px] text-on-surface-variant mt-0.5">Ringkasan loyalty program kamu hari ini.</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-on-surface-variant hidden sm:block">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">
                            {user?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}