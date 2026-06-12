import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MaterialIcon } from '../components/ui';
import screenImage from '../assets/screen.png';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register({ fullName, email, password });
        if (result.success) navigate('/login', { state: { successMessage: 'Register berhasil. Silakan login dengan akun baru Anda.' } });
    };

    return (
        <div className="min-h-screen bg-[#fff8f6] text-slate-900 lg:h-screen lg:overflow-hidden">
            <div className="mx-auto grid min-h-screen w-full max-w-[1600px] overflow-hidden lg:h-full lg:grid-cols-[1.05fr_0.95fr]">
                <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#c9572e_0%,#a43c12_52%,#7f2f14_100%)] px-6 py-7 text-white sm:px-8 sm:py-8 lg:h-full lg:px-10 lg:py-8">
                    <div className="pointer-events-none absolute inset-0 opacity-100">
                        <div className="absolute -left-16 -top-16 h-96 w-96 rounded-full bg-white/8 blur-3xl"></div>
                        <div className="absolute right-0 top-1/4 h-52 w-52 rounded-full bg-[#ffb59c]/12 blur-3xl"></div>
                        <div className="absolute bottom-8 left-1/3 h-72 w-72 rounded-full bg-[#5b2f00]/18 blur-3xl"></div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 flex flex-1 flex-col gap-5 lg:gap-6">
                        <div className="flex flex-1 flex-col items-center justify-center gap-5 lg:flex-row lg:gap-8">
                            <div className="w-full max-w-[320px] shrink-0 lg:max-w-[300px]">
                                <div className="overflow-hidden rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.25)] ring-1 ring-white/20">
                                    <div className="flex items-center gap-1.5 bg-[#1a1a2e] px-4 py-2.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]"></div>
                                    </div>
                                    <img src={screenImage} alt="LoyaltyOS" className="w-full object-contain" />
                                </div>
                            </div>

                            <div className="w-full max-w-sm rounded-[30px] bg-white/14 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-[8px] ring-1 ring-white/12 lg:p-4">
                                <div className="inline-flex items-center rounded-full bg-white/12 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                                    Loyalty & Membership
                                </div>
                                <h2 className="mt-4 text-[clamp(1.35rem,2.6vw,2rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
                                    Buat akun, kelola member,
                                    <br />
                                    dan jalankan program loyalitas
                                    <br />
                                    dari satu dashboard.
                                </h2>
                                <p className="mt-3 text-[13px] leading-6 text-white/80 lg:text-[14px] lg:leading-7">
                                    Daftarkan akun baru untuk mulai mencatat pelanggan, transaksi, dan reward secara terpusat.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 grid gap-4 pb-2 sm:grid-cols-2 lg:pb-2">
                            <FeatureCard icon="group" title="Data Member" description="Simpan identitas pelanggan dengan rapi sejak awal." />
                            <FeatureCard icon="redeem" title="Akses Dashboard" description="Langsung masuk ke sistem setelah akun siap digunakan." />
                        </div>
                    </div>
                </section>

                <section className="flex items-center bg-white px-5 py-8 sm:px-8 lg:h-full lg:px-12 lg:py-8">
                    <div className="w-full max-w-[620px]">
                        <div className="mb-8 flex items-center gap-3.5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a43c12] text-lg font-bold text-white shadow-[0_14px_32px_rgba(164,60,18,0.26)]">
                                L
                            </div>
                            <div>
                                <div className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">LoyaltyOS</div>
                                <div className="text-sm text-slate-500">Sistem loyalty & member</div>
                            </div>
                        </div>

                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <h2 className="text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold tracking-[-0.04em] text-slate-900">
                                    Daftar Akun
                                </h2>
                                <p className="mt-3 max-w-xl text-[14px] leading-7 text-slate-500 sm:text-[15px]">
                                    Isi nama, email, dan password untuk membuat akun baru.
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <MaterialIcon name="error" className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 pt-1 sm:space-y-5">
                                <div>
                                    <label className="mb-2 block text-[14px] font-medium text-slate-700">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="input-field h-12 rounded-2xl bg-white px-5 text-[14px] shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[14px] font-medium text-slate-700">Email Anda</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field h-12 rounded-2xl bg-white px-5 text-[14px] shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
                                        placeholder="Masukkan email Anda"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[14px] font-medium text-slate-700">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field h-12 rounded-2xl bg-white px-5 text-[14px] shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#a43c12] px-6 text-[14px] font-semibold text-white shadow-[0_18px_36px_rgba(164,60,18,0.22)] transition hover:bg-[#8f3510] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? 'Memproses...' : 'Daftar'}
                                </button>

                                <p className="text-sm text-slate-500">
                                    Sudah punya akun?{' '}
                                    <Link to="/login" className="font-medium text-[#a43c12] transition-colors hover:text-[#8f3510]">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

const FeatureCard = ({ icon, title, description }) => (
    <div className="rounded-[28px] border border-white/14 bg-white/10 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.10)] backdrop-blur-[6px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.15)] lg:p-5">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white/14">
            <MaterialIcon name={icon} className="text-lg text-white" />
        </div>
        <p className="mt-3 text-[14px] font-semibold text-white">{title}</p>
        <p className="mt-1.5 text-[13px] leading-6 text-white/80">{description}</p>
    </div>
);