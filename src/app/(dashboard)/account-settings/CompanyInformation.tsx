import React, { useEffect, useState } from 'react'
import { api } from 'src/lib/api';

interface Tenant {
  id: string;                 // UUID
  name: string;               // Organization / Tenant name
  logo?: string | null;       // Logo URL or path
  logo_url?: string | null;   // 
  primary_color?: string;     // HEX color, e.g. '#0d6efd'
  secondary_color?: string;   // HEX color, e.g. '#6c757d'
  address?: string;
  email?: string ;
  phone?: string ;
  created_at?: string;        // Timestamp
  updated_at?: string;        // Timestamp
}

const CompanyInformation = () => {
const [tenant, setTenant] = useState<Tenant>({});
const [formData, setFormData] = useState({
  name: '',
  primary_color: '',
  logo: null as File | null,
  address: '',
  email: '',
  phone: ''
});

useEffect(() => {
  fetchTenant();
}, []);

const fetchTenant = () => {
  api.get("/tenant").then(res => {
    setTenant(res.data);
    setFormData({
      name: res.data.name || '',
      primary_color: res.data.primary_color || '',
      logo: null,
      address: res.data.address || '',
      email: res.data.email || '',
      phone: res.data.phone || ''
    });
  });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('name', formData.name);
  fd.append('primary_color', formData.primary_color);
  if (formData.logo) fd.append('logo', formData.logo);
  fd.append('address', formData.address);
  fd.append('email', formData.email);
  fd.append('phone', formData.phone);

  try {
    await api.post('/tenant/update', fd);
    // Refetch data
    fetchTenant();
    alert('Company information updated successfully!');
  } catch (error) {
    console.error('Update failed', error);
  }
};

    return (
        <form onSubmit={handleSubmit}>
        <section
            id="profile"
            className="profile-reveal profile-stagger-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company Profile</p>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Company information</h2>
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Update Company Info
                </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                    {tenant.logo_url ? (
                        <img src={tenant.logo_url} alt="Logo" className="h-16 w-16 rounded-2xl object-cover shadow-sm" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-sm dark:bg-white dark:text-slate-900">
                            {tenant.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{tenant.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tenant Admin</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                        className="text-xs"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="full-name" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Full name
                        </label>
                        <input
                            id="full-name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="primary-color" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Primary Color
                        </label>
                        <input
                            id="primary-color"
                            name="primary_color"
                            value={formData.primary_color}
                            onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="work-email" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Work email
                        </label>
                        <input
                            id="work-email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Location
                        </label>
                        <input
                            id="location"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                        />
                    </div>
                </div>
            </div>
        </section>
        </form>
    )
}

export default CompanyInformation