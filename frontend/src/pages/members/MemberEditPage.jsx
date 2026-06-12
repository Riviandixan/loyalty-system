import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../../services';
import { Spinner, Alert } from '../../components/ui';

export default function MemberEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
    });

    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: () => memberApi.get(id).then((r) => r.data.data),
    });

    // Isi form ketika data member sudah load
    useEffect(() => {
        if (member) {
            setForm({
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                status: member.status,
            });
        }
    }, [member]);

    const mutation = useMutation({
        mutationFn: (data) => memberApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['members']);
            queryClient.invalidateQueries(['member', id]);
            navigate(`/members/${id}`);
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Gagal memperbarui member');
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

    if (isLoading) return <Spinner />;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link to={`/members/${id}`} className="text-slate-400 hover:text-slate-600 text-sm">
                    ← Kembali
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-lg font-semibold text-slate-900">Edit Member</h1>
            </div>

            {/* Member code info */}
            <div className="card p-4 mb-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-semibold flex-shrink-0">
                    {member?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-800">{member?.fullName}</p>
                    <p className="text-xs text-slate-400">{member?.memberCode}</p>
                </div>
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
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                        <div className="flex items-center gap-4">
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

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="btn-primary"
                        >
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <Link to={`/members/${id}`} className="btn-secondary">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}