'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Check, X } from 'lucide-react';
import { User } from '@/types/Users';
import { AddUser } from './modals/AddUser';
import axios from 'axios';
import DeleteConfirm from './modals/DeleteConfirm';
import { EditUser } from './modals/EditUser';
import Error from './modals/Error';

export default function Users() {
    const [refresh, setRefresh] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`/api/users/${currentUsername}`);
            setIsDeleteUserModalOpen(false);
            setRefresh(!refresh);
        } catch (error) {
            setIsError(true);
            // Check if error response exists and has data
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to delete user. Please try again.');
            }
            console.error('Failed to delete user:', error);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [refresh]);



    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-slate-700 rounded"></div>
                        <div className="h-4 w-64 bg-slate-700 rounded mt-1"></div>
                    </div>
                    <div className="h-12 w-32 bg-slate-700 rounded-lg"></div>
                </div>

                {/* Filters */}
                {/* <div className="bg-black border border-slate-700 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="h-12 flex-1 bg-slate-700 rounded-lg"></div>
                        <div className="h-12 w-40 bg-slate-700 rounded-lg"></div>
                    </div>
                </div> */}

                {/* Users Table */}
                <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black border-b border-slate-700">
                                <tr>
                                    {[...Array(7)].map((_, i) => (
                                        <th key={i} className="px-6 py-4">
                                            <div className="h-4 bg-slate-700 rounded w-20"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-700 rounded w-16"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Database Users</h1>
                    <p className="text-slate-400 mt-1">Manage user accounts and permissions</p>
                </div>
                <button onClick={() => setIsAddUserModalOpen(true)} className="bg-sky-500/20  border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add User</span>
                </button>
            </div>

            {/* Filters */}
            {/* <div className="bg-black border border-slate-700 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-black border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="text-slate-400 w-5 h-5" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 bg-black border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </div> */}

            {/* Users Table */}
            <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Username</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Superuser</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Create DB</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Replicable</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Bypass RLS</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Password Expire</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map((user: User) => (
                                <tr key={user.username} className="hover:bg-black border border-slate-700 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-white font-medium">{user.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isSuperuser ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isCreateDB ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.byPassRLS ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isReplicable ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
                                    </td>
                                    <td className="px-6 py-4 text-white text-sm">
                                        {user.passwordExpire ? new Date(user.passwordExpire).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors" onClick={() => {
                                                setCurrentUsername(user.username);
                                                setIsEditUserModalOpen(true);
                                            }}>
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" onClick={() => {
                                                setCurrentUsername(user.username);
                                                setIsDeleteUserModalOpen(true);
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <DeleteConfirm isOpen={isDeleteUserModalOpen} onClose={() => setIsDeleteUserModalOpen(false)} onConfirm={handleDeleteUser} title="Delete User" message="Are you sure you want to delete this user?" />
            </div>
            <AddUser isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
            <EditUser isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} currentUsername={currentUsername} onSuccess={() => setRefresh(!refresh)} />
            <Error isOpen={isError} onClose={() => setIsError(false)} message={errorMessage} />
        </div>
    );
} 