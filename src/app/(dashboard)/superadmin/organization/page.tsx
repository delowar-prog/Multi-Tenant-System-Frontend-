"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { fetchOrganizations} from "src/services/tenantServices";
import { api } from "src/lib/api";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: Tenant[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const UserPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [impersonatingId, setImpersonatingId] = useState<number | null>(null);


  /** --------------------------
   * Load users from API
   * -------------------------- */
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        const response = await fetchOrganizations(1, perPage);
        setTenants(response.data);
        setPagination(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, [perPage]);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchOrganizations(page, perPage);
      setTenants(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    try {
      setLoading(true);
      const response = await fetchOrganizations(1, newPerPage);
      setTenants(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async (tenantId: number) => {
    try {
      setImpersonatingId(tenantId);
      const res = await api.post(`/admin/impersonate/${tenantId}`);
      const token = res?.data?.impersonation_token;
      if (token) {
        localStorage.setItem("token_impersonation", token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("impersonation-changed"));
        }
      }
    } catch (err) {
      console.error("Failed to impersonate tenant:", err);
    } finally {
      setImpersonatingId(null);
    }
  };

const filteredOrganizations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return tenants;
    return tenants.filter((t) => {
      const name = t.name?.toLowerCase() ?? "";
      const email = t.email?.toLowerCase() ?? "";
      const phone = t.phone?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [tenants, searchTerm]);

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-red-500 dark:border-slate-700 dark:bg-slate-900">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Organization Management</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, phone"
              aria-label="Search users"
              className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="per-page" className="text-sm text-gray-700 mr-2 dark:text-slate-300">Show:</label>
            <select
              id="per-page"
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <label className="text-sm text-gray-700 ml-1 dark:text-slate-300">entries</label>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">SL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">SL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Organization Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Impersonate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {filteredOrganizations.map((org, index) => (
              <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{org.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{org.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{org.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{org.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{org.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                  <button
                    onClick={() => handleImpersonate(org.id)}
                    disabled={impersonatingId === org.id}
                    className="px-3 py-1 text-xs uppercase cursor-pointer font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    {impersonatingId === org.id ? "Impersonating..." : "Impersonate"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => {/* handle edit */}} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => {/* handle delete */}} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredOrganizations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-slate-300">
            {searchTerm.trim()
              ? <>Showing {filteredOrganizations.length} results on this page</>
              : <>Showing {pagination.from} to {pagination.to} of {pagination.total} entries</>
            }
          </div>
          <div className="flex justify-center space-x-2">
            {pagination.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.page && handlePageChange(link.page)}
                disabled={link.page === null || link.active}
                className={`px-3 py-2 text-sm font-medium rounded ${link.active
                    ? 'bg-blue-500 text-white dark:bg-blue-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  } ${link.page === null ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
