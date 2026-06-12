import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../../services';
import { Alert } from '../../components/ui';

export default function MemberCreatePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        status: 'ACTIVE',
    });

    const mutation = useMutation({
        mutationFn: (data) => memberApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['members']);
            navigate('/members');
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Gagal menambahkan member');
        },
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName || !form.email || !form.phone) {
            setError('Nama, email, dan nomor HP wajib diisi');
            return;
        }

        mutation.mutate(form);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/members" className="text-slate-400 hover:text-slate-600 text-sm">
                    ← Kembali
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-lg font-semibold text-slate-900">Tambah Member Baru</h1>
            </div>

            <div className="card p-6">
                <Alert type="error" message={error} />

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
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
                            placeholder="budi@email.com"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Nomor HP <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="08123456789"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Tanggal Lahir
                            <span className="text-slate-400 font-normal ml-1">(opsional)</span>
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                        <div className="flex items-center gap-3">
                            {['ACTIVE', 'INACTIVE'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={form.status === s}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">
                                        {s === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Info kode member */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700">
                        💡 Kode member akan di-generate otomatis oleh sistem (contoh: MBR-000006)
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="btn-primary"
                        >
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan Member'}
                        </button>
                        <Link to="/members" className="btn-secondary">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}