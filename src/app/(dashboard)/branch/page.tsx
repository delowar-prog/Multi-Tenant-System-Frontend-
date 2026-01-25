"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createBranch, fetchBranches } from "src/services/branchServices";
import { fetchTenants } from "src/services/tenantServices";
import { useAuth } from "src/context/authContext";

interface Branch {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}
interface Tenant {
  id: string;
  name: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: Branch[];
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

interface TenantOption {
  id: string;
  name: string;
  logo_url?: string | null;
}

type BranchFormState = {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const emptyForm = (tenantId: string): BranchFormState => ({
  tenantId,
  name: "",
  email: "",
  phone: "",
  address: "",
});

const formatDate = (value: string | undefined) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const BranchPage: React.FC = () => {
  const { me } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [perPage, setPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const defaultTenantId = useMemo(() => {
    const raw = me?.tenant_id;
    if (raw === null || raw === undefined) return "";
    return String(raw);
  }, [me?.tenant_id]);

  const [formState, setFormState] = useState<BranchFormState>(() => emptyForm(defaultTenantId));

  useEffect(() => {
    if (!defaultTenantId) return;
    setFormState((prev) => (prev.tenantId ? prev : { ...prev, tenantId: defaultTenantId }));
  }, [defaultTenantId]);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        setTenantLoading(true);
        setTenantError(null);
        const response = await fetchTenants();
        setTenants(Array.isArray(response) ? response : []);
      } catch (err) {
        setTenantError(err instanceof Error ? err.message : "Failed to load tenants");
      } finally {
        setTenantLoading(false);
      }
    };

    loadTenants();
  }, []);

  const normalizeResponse = (response: ApiResponse | Branch[]) => {
    if (Array.isArray(response)) {
      return { items: response, page: null as ApiResponse | null };
    }
    return { items: response?.data ?? [], page: response ?? null };
  };

  const applyResponse = (response: ApiResponse | Branch[], fallbackPage: number) => {
    const normalized = normalizeResponse(response);
    setBranches(normalized.items);
    setPagination(normalized.page);
    setCurrentPage(normalized.page?.current_page ?? fallbackPage);
  };

  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchBranches(1, perPage);
        applyResponse(response, 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while loading branches");
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, [perPage]);


  const handlePageChange = async (page: number) => {
    if (!pagination) {
      setCurrentPage(page);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBranches(page, perPage);
      applyResponse(response, page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while loading branches");
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = async (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBranches(1, newPerPage);
      applyResponse(response, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while loading branches");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState(emptyForm(defaultTenantId));
    setFormError(null);
  };

  const handleAddBranch = async () => {
    const payload = {
      tenant_id: formState.tenantId.trim(),
      name: formState.name.trim(),
      email: formState.email.trim() || undefined,
      phone: formState.phone.trim() || undefined,
      address: formState.address.trim() || undefined,
    };

    if (!payload.tenant_id || !payload.name) {
      setFormError("Tenant ID and Branch Name are required.");
      return;
    }

    try {
      setCreating(true);
      setFormError(null);
      await createBranch(payload);
      setShowAddModal(false);
      resetForm();
      const targetPage = pagination?.current_page ?? currentPage ?? 1;
      const updatedResponse = await fetchBranches(targetPage, perPage);
      applyResponse(updatedResponse, targetPage);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An error occurred while creating branch");
    } finally {
      setCreating(false);
    }
  };

  const filteredBranches = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((branch) => {
      const name = branch.name?.toLowerCase() ?? "";
      const email = branch.email?.toLowerCase() ?? "";
      const phone = branch.phone?.toLowerCase() ?? "";
      const address = branch.address?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query) || phone.includes(query) || address.includes(query);
    });
  }, [branches, searchTerm]);

  const hasServerPagination = Boolean(pagination && pagination.links?.length);
  const clientTotalPages = useMemo(() => {
    return Math.ceil(filteredBranches.length / perPage);
  }, [filteredBranches.length, perPage]);
  const totalPages = hasServerPagination ? (pagination?.last_page ?? 0) : clientTotalPages;
  const activePage = hasServerPagination ? (pagination?.current_page ?? currentPage) : currentPage;

  useEffect(() => {
    if (hasServerPagination) return;
    if (searchTerm.trim()) {
      setCurrentPage(1);
    }
  }, [hasServerPagination, searchTerm]);

  useEffect(() => {
    if (hasServerPagination) return;
    if (clientTotalPages > 0 && currentPage > clientTotalPages) {
      setCurrentPage(clientTotalPages);
    }
  }, [hasServerPagination, clientTotalPages, currentPage]);

  const displayedBranches = useMemo(() => {
    if (hasServerPagination) return filteredBranches;
    const start = (currentPage - 1) * perPage;
    return filteredBranches.slice(start, start + perPage);
  }, [filteredBranches, hasServerPagination, currentPage, perPage]);

  const paginationLinks = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = new Set<number>();
    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i += 1) {
        if (i >= 1 && i <= totalPages) pages.add(i);
      }
    };
    addRange(1, 3);
    addRange(totalPages - 2, totalPages);
    addRange(activePage - 1, activePage + 1);
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const items: Array<{
      type: "page" | "ellipsis" | "prev" | "next";
      label: string;
      page: number | null;
      active?: boolean;
      disabled?: boolean;
    }> = [];
    items.push({
      type: "prev",
      label: "Previous",
      page: activePage > 1 ? activePage - 1 : null,
      disabled: activePage <= 1,
    });
    let last = 0;
    for (const page of sorted) {
      if (last && page - last > 1) {
        items.push({ type: "ellipsis", label: "...", page: null });
      }
      items.push({
        type: "page",
        label: String(page),
        page,
        active: page === activePage,
      });
      last = page;
    }
    items.push({
      type: "next",
      label: "Next",
      page: activePage < totalPages ? activePage + 1 : null,
      disabled: activePage >= totalPages,
    });
    return items;
  }, [totalPages, activePage]);

  const shouldShowPagination = totalPages > 1;

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 text-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Branch Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Branch
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, phone, address"
              aria-label="Search branches"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-t-lg dark:bg-slate-900 dark:border-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {displayedBranches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                  {branch.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                  {branch.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                  {branch.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                  <div className="max-w-[320px] truncate" title={branch.address}>
                    {branch.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                  {formatDate(branch.created_at)}
                </td>
              </tr>
            ))}
            {displayedBranches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
                  No branches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {shouldShowPagination && (
        <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-slate-300">
            {searchTerm.trim()
              ? <>Showing {displayedBranches.length} results on this page</>
              : <>
                Showing {hasServerPagination ? pagination?.from ?? 0 : (filteredBranches.length ? (activePage - 1) * perPage + 1 : 0)}
                {" "}to{" "}
                {hasServerPagination ? pagination?.to ?? 0 : Math.min(activePage * perPage, filteredBranches.length)}
                {" "}of{" "}
                {hasServerPagination ? pagination?.total ?? 0 : filteredBranches.length}
                {" "}entries
              </>
            }
          </div>
          <div className="flex justify-center space-x-2">
            {paginationLinks.map((link, index) => (
              link.type === "ellipsis" ? (
                <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500 dark:text-slate-400">
                  {link.label}
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => link.page && handlePageChange(link.page)}
                  disabled={link.page === null || link.active || link.disabled}
                  className={`px-3 py-2 text-sm font-medium rounded ${link.active
                    ? "bg-blue-500 text-white dark:bg-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    } ${(link.page === null || link.disabled) ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">
                Add New Branch
              </h3>
              {tenantError && (
                <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
                  {tenantError}
                </div>
              )}
              {formError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4">
                <select
                  value={formState.tenantId}
                  onChange={(e) => setFormState((prev) => ({ ...prev, tenantId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-800/60"
                >
                  <option value="">{tenantLoading ? "Loading tenants..." : "Select tenant"}</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Branch Name"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <textarea
                  placeholder="Address"
                  value={formState.address}
                  onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center px-4 py-4 space-x-4">
                <button
                  onClick={handleAddBranch}
                  disabled={creating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {creating ? "Creating..." : "Create Branch"}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchPage;
