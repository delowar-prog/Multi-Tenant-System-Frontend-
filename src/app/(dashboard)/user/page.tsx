"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { fetchUsers, assignRole, createUser, assignBranch } from "src/services/userServices";
import { fetchAllBranches, fetchBranchSelect } from "src/services/branchServices";
import { fetchRoles } from "src/services/roleServices";
import { UserPlus } from "lucide-react";
import IconButton from "src/app/(dashboard)/includes/iconBtn";
import IconComponent from "src/app/(dashboard)/includes/iconComponent";

interface Branch {
  id: string;
  name: string;
  email?: string;
  address?: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: any[]; // Assuming permissions array, adjust if needed
  branches?: Branch[];
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface ApiResponse {
  current_page: number;
  data: User[];
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
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [showAssignBranchModal, setShowAssignBranchModal] = useState(false);
  const [assignBranchError, setAssignBranchError] = useState<string | null>(null);
  const [assigningBranches, setAssigningBranches] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [selectBranches, setSelectBranches] = useState<Branch[]>([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);

  /** --------------------------
   * Load users from API
   * -------------------------- */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers(1, perPage);
        setUsers(response.data);
        setPagination(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [perPage]);

  /** --------------------------
   * Load roles for assignment
   * -------------------------- */
  const loadRoles = async () => {
    try {
      const response = await fetchRoles(1, 100); // Large per_page to get all roles
      setRoles(response.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    loadRoles();
    fetchBranchSelect().then((data) => setSelectBranches(Array.isArray(data) ? data : [])).catch(console.error);
  }, []);

  const loadBranches = async () => {
    try {
      setBranchLoading(true);
      setBranchError(null);
      const response = await fetchAllBranches();
      setBranches(Array.isArray(response) ? response : []);
    } catch (err) {
      setBranchError(err instanceof Error ? err.message : "An error occurred while fetching branches");
    } finally {
      setBranchLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchUsers(page, perPage);
      setUsers(response.data);
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
      const response = await fetchUsers(1, newPerPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const resetUserForm = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserPhone("");
    setUserAddress("");
    setSelectedBranchIds([]);
  };

  const handleAddUser = async () => {
    try {
      await createUser({
        name: userName,
        email: userEmail,
        password: userPassword,
        phone: userPhone,
        address: userAddress,
        branches: selectedBranchIds,
      });
      setShowAddModal(false);
      resetUserForm();
      const response = await fetchUsers(pagination?.current_page || 1, perPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating user');
    }
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole("");
    setShowAssignModal(true);
  };

  const handleAssignBranch = (user: User) => {
    const preselected = user.branches?.[0]?.id ?? "";
    setSelectedUser(user);
    setSelectedBranchId(preselected);
    setBranchSearchTerm("");
    setAssignBranchError(null);
    setShowAssignBranchModal(true);
    if (!branches.length) {
      loadBranches();
    }
  };

  const handleAssignRoleSubmit = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await assignRole(selectedUser.id, selectedRole);
      setShowAssignModal(false);
      // Reload users to reflect changes
      const response = await fetchUsers(pagination?.current_page || 1, perPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while assigning role');
    }
  };

  const handleAssignBranchSubmit = async () => {
    if (!selectedUser || !selectedBranchId) return;

    try {
      setAssigningBranches(true);
      setAssignBranchError(null);
      await assignBranch(selectedUser.id, selectedBranchId);
      setShowAssignBranchModal(false);
      const response = await fetchUsers(pagination?.current_page || 1, perPage);
      setUsers(response.data);
      setPagination(response);
    } catch (err) {
      setAssignBranchError(err instanceof Error ? err.message : "An error occurred while assigning branch");
    } finally {
      setAssigningBranches(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const phone = user.phone?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [users, searchTerm]);

  const filteredBranchOptions = useMemo(() => {
    const query = branchSearchTerm.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((branch) => {
      const name = branch.name?.toLowerCase() ?? "";
      const email = branch.email?.toLowerCase() ?? "";
      const address = branch.address?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query) || address.includes(query);
    });
  }, [branches, branchSearchTerm]);

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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">User Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            +Create User
          </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                  {user.roles.map(role => role.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <IconButton onClick={() => {/* handle edit */ }} label="Edit">
                    <IconComponent name="edit" className="h-4 w-4 text-indigo-600" />
                  </IconButton>
                  <IconButton onClick={() => {/* handle delete */ }} label="Delete">
                    <IconComponent name="delete" className="h-4 w-4 text-red-600" />
                  </IconButton>
                  <IconButton onClick={() => handleAssignRole(user)} label="Assign Role">
                    <IconComponent name="user" className="h-4 w-4 text-green-600" />
                  </IconButton>
                  <IconButton onClick={() => handleAssignBranch(user)} label="Assign Branch">
                    <IconComponent name="id" className="h-4 w-4 text-amber-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-slate-300">
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
              ? <>Showing {filteredUsers.length} results on this page</>
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

      {/* Create User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-slate-100">Create User</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Phone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Address"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Branches</label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 dark:border-slate-700 dark:bg-slate-800">
                  {selectBranches.map((branch) => (
                    <div key={branch.id} className="flex items-center mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        id={`branch-${branch.id}`}
                        checked={selectedBranchIds.includes(branch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBranchIds([...selectedBranchIds, branch.id]);
                          } else {
                            setSelectedBranchIds(selectedBranchIds.filter((id) => id !== branch.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      />
                      <label htmlFor={`branch-${branch.id}`} className="ml-2 text-sm text-gray-900 dark:text-slate-100 cursor-pointer select-none">
                        {branch.name}
                      </label>
                    </div>
                  ))}
                  {selectBranches.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No branches available</p>
                  )}
                </div>
              </div>

              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={handleAddUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Create User
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetUserForm();
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

      {/* Assign Role Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black/70" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">Assign Role to {selectedUser?.name}</h3>
              <div className="mt-2 px-7 py-3">
                <select
                  value={selectedRole || ''}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAssignRoleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={!selectedRole}
                >
                  Assign Role
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignBranchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full dark:bg-black/70">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-100">
                Assign Branch to {selectedUser?.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
                Select a branch to assign.
              </p>
              {branchError && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  {branchError}
                </div>
              )}
              {assignBranchError && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                  {assignBranchError}
                </div>
              )}
              <div className="mt-4">
                <input
                  type="text"
                  value={branchSearchTerm}
                  onChange={(e) => setBranchSearchTerm(e.target.value)}
                  placeholder="Search branches"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </div>
              <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-gray-200 dark:border-slate-700">
                {branchLoading ? (
                  <div className="px-4 py-6 text-sm text-gray-500 dark:text-slate-300">
                    Loading branches...
                  </div>
                ) : filteredBranchOptions.length ? (
                  filteredBranchOptions.map((branch) => (
                    <label
                      key={branch.id}
                      className="flex items-start gap-3 border-b border-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <input
                        type="radio"
                        name="branch-selection"
                        checked={selectedBranchId === branch.id}
                        onChange={() => setSelectedBranchId(branch.id)}
                        className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <span className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-slate-100">{branch.name}</span>
                        {branch.email && (
                          <span className="text-xs text-gray-500 dark:text-slate-400">{branch.email}</span>
                        )}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-6 text-sm text-gray-500 dark:text-slate-300">
                    No branches found.
                  </div>
                )}
              </div>
              <div className="items-center px-4 py-4">
                <button
                  onClick={handleAssignBranchSubmit}
                  className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={assigningBranches || !selectedBranchId}
                >
                  {assigningBranches ? "Assigning..." : "Assign Branch"}
                </button>
                <button
                  onClick={() => setShowAssignBranchModal(false)}
                  className="mt-3 w-full rounded-md bg-gray-300 px-4 py-2 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
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

export default UserPage;
