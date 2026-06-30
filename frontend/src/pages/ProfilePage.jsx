import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services';
import { authStore } from '../store/auth.store';
import { MaterialIcon, Spinner, Alert } from '../components/ui';

const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form state
    const [profileForm, setProfileForm] = useState({ fullName: '', email: '' });
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Password form state
    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Fetch profile
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileApi.get().then((r) => r.data.data),
        onSuccess: (data) => {
            setProfileForm({ fullName: data.fullName, email: data.email });
        },
    });

    // Sync form ketika data profile sudah load
    useState(() => {
        if (profile) {
            setProfileForm({ fullName: profile.fullName, email: profile.email });
        }
    }, [profile]);

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: (data) => profileApi.update(data),
        onSuccess: (res) => {
            const updated = res.data.data;
            // Update localStorage juga
            const currentUser = authStore.getUser();
            authStore.setAuth(authStore.getToken(), { ...currentUser, ...updated });
            queryClient.invalidateQueries(['profile']);
            setProfileSuccess('Profil berhasil diperbarui');
            setProfileError('');
            setTimeout(() => setProfileSuccess(''), 3000);
        },
        onError: (err) => {
            setProfileError(err.response?.data?.message || 'Gagal memperbarui profil');
            setProfileSuccess('');
        },
    });

    // Change password mutation
    const passMutation = useMutation({
        mutationFn: (data) => profileApi.changePassword(data),
        onSuccess: () => {
            setPassSuccess('Password berhasil diubah');
            setPassError('');
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPassSuccess(''), 3000);
        },
        onError: (err) => {
            setPassError(err.response?.data?.message || 'Gagal mengubah password');
            setPassSuccess('');
        },
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        if (!profileForm.fullName || !profileForm.email) {
            setProfileError('Nama dan email wajib diisi');
            return;
        }
        updateMutation.mutate(profileForm);
    };

    const handlePassSubmit = (e) => {
        e.preventDefault();
        setPassError('');
        setPassSuccess('');
        if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
            setPassError('Semua field password wajib diisi');
            return;
        }
        if (passForm.newPassword.length < 6) {
            setPassError('Password baru minimal 6 karakter');
            return;
        }
        if (passForm.newPassword !== passForm.confirmPassword) {
            setPassError('Konfirmasi password tidak cocok');
            return;
        }
        if (passForm.currentPassword === passForm.newPassword) {
            setPassError('Password baru harus berbeda dari password lama');
            return;
        }
        passMutation.mutate({
            currentPassword: passForm.currentPassword,
            newPassword: passForm.newPassword,
        });
    };

    const toggleShow = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    if (isLoading) return <Spinner />;

    const initials = profile?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'U';

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-lg font-semibold text-slate-900">Profil Saya</h1>
                <p className="text-sm text-slate-500 mt-0.5">Kelola informasi akun dan keamanan</p>
            </div>

            {/* Profile Card */}
            <div className="card p-5 mb-5 flex items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${profile?.role === 'ADMIN' ? 'bg-blue-500' : 'bg-teal-500'
                        }`}></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-slate-900">{profile?.fullName}</h2>
                    <p className="text-sm text-slate-500">{profile?.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium leading-none ${profile?.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                            }`}>
                            <span className="flex items-center justify-center w-3.5 h-3.5 flex-shrink-0">
                                <MaterialIcon name={profile?.role === 'ADMIN' ? 'admin_panel_settings' : 'person'} className="text-[13px] leading-none" />
                            </span>
                            {profile?.role === 'ADMIN' ? 'Administrator' : 'Staff'}
                        </span>
                        <span className="text-xs text-slate-400">
                            Bergabung sejak {formatDate(profile?.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-center flex-shrink-0">
                    <div>
                        <p className="text-lg font-semibold text-slate-800">
                            {profile?._count?.auditLogs || 0}
                        </p>
                        <p className="text-xs text-slate-400">Aktivitas</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-lg w-fit">
                {[
                    { id: 'profile', label: 'Edit Profil', icon: 'edit' },
                    { id: 'password', label: 'Ganti Password', icon: 'lock' },
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
                            <span className="flex items-center justify-center text-[14px] flex-shrink-0">
                                <MaterialIcon name={tab.icon} className="w-full h-full" />
                            </span>
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* TAB: Edit Profil */}
            {activeTab === 'profile' && (
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Informasi Akun</h3>

                    <Alert type="error" message={profileError} />
                    {profileSuccess && <Alert type="success" message={profileSuccess} />}

                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={profileForm.fullName}
                                onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                                className="input-field"
                                placeholder="Nama lengkap"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                                className="input-field"
                                placeholder="email@contoh.com"
                            />
                        </div>

                        {/* Role — read only */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
                            <div className="input-field bg-slate-50 text-slate-500 cursor-not-allowed">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                        <MaterialIcon name={profile?.role === 'ADMIN' ? 'admin_panel_settings' : 'person'} className="w-full h-full" />
                                    </span>
                                    {profile?.role === 'ADMIN' ? 'Administrator' : 'Staff'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">Role tidak dapat diubah sendiri</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="btn-primary"
                            >
                                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TAB: Ganti Password */}
            {activeTab === 'password' && (
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">Ubah Password</h3>
                    <p className="text-xs text-slate-400 mb-4">
                        Gunakan password yang kuat dan tidak mudah ditebak
                    </p>

                    <Alert type="error" message={passError} />
                    {passSuccess && <Alert type="success" message={passSuccess} />}

                    <form onSubmit={handlePassSubmit} className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Password Saat Ini <span className="text-red-500">*</span>
                            </label>  
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passForm.currentPassword}
                                    onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                    className="input-field pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    {showPasswords.current ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Password Baru <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passForm.newPassword}
                                    onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                                    className="input-field pr-10"
                                    placeholder="Min. 6 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    {showPasswords.new ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {/* Password strength indicator */}
                            {passForm.newPassword && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors ${passForm.newPassword.length >= i * 3
                                                    ? i <= 1 ? 'bg-red-400'
                                                        : i <= 2 ? 'bg-amber-400'
                                                            : i <= 3 ? 'bg-blue-400'
                                                                : 'bg-teal-500'
                                                    : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                        {passForm.newPassword.length < 6 ? 'Terlalu pendek' :
                                            passForm.newPassword.length < 9 ? 'Lemah' :
                                                passForm.newPassword.length < 12 ? 'Cukup' : 'Kuat'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">
                                Konfirmasi Password Baru <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passForm.confirmPassword}
                                    onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                    className={`input-field pr-10 ${passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword
                                        ? 'border-red-300 focus:ring-red-400'
                                        : passForm.confirmPassword && passForm.newPassword === passForm.confirmPassword
                                            ? 'border-teal-300 focus:ring-teal-400'
                                            : ''
                                        }`}
                                    placeholder="Ulangi password baru"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShow('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    {showPasswords.confirm ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {passForm.confirmPassword && (
                                <p className={`text-[11px] mt-1 ${passForm.newPassword === passForm.confirmPassword
                                    ? 'text-teal-600'
                                    : 'text-red-500'
                                    }`}>
                                    {passForm.newPassword === passForm.confirmPassword
                                        ? '✓ Password cocok'
                                        : '✗ Password tidak cocok'}
                                </p>
                            )}
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={passMutation.isPending}
                                className="btn-primary"
                            >
                                {passMutation.isPending ? 'Memproses...' : 'Ubah Password'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}