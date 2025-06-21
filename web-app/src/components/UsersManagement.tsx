'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const users = [
        {
            id: 1,
            username: 'john.doe',
            email: 'john.doe@cineplex.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2024-01-15 14:30',
            createdAt: '2023-06-15'
        },
        {
            id: 2,
            username: 'jane.smith',
            email: 'jane.smith@cineplex.com',
            role: 'manager',
            status: 'active',
            lastLogin: '2024-01-15 13:45',
            createdAt: '2023-08-22'
        },
        {
            id: 3,
            username: 'mike.wilson',
            email: 'mike.wilson@cineplex.com',
            role: 'user',
            status: 'inactive',
            lastLogin: '2024-01-10 09:15',
            createdAt: '2023-11-05'
        },
        {
            id: 4,
            username: 'sarah.jones',
            email: 'sarah.jones@cineplex.com',
            role: 'manager',
            status: 'active',
            lastLogin: '2024-01-15 12:20',
            createdAt: '2023-09-12'
        }
    ];

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
            case 'manager': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
            case 'user': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
            : 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Database Users</h1>
                    <p className="text-slate-400 mt-1">Manage user accounts and permissions</p>
                </div>
                <button className="bg-sky-500/20  border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add User</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-black border border-slate-700 rounded-xl p-6">
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
            </div>

            {/* Users Table */}
            <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">User</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Role</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Last Login</th>
                                <th className="px-6 py-4 text-left text-slate-300 font-medium">Created</th>
                                <th className="px-6 py-4 text-right text-slate-300 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-black border border-slate-700 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-white font-medium">{user.username}</div>
                                            <div className="text-slate-400 text-sm">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-sm">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-sm">
                                        {user.createdAt}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 