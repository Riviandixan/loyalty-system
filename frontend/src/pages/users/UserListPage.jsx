import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../services';
import { MaterialIcon, Spinner, EmptyState, Modal, Alert } from '../../components/ui';

const RoleBadge = ({ role }) => {
    if (role === 'ADMIN')
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium leading-none bg-blue-50 text-blue-700">
                <span className="flex items-center justify-center w-3.5 h-3.5 flex-shrink-0">
                    <MaterialIcon name="admin_panel_settings" className="text-[13px] leading-none" />
                </span>
                Admin
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium leading-none bg-slate-100 text-slate-600">
            <span className="flex items-center justify-center w-3.5 h-3.5 flex-shrink-0">
                <MaterialIcon name="person" className="text-[13px] leading-none" />
            </span>
            Staff
        </span>
    );
};

const emptyForm = { fullName: '', email: '', password: '', role: 'STAFF' };

export default function UserListPage() {
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null); // null = create mode
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null); // user object to delete

    useEffect(() => {
        if (!successMessage) return;
        const timer = window.setTimeout(() => setSuccessMessage(''), 4000);
        return () => window.clearTimeout(timer);
    }, [successMessage]);

    useEffect(() => {
        if (!deleteError) return;
        const timer = window.setTimeout(() => setDeleteError(''), 4000);
        return () => window.clearTimeout(timer);
    }, [deleteError]);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => userApi.list().then((r) => r.data.data),
    });

    const createMutation = useMutation({
        mutationFn: (data) => userApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            handleCloseModal();
            setSuccessMessage('User berhasil dibuat.');
        },
        onError: (err) => setFormError(err.response?.data?.message || 'Gagal membuat user'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => userApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            handleCloseModal();
            setSuccessMessage('Perubahan user berhasil disimpan.');
        },
        onError: (err) => setFormError(err.response?.data?.message || 'Gagal memperbarui user'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setSuccessMessage(`User "${deleteConfirm?.fullName}" berhasil dihapus.`);
            setDeleteConfirm(null);
        },
        onError: (err) => setDeleteError(err.response?.data?.message || 'Gagal menghapus user'),
    });

    const handleOpenCreate = () => {
        setEditUser(null);
        setForm(emptyForm);
        setFormError('');
        setShowModal(true);
    };

    const handleOpenDelete = (user) => {
        setDeleteConfirm(user);
        setDeleteError('');
    };

    const handleOpenEdit = (user) => {
        setEditUser(user);
        setForm({ fullName: user.fullName, email: user.email, password: '', role: user.role });
        setFormError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditUser(null);
        setForm(emptyForm);
        setFormError('');
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (!form.fullName || !form.email) {
            setFormError('Nama dan email wajib diisi');
            return;
        }
        if (!editUser && !form.password) {
            setFormError('Password wajib diisi untuk user baru');
            return;
        }

        if (editUser) {
            const payload = { fullName: form.fullName, email: form.email, role: form.role };
            if (form.password) payload.password = form.password;
            updateMutation.mutate({ id: editUser.id, data: payload });
        } else {
            createMutation.mutate(form);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Manajemen User</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola akun admin dan staff sistem
                    </p>
                </div>
                <button onClick={handleOpenCreate} className="btn-primary">
                    + Tambah User
                </button>
            </div>

            {successMessage && <Alert type="success" message={successMessage} />}

            {/* Table */}
            <div className="card overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : !users?.length ? (
                    <EmptyState message="Belum ada user" />
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-th">Nama</th>
                                <th className="table-th">Email</th>
                                <th className="table-th text-center">Role</th>
                                <th className="table-th">Dibuat</th>
                                <th className="table-th text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    {/* Nama */}
                                    <td className="table-td">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-semibold flex-shrink-0">
                                                {user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <span className="font-medium text-slate-800">{user.fullName}</span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="table-td text-slate-500">{user.email}</td>

                                    {/* Role */}
                                    <td className="table-td text-center">
                                        <RoleBadge role={user.role} />
                                    </td>

                                    {/* Dibuat */}
                                    <td className="table-td text-slate-400 text-xs">{formatDate(user.createdAt)}</td>

                                    {/* Aksi */}
                                    <td className="table-td text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(user)}
                                                className="px-2.5 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleOpenDelete(user)}
                                                className="px-2.5 py-1 text-xs rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editUser ? 'Edit User' : 'Tambah User Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Alert type="error" message={formError} />

                    {/* Nama */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Contoh: Budi Santoso"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="budi@loyaltyos.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Password{' '}
                            {editUser ? (
                                <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>
                            ) : (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder={editUser ? '••••••••' : 'Min. 6 karakter'}
                            minLength={form.password ? 6 : undefined}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
                        <div className="flex items-center gap-4">
                            {['ADMIN', 'STAFF'].map((r) => (
                                <label key={r} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r}
                                        checked={form.role === r}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                                                <MaterialIcon name={r === 'ADMIN' ? 'admin_panel_settings' : 'person'} className="text-[14px]" />
                                            </span>
                                            {r === 'ADMIN' ? 'Admin' : 'Staff'}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            Admin dapat mengakses semua fitur termasuk audit log & manajemen user
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                        <button type="submit" disabled={isPending} className="btn-primary">
                            {isPending ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Buat User'}
                        </button>
                        <button type="button" onClick={handleCloseModal} className="btn-secondary">
                            Batal
                        </button>
                    </div>
                </form>
            </Modal>

            {/* DELETE CONFIRM MODAL */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Hapus User"
            >
                <div className="space-y-4">
                    {deleteError && <Alert type="error" message={deleteError} />}
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <MaterialIcon name="warning" className="w-5 h-5 mt-0.5 text-red-500 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Hapus user <span className="text-red-600">"{deleteConfirm?.fullName}"</span>?
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Tindakan ini tidak dapat dibatalkan. User tidak akan bisa login setelah dihapus.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => deleteMutation.mutate(deleteConfirm.id)}
                            disabled={deleteMutation.isPending}
                            className="btn-danger"
                        >
                            {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="btn-secondary"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}